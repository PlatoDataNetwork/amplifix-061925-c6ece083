import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  author?: string;
  imageUrl?: string;
  content?: string;
}

interface RSSFeed {
  id: string;
  name: string;
  feed_url: string;
  vertical_slug: string;
  default_author: string | null;
  default_image_url: string | null;
  check_duplicate_title: boolean;
  check_duplicate_link: boolean;
  max_articles_per_sync: number;
  strip_images: boolean;
  strip_inline_styles: boolean;
  import_mode: 'full_content' | 'excerpt_with_link';
  publish_status: 'publish' | 'draft';
  source_link_text: string | null;
  source_link_url: string | null;
}

// Parse RSS/Atom XML to extract items
function parseRSSFeed(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  // Check if it's Atom format
  const isAtom = xmlText.includes('<feed') && xmlText.includes('xmlns="http://www.w3.org/2005/Atom"');
  
  if (isAtom) {
    // Parse Atom feed
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
    let match;
    
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entry = match[1];
      
      const title = extractTag(entry, 'title') || '';
      const link = extractAtomLink(entry) || '';
      const description = extractTag(entry, 'summary') || extractTag(entry, 'content') || '';
      const pubDate = extractTag(entry, 'published') || extractTag(entry, 'updated') || '';
      const guid = extractTag(entry, 'id') || link;
      const author = extractTag(entry, 'name') || '';
      const content = extractTag(entry, 'content') || description;
      const imageUrl = extractMediaImage(entry);
      
      if (title && (link || guid)) {
        items.push({ title, link, description, pubDate, guid, author, content, imageUrl });
      }
    }
  } else {
    // Parse RSS 2.0 feed
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const item = match[1];
      
      const title = extractTag(item, 'title') || '';
      const link = extractTag(item, 'link') || '';
      const description = extractTag(item, 'description') || '';
      const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date') || '';
      const guid = extractTag(item, 'guid') || link;
      const author = extractTag(item, 'author') || extractTag(item, 'dc:creator') || '';
      const content = extractTag(item, 'content:encoded') || description;
      const imageUrl = extractMediaImage(item) || extractEnclosure(item);
      
      if (title && (link || guid)) {
        items.push({ title, link, description, pubDate, guid, author, content, imageUrl });
      }
    }
  }
  
  return items;
}

function extractTag(xml: string, tagName: string): string | null {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) {
    return decodeHTMLEntities(cdataMatch[1].trim());
  }
  
  // Handle regular tags
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  if (match) {
    return decodeHTMLEntities(match[1].trim());
  }
  
  return null;
}

function extractAtomLink(entry: string): string | null {
  // Look for link with rel="alternate" or no rel attribute
  const linkMatch = entry.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  return linkMatch ? linkMatch[1] : null;
}

function extractMediaImage(item: string): string | null {
  // Try media:content
  const mediaMatch = item.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (mediaMatch) return mediaMatch[1];
  
  // Try media:thumbnail
  const thumbMatch = item.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (thumbMatch) return thumbMatch[1];
  
  // Try to find image in content
  const imgMatch = item.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch) return imgMatch[1];
  
  return null;
}

function extractEnclosure(item: string): string | null {
  const enclosureMatch = item.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image[^"']*["'][^>]*>/i);
  if (enclosureMatch) return enclosureMatch[1];
  
  // Check for enclosure with image type in any order
  const enclosure = item.match(/<enclosure([^>]*)>/i);
  if (enclosure) {
    const attrs = enclosure[1];
    if (attrs.includes('image')) {
      const urlMatch = attrs.match(/url=["']([^"']+)["']/i);
      if (urlMatch) return urlMatch[1];
    }
  }
  
  return null;
}

function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  
  // Handle numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  decoded = decoded.replace(/&#x([a-fA-F0-9]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  
  return decoded;
}

function stripImages(html: string): string {
  return html.replace(/<img[^>]*>/gi, '');
}

function stripInlineStyles(html: string): string {
  return html.replace(/\s*style=["'][^"']*["']/gi, '');
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;
  
  // Try parsing RFC 822 format variations
  const rfc822Match = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/);
  if (rfc822Match) {
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const [, day, month, year, hour, min, sec] = rfc822Match;
    const monthNum = months[month];
    if (monthNum !== undefined) {
      return new Date(parseInt(year), monthNum, parseInt(day), parseInt(hour), parseInt(min), parseInt(sec));
    }
  }
  
  return new Date();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Decode JWT to get user ID (avoids session-dependent auth calls)
    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      userId = payload.sub;
      if (!userId) throw new Error('No sub claim');
      // Check token expiry
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
    } catch (e) {
      console.error('Token decode error:', e);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    
    // Use service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { feedId } = await req.json();
    
    if (!feedId) {
      return new Response(
        JSON.stringify({ error: 'feedId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the feed configuration
    const { data: feed, error: feedError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('id', feedId)
      .single();

    if (feedError || !feed) {
      return new Response(
        JSON.stringify({ error: 'Feed not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Syncing feed: ${feed.name} (${feed.feed_url})`);

    // Fetch the RSS feed
    const feedResponse = await fetch(feed.feed_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSSBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
      }
    });

    if (!feedResponse.ok) {
      // Update feed status to error
      await supabase
        .from('rss_feeds')
        .update({ 
          status: 'error', 
          last_error: `Failed to fetch feed: ${feedResponse.status} ${feedResponse.statusText}`,
          last_synced_at: new Date().toISOString()
        })
        .eq('id', feedId);

      return new Response(
        JSON.stringify({ error: `Failed to fetch feed: ${feedResponse.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const feedXml = await feedResponse.text();
    const items = parseRSSFeed(feedXml);

    console.log(`Parsed ${items.length} items from feed`);

    // Limit to max articles per sync
    const itemsToProcess = items.slice(0, feed.max_articles_per_sync);

    const results = {
      processed: 0,
      imported: 0,
      skipped: 0,
      errors: 0,
      details: [] as Array<{ guid: string; title: string; status: string; error?: string; articleId?: string }>
    };

    for (const item of itemsToProcess) {
      results.processed++;
      
      try {
        // Check for duplicates based on feed settings
        let isDuplicate = false;
        let duplicateReason = '';

        // Check by GUID in sync logs
        const { data: existingSync } = await supabase
          .from('feed_sync_logs')
          .select('id')
          .eq('feed_id', feedId)
          .eq('original_guid', item.guid)
          .single();

        if (existingSync) {
          isDuplicate = true;
          duplicateReason = 'Already synced (GUID match)';
        }

        // Check by title if enabled
        if (!isDuplicate && feed.check_duplicate_title) {
          const { data: existingByTitle } = await supabase
            .from('articles')
            .select('id')
            .eq('vertical_slug', feed.vertical_slug)
            .eq('title', item.title)
            .single();

          if (existingByTitle) {
            isDuplicate = true;
            duplicateReason = 'Duplicate title';
          }
        }

        // Check by link/URL if enabled
        if (!isDuplicate && feed.check_duplicate_link && item.link) {
          const { data: existingByLink } = await supabase
            .from('articles')
            .select('id')
            .eq('vertical_slug', feed.vertical_slug)
            .eq('external_url', item.link)
            .single();

          if (existingByLink) {
            isDuplicate = true;
            duplicateReason = 'Duplicate URL';
          }
        }

        if (isDuplicate) {
          results.skipped++;
          results.details.push({
            guid: item.guid,
            title: item.title,
            status: 'skipped',
            error: duplicateReason
          });

          // Log the skip
          await supabase.from('feed_sync_logs').insert({
            feed_id: feedId,
            original_guid: item.guid,
            original_title: item.title,
            original_url: item.link,
            status: 'skipped',
            error_message: duplicateReason
          });

          continue;
        }

        // Prepare content
        let content = feed.import_mode === 'full_content' 
          ? (item.content || item.description) 
          : item.description;

        if (content) {
          if (feed.strip_images) {
            content = stripImages(content);
          }
          if (feed.strip_inline_styles) {
            content = stripInlineStyles(content);
          }

          // Add source link if configured
          if (feed.source_link_text && feed.source_link_url && feed.import_mode === 'excerpt_with_link') {
            const sourceUrl = feed.source_link_url.replace('{url}', item.link || '');
            content += `<p><a href="${sourceUrl}" target="_blank" rel="noopener">${feed.source_link_text}</a></p>`;
          } else if (feed.import_mode === 'excerpt_with_link' && item.link) {
            content += `<p><a href="${item.link}" target="_blank" rel="noopener">Read more</a></p>`;
          }
        }

        // Create the article
        const articleData = {
          title: item.title,
          content: content,
          excerpt: (() => {
            let exc = item.description?.substring(0, 500) || null;
            if (exc) {
              if (feed.strip_images) exc = stripImages(exc);
              if (feed.strip_inline_styles) exc = stripInlineStyles(exc);
            }
            return exc;
          })(),
          author: item.author || feed.default_author || null,
          image_url: feed.strip_images ? (feed.default_image_url || null) : (item.imageUrl || feed.default_image_url || null),
          external_url: item.link || null,
          vertical_slug: feed.vertical_slug,
          published_at: parseDate(item.pubDate).toISOString(),
          metadata: {
            source_feed_id: feedId,
            source_feed_name: feed.name,
            original_guid: item.guid,
            import_mode: feed.import_mode,
            publish_status: feed.publish_status
          }
        };

        const { data: article, error: articleError } = await supabase
          .from('articles')
          .insert(articleData)
          .select('id')
          .single();

        if (articleError) {
          throw articleError;
        }

        results.imported++;
        results.details.push({
          guid: item.guid,
          title: item.title,
          status: 'imported',
          articleId: article.id
        });

        // Log the successful sync
        await supabase.from('feed_sync_logs').insert({
          feed_id: feedId,
          original_guid: item.guid,
          original_title: item.title,
          original_url: item.link,
          article_id: article.id,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error processing item ${item.guid}:`, error);
        results.errors++;
        results.details.push({
          guid: item.guid,
          title: item.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        // Log the error
        await supabase.from('feed_sync_logs').insert({
          feed_id: feedId,
          original_guid: item.guid,
          original_title: item.title,
          original_url: item.link,
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Update feed status
    await supabase
      .from('rss_feeds')
      .update({ 
        status: results.errors > 0 && results.imported === 0 ? 'error' : 'active',
        last_error: results.errors > 0 ? `${results.errors} errors during sync` : null,
        last_synced_at: new Date().toISOString()
      })
      .eq('id', feedId);

    console.log(`Sync complete: ${results.imported} imported, ${results.skipped} skipped, ${results.errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        feedId,
        feedName: feed.name,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-rss-feed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
