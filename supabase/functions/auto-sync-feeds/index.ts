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
  sync_interval_hours: number;
  last_synced_at: string | null;
}

// Parse RSS/Atom XML to extract items
function parseRSSFeed(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  const isAtom = xmlText.includes('<feed') && xmlText.includes('xmlns="http://www.w3.org/2005/Atom"');
  
  if (isAtom) {
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
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) {
    return decodeHTMLEntities(cdataMatch[1].trim());
  }
  
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  if (match) {
    return decodeHTMLEntities(match[1].trim());
  }
  
  return null;
}

function extractAtomLink(entry: string): string | null {
  const linkMatch = entry.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  return linkMatch ? linkMatch[1] : null;
}

function extractMediaImage(item: string): string | null {
  const mediaMatch = item.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (mediaMatch) return mediaMatch[1];
  
  const thumbMatch = item.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (thumbMatch) return thumbMatch[1];
  
  const imgMatch = item.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch) return imgMatch[1];
  
  return null;
}

function extractEnclosure(item: string): string | null {
  const enclosureMatch = item.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image[^"']*["'][^>]*>/i);
  if (enclosureMatch) return enclosureMatch[1];
  
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

async function syncFeed(supabase: ReturnType<typeof createClient>, feed: RSSFeed) {
  console.log(`Syncing feed: ${feed.name} (${feed.feed_url})`);

  try {
    const feedResponse = await fetch(feed.feed_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSSBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
      }
    });

    if (!feedResponse.ok) {
      await supabase
        .from('rss_feeds')
        .update({ 
          status: 'error', 
          last_error: `Failed to fetch feed: ${feedResponse.status} ${feedResponse.statusText}`,
          last_synced_at: new Date().toISOString()
        })
        .eq('id', feed.id);

      return { feedId: feed.id, feedName: feed.name, error: `HTTP ${feedResponse.status}`, imported: 0, skipped: 0, errors: 1 };
    }

    const feedXml = await feedResponse.text();
    const items = parseRSSFeed(feedXml);

    const itemsToProcess = items.slice(0, feed.max_articles_per_sync || 50);

    // Fetch default featured images pool for random assignment
    const { data: defaultImages } = await supabase
      .from('default_featured_images')
      .select('image_url');
    const defaultImagePool = defaultImages?.map(img => img.image_url) || [];

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of itemsToProcess) {
      try {
        let isDuplicate = false;

        const { data: existingSync } = await supabase
          .from('feed_sync_logs')
          .select('id')
          .eq('feed_id', feed.id)
          .eq('original_guid', item.guid)
          .maybeSingle();

        if (existingSync) {
          isDuplicate = true;
        }

        if (!isDuplicate && feed.check_duplicate_title) {
          const { data: existingByTitle } = await supabase
            .from('articles')
            .select('id')
            .eq('vertical_slug', feed.vertical_slug)
            .eq('title', item.title)
            .maybeSingle();

          if (existingByTitle) {
            isDuplicate = true;
          }
        }

        if (!isDuplicate && feed.check_duplicate_link && item.link) {
          const { data: existingByLink } = await supabase
            .from('articles')
            .select('id')
            .eq('vertical_slug', feed.vertical_slug)
            .eq('external_url', item.link)
            .maybeSingle();

          if (existingByLink) {
            isDuplicate = true;
          }
        }

        if (isDuplicate) {
          skipped++;
          continue;
        }

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

          if (feed.source_link_text && feed.source_link_url) {
            const sourceUrl = feed.source_link_url.replace('{url}', item.link || '');
            content += `<p>Source: <a href="${sourceUrl}" target="_blank" rel="noopener">${feed.source_link_text}</a></p>`;
          } else if (item.link) {
            content += `<p>Source: <a href="${item.link}" target="_blank" rel="noopener">${item.link}</a></p>`;
          }
        }

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
          image_url: (() => {
            if (feed.strip_images || !item.imageUrl) {
              if (defaultImagePool.length > 0) {
                return defaultImagePool[Math.floor(Math.random() * defaultImagePool.length)];
              }
              return feed.default_image_url || null;
            }
            return item.imageUrl || (defaultImagePool.length > 0 ? defaultImagePool[Math.floor(Math.random() * defaultImagePool.length)] : feed.default_image_url || null);
          })(),
          external_url: item.link || null,
          vertical_slug: feed.vertical_slug,
          published_at: parseDate(item.pubDate).toISOString(),
          metadata: {
            source_feed_id: feed.id,
            source_feed_name: feed.name,
            original_guid: item.guid,
            import_mode: feed.import_mode,
            publish_status: feed.publish_status,
            auto_synced: true
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

        await supabase.from('feed_sync_logs').insert({
          feed_id: feed.id,
          original_guid: item.guid,
          original_title: item.title,
          original_url: item.link,
          article_id: article.id,
          status: 'success'
        });

        imported++;

      } catch (error) {
        console.error(`Error processing item ${item.guid}:`, error);
        errors++;

        await supabase.from('feed_sync_logs').insert({
          feed_id: feed.id,
          original_guid: item.guid,
          original_title: item.title,
          original_url: item.link,
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    await supabase
      .from('rss_feeds')
      .update({ 
        status: errors > 0 && imported === 0 ? 'error' : 'active',
        last_error: errors > 0 ? `${errors} errors during auto-sync` : null,
        last_synced_at: new Date().toISOString()
      })
      .eq('id', feed.id);

    console.log(`Feed ${feed.name}: ${imported} imported, ${skipped} skipped, ${errors} errors`);

    return { feedId: feed.id, feedName: feed.name, imported, skipped, errors };

  } catch (error) {
    console.error(`Failed to sync feed ${feed.name}:`, error);
    
    await supabase
      .from('rss_feeds')
      .update({ 
        status: 'error',
        last_error: error instanceof Error ? error.message : 'Unknown error',
        last_synced_at: new Date().toISOString()
      })
      .eq('id', feed.id);

    return { feedId: feed.id, feedName: feed.name, error: error instanceof Error ? error.message : 'Unknown error', imported: 0, skipped: 0, errors: 1 };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Auto-sync feeds cron job triggered');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active feeds with auto_sync enabled that are due for sync
    const now = new Date();
    
    const { data: feeds, error: feedsError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('status', 'active')
      .eq('auto_sync', true);

    if (feedsError) {
      throw feedsError;
    }

    if (!feeds || feeds.length === 0) {
      console.log('✓ No feeds configured for auto-sync');
      return new Response(
        JSON.stringify({ success: true, message: 'No feeds to sync', results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter feeds that are due for sync based on their interval
    const feedsDueForSync = feeds.filter(feed => {
      if (!feed.last_synced_at) return true; // Never synced, sync now
      
      const lastSynced = new Date(feed.last_synced_at);
      const intervalMs = (feed.sync_interval_hours || 24) * 60 * 60 * 1000;
      const nextSyncTime = new Date(lastSynced.getTime() + intervalMs);
      
      return now >= nextSyncTime;
    });

    if (feedsDueForSync.length === 0) {
      console.log('✓ No feeds due for sync at this time');
      return new Response(
        JSON.stringify({ success: true, message: 'No feeds due for sync', feedsChecked: feeds.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📡 Syncing ${feedsDueForSync.length} feed(s)...`);

    const results = [];
    for (const feed of feedsDueForSync) {
      const result = await syncFeed(supabase, feed as RSSFeed);
      results.push(result);
    }

    const totalImported = results.reduce((sum, r) => sum + (r.imported || 0), 0);
    const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);
    const totalErrors = results.reduce((sum, r) => sum + (r.errors || 0), 0);

    console.log(`✓ Auto-sync complete: ${totalImported} imported, ${totalSkipped} skipped, ${totalErrors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        feedsSynced: feedsDueForSync.length,
        totalImported,
        totalSkipped,
        totalErrors,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-sync-feeds:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
