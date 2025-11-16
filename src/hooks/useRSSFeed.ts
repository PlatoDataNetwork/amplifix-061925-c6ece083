import { useState, useEffect } from 'react';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  creator?: string;
  categories: string[];
  contentSnippet?: string;
  content?: string;
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

export function useRSSFeed(feedUrl: string, category: string = 'ACN') {
  const [posts, setPosts] = useState<TransformedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      setIsLoading(true);
      setError(null);

      const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`
      ];

      for (const proxyUrl of proxyUrls) {
        try {
          const response = await fetch(proxyUrl);
          if (!response.ok) continue;

          const xmlText = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

          const items = xmlDoc.querySelectorAll('item');
          const rssItems: RSSItem[] = [];

          items.forEach((item) => {
            const title = item.querySelector('title')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            const creator = item.querySelector('creator')?.textContent || 
                           item.querySelector('author')?.textContent || 
                           'ACN Newswire';
            const description = item.querySelector('description')?.textContent || '';
            const content = item.querySelector('encoded')?.textContent || description;
            
            const categoryElements = item.querySelectorAll('category');
            const categories: string[] = [];
            categoryElements.forEach((cat) => {
              const catText = cat.textContent;
              if (catText) categories.push(catText);
            });

            rssItems.push({
              title,
              link,
              pubDate,
              creator,
              categories,
              contentSnippet: description.substring(0, 200),
              content
            });
          });

          // Transform RSS items to blog post format
          const transformedPosts: TransformedBlogPost[] = rssItems.map((item, index) => {
            const pubDate = new Date(item.pubDate);
            const formattedDate = pubDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return {
              id: 2000 + index, // Start from 2000 to avoid conflicts
              title: item.title,
              excerpt: item.contentSnippet || item.content?.substring(0, 200) || '',
              author: item.creator || 'ACN Newswire',
              date: formattedDate,
              read_time: '5 min read',
              category: category,
              image: '', // No images for RSS feeds
              tags: item.categories.length > 0 ? item.categories : [category],
              external_url: item.link,
              content: item.content || item.contentSnippet || ''
            };
          });

          setPosts(transformedPosts);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error(`Failed to fetch from ${proxyUrl}:`, err);
          continue;
        }
      }

      setError('Failed to load RSS feed');
      setIsLoading(false);
    };

    if (feedUrl) {
      fetchRSSFeed();
    }
  }, [feedUrl, category]);

  return { posts, isLoading, error };
}
