import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  categories: string[];
  contentSnippet?: string;
}

interface RSSFeedProps {
  feedUrl: string;
  title?: string;
  maxItems?: number;
}

const RSSFeed = ({ feedUrl, title = "External Feed", maxItems = 6 }: RSSFeedProps) => {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        setLoading(true);
        
        // Try multiple CORS proxy services as fallback
        const proxyUrls = [
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`,
          `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`,
          `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`
        ];
        
        let xmlContent = null;
        let lastError = null;
        
        for (const proxyUrl of proxyUrls) {
          try {
            console.log('Trying proxy:', proxyUrl);
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('Response preview:', text.substring(0, 200));
            
            // Check if response contains JSON wrapper or direct XML
            if (text.includes('<?xml')) {
              xmlContent = text;
              break;
            } else {
              // Try to parse as JSON (allorigins format)
              try {
                const data = JSON.parse(text);
                if (data.contents && data.contents.includes('<?xml')) {
                  xmlContent = data.contents;
                  break;
                }
              } catch (jsonError) {
                console.log('Not JSON format, trying next proxy');
              }
            }
          } catch (err) {
            console.log('Proxy failed:', err);
            lastError = err;
            continue;
          }
        }
        
        if (!xmlContent) {
          throw lastError || new Error('All proxy services failed');
        }
        
        // Parse the XML content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('Invalid XML content');
        }
        
        const rssItems = Array.from(xmlDoc.querySelectorAll('item')).slice(0, maxItems).map(item => {
          const categories = Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || '');
          
          return {
            title: item.querySelector('title')?.textContent || '',
            link: item.querySelector('link')?.textContent || '',
            pubDate: item.querySelector('pubDate')?.textContent || '',
            creator: item.querySelector('dc\\:creator')?.textContent || 'Unknown',
            categories: categories.filter(Boolean),
            contentSnippet: item.querySelector('description')?.textContent?.substring(0, 200) + '...' || ''
          };
        });
        
        console.log('Parsed RSS items:', rssItems.length);
        setItems(rssItems);
        setError(null);
      } catch (err) {
        console.error('RSS fetch error:', err);
        setError('Failed to fetch RSS feed. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, [feedUrl, maxItems]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground">Unable to load RSS feed content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <Badge variant="outline" className="text-xs">
          AI Intelligence
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-lg line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                
                {item.contentSnippet && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.contentSnippet}
                  </p>
                )}
              </div>

              {item.categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.categories.slice(0, 3).map((category, catIndex) => (
                    <Badge key={catIndex} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{item.creator}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.pubDate)}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full"
              >
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Read Article
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RSSFeed;