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
      console.log('usePlatoDataFeed: No vertical slug or "all", skipping fetch');
      setPosts([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `https://dashboard.platodata.io/json/${verticalSlug}.json`;
        console.log('usePlatoDataFeed: Fetching from', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${verticalSlug} feed`);
        }

        const responseData = await response.json();
        console.log('usePlatoDataFeed: Response data type:', Array.isArray(responseData) ? 'array' : 'object');
        console.log('usePlatoDataFeed: Response keys:', Object.keys(responseData));
        
        // Handle both array and object responses - API now returns { articles: [...] }
        const allData: ExternalArticle[] = Array.isArray(responseData) 
          ? responseData 
          : responseData.articles || [];
        
        // Limit to first 50 articles for performance
        const data = allData.slice(0, 50);
        
        console.log('usePlatoDataFeed: Found', allData.length, 'articles, processing first', data.length);
        
        const transformedPosts: TransformedBlogPost[] = data.map((article: any, index) => {
          // Handle both old RSS format and new API format
          const dateString = article.date || article.pubDate;
          const pubDate = new Date(dateString);
          const formattedDate = pubDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          // Calculate estimated read time based on content length
          const wordCount = article.content?.split(/\s+/).length || 0;
          const readTime = Math.max(1, Math.ceil(wordCount / 200));

          // For AI feed, tag with both AI and Plato
          const isAIFeed = verticalSlug === 'artificial-intelligence';
          const baseTags = article.categories || [];
          const tags = isAIFeed ? [...baseTags, 'AI', 'Plato'] : baseTags.length > 0 ? baseTags : [categoryName || verticalSlug];

          // Extract link from various possible locations
          const articleLink = article.link || article.metadata?.sourceLink?.[0] || '';
          
          // Extract image from metadata if available
          const articleImage = article.image || article.metadata?.featuredImage?.[0] || '';

          // Ensure image is a string, not an object
          const imageUrl = typeof articleImage === 'string' ? articleImage : '';

          // Remove source links from content
          const cleanedContent = article.content
            ?.replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/g, '')
            ?.trim() || '';

          // Create excerpt from cleaned content
          const plainContent = cleanedContent.replace(/<[^>]*>/g, '') || '';
          const excerpt = article.contentSnippet || plainContent.substring(0, 200) || '';

          return {
            id: article.post_id || (1000 + index + (verticalSlug.length * 100)),
            title: article.title,
            excerpt: excerpt,
            author: article.author || 'PlatoData',
            date: formattedDate,
            read_time: `${readTime} min read`,
            category: categoryName || verticalSlug,
            image: '',  // No images for AI articles
            tags: tags,
            external_url: articleLink,
            content: cleanedContent
          };
        });

        console.log('usePlatoDataFeed: Transformed', transformedPosts.length, 'posts');
        setPosts(transformedPosts);
      } catch (err) {
        console.error(`Error fetching ${verticalSlug} feed:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch feed');
        setPosts([]);
      } finally {
        console.log('usePlatoDataFeed: Fetch complete, isLoading = false');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [verticalSlug, categoryName]);

  return { posts, isLoading, error };
}
