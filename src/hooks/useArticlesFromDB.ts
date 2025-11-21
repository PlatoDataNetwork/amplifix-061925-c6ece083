import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TransformedBlogPost {
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

export function useArticlesFromDB(verticalSlug: string | null) {
  const [posts, setPosts] = useState<TransformedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!verticalSlug) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('vertical_slug', verticalSlug)
          .order('published_at', { ascending: false })
          .limit(2000);

        if (fetchError) {
          throw fetchError;
        }

        const transformedPosts: TransformedBlogPost[] = (data || []).map((article: any) => {
          const pubDate = new Date(article.published_at);
          const formattedDate = pubDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          return {
            id: article.post_id || article.id,
            title: article.title,
            excerpt: article.excerpt || '',
            author: article.author || 'PlatoData',
            date: formattedDate,
            read_time: article.read_time || '5 min read',
            category: article.category || verticalSlug,
            image: article.image_url || '',
            tags: [],
            external_url: article.external_url,
            content: article.content
          };
        });

        setPosts(transformedPosts);
      } catch (err) {
        console.error(`Error fetching ${verticalSlug} articles from DB:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [verticalSlug]);

  return { posts, isLoading, error };
}