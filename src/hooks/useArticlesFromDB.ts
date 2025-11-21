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

export function useArticlesFromDB(verticalSlug: string | null, limit: number = 24) {
  const [posts, setPosts] = useState<TransformedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(limit);

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
        // Fetch limited articles for better performance
        const { data, error: fetchError, count } = await supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .eq('vertical_slug', verticalSlug)
          .order('published_at', { ascending: false })
          .limit(currentLimit);

        if (fetchError) {
          throw fetchError;
        }

        // Check if there are more articles beyond the current limit
        setHasMore((count || 0) > currentLimit);

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

    // Set up real-time subscription for new articles
    const channel = supabase
      .channel(`articles-${verticalSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles',
          filter: `vertical_slug=eq.${verticalSlug}`
        },
        (payload) => {
          console.log('New article inserted:', payload.new);
          
          // Transform the new article
          const article = payload.new as any;
          const pubDate = new Date(article.published_at);
          const formattedDate = pubDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const newPost: TransformedBlogPost = {
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

          // Add new article to the beginning of the list
          setPosts(prev => [newPost, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [verticalSlug, currentLimit]);

  const loadMore = () => {
    setCurrentLimit(prev => prev + limit);
  };

  return { posts, isLoading, error, hasMore, loadMore };
}