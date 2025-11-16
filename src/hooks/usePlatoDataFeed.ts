import { useState, useEffect } from 'react';

interface ExternalArticle {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  contentSnippet: string;
  content: string;
  categories: string[];
  image?: string;
}

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

export function usePlatoDataFeed(verticalSlug: string | null, categoryName: string = '') {
  const [posts, setPosts] = useState<TransformedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we have a valid vertical slug
    if (!verticalSlug || verticalSlug === 'all') {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `https://dashboard.platodata.io/json/${verticalSlug}.json`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${verticalSlug} feed`);
        }

        const data: ExternalArticle[] = await response.json();
        
        const transformedPosts: TransformedBlogPost[] = data.map((article, index) => {
          const pubDate = new Date(article.pubDate);
          const formattedDate = pubDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          // Calculate estimated read time based on content length
          const wordCount = article.content?.split(/\s+/).length || 0;
          const readTime = Math.max(1, Math.ceil(wordCount / 200));

          return {
            id: 1000 + index + (verticalSlug.length * 100), // Unique IDs based on vertical
            title: article.title,
            excerpt: article.contentSnippet || article.content?.substring(0, 200) || '',
            author: article.author || 'PlatoData',
            date: formattedDate,
            read_time: `${readTime} min read`,
            category: categoryName || verticalSlug,
            image: article.image || '/lovable-uploads/naoris-hero-new.png',
            tags: article.categories || [categoryName || verticalSlug],
            external_url: article.link,
            content: article.content
          };
        });

        setPosts(transformedPosts);
      } catch (err) {
        console.error(`Error fetching ${verticalSlug} feed:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch feed');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [verticalSlug, categoryName]);

  return { posts, isLoading, error };
}
