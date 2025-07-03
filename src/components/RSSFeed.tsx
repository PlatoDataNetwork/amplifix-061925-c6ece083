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
        // Use a CORS proxy service to fetch the RSS feed
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // Parse the XML content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
        
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
        
        setItems(rssItems);
        setError(null);
      } catch (err) {
        setError('Failed to fetch RSS feed');
        console.error('RSS fetch error:', err);
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