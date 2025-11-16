import { useState, useEffect } from 'react';

interface ExternalArticle {
  title: string;
  url: string;
  image?: string;
  published_date?: string;
  author?: string;
  source?: string;
  summary?: string;
  content?: string;
  post_id?: number;
  slug?: string;
}

export interface TransformedBlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  image: string;
  tags: string[];
  external_url?: string;
  content?: string;
}

export function useExternalJsonFeed(url: string) {
  const [posts, setPosts] = useState<TransformedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform external articles to BlogPost format
        const transformedPosts: TransformedBlogPost[] = (data.articles || data || []).map((article: ExternalArticle, index: number) => ({
          id: article.post_id || (1000 + index), // Use post_id if available, otherwise use offset
          title: article.title || 'Untitled',
          excerpt: article.summary || 'Read more about this AI article...',
          author: article.author || article.source || 'AI Intelligence',
          date: article.published_date || new Date().toISOString().split('T')[0],
          read_time: '5 min read',
          category: 'AI',
          image: article.image || '/lovable-uploads/naoris-hero-new.png',
          tags: ['AI', 'Intelligence'],
          external_url: article.url,
          content: article.content || article.summary || ''
        }));
        
        setPosts(transformedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load external feed');
        console.error('Error loading external feed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [url]);

  return { posts, isLoading, error };
}
