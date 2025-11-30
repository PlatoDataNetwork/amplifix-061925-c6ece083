import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ArticleSearchProps {
  verticalSlug: string | null;
  onSearch: (results: SearchResult[], query: string) => void;
  onClear: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  rank: number;
}

const ArticleSearch = ({ verticalSlug, onSearch, onClear }: ArticleSearchProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      onClear();
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.rpc("search_articles", {
        search_query: searchQuery,
        vertical_filter: verticalSlug,
        limit_count: 50,
        offset_count: 0,
      });

      if (error) throw error;

      onSearch(data || [], searchQuery);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pl-12 pr-24 h-12 text-base rounded-full border-2 focus:border-blue-500 transition-colors"
          disabled={isSearching}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={() => handleSearch(query)}
            disabled={isSearching || !query.trim()}
            className="rounded-full h-9 px-6"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleSearch;
