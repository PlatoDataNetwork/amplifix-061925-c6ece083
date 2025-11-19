import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Article {
  id: string;
  post_id: number;
  title: string;
  content: string | null;
  excerpt: string | null;
  author: string | null;
  image_url: string | null;
  vertical_slug: string;
  published_at: string;
}

interface ArticleListItem {
  id: string;
  post_id: number;
  title: string;
}

const ArticleEditor = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [verticalSlug, setVerticalSlug] = useState("");

  // Load all articles for selection
  useEffect(() => {
    loadArticles();
  }, []);

  // Load specific article when id changes
  useEffect(() => {
    if (id) {
      setSelectedArticleId(id);
      loadArticle(id);
    }
  }, [id]);

  // Load article when selection changes
  useEffect(() => {
    if (selectedArticleId && selectedArticleId !== id) {
      navigate(`/admin/articles/edit/${selectedArticleId}`);
    }
  }, [selectedArticleId]);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, post_id, title")
        .order("published_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      if (data) setArticles(data);
    } catch (error) {
      console.error("Error loading articles:", error);
      toast.error("Failed to load articles");
    }
  };

  const loadArticle = async (articleId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) throw error;
      
      if (data) {
        setTitle(data.title);
        setContent(data.content || "");
        setExcerpt(data.excerpt || "");
        setAuthor(data.author || "");
        setImageUrl(data.image_url || "");
        setVerticalSlug(data.vertical_slug || "");
      }
    } catch (error) {
      console.error("Error loading article:", error);
      toast.error("Failed to load article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedArticleId) {
      toast.error("Please select an article to edit");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("articles")
        .update({
          title,
          content,
          excerpt,
          author,
          image_url: imageUrl,
          vertical_slug: verticalSlug,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedArticleId);

      if (error) throw error;
      
      toast.success("Article updated successfully!");
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
              <h1 className="text-3xl font-bold">Article Editor</h1>
            </div>
            
            <Button
              onClick={handleSave}
              disabled={isSaving || !selectedArticleId}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Article Selection */}
          <div className="mb-6">
            <Label htmlFor="article-select">Select Article</Label>
            <Select value={selectedArticleId} onValueChange={setSelectedArticleId}>
              <SelectTrigger id="article-select" className="w-full">
                <SelectValue placeholder="Choose an article to edit..." />
              </SelectTrigger>
              <SelectContent>
                {articles.map((article) => (
                  <SelectItem key={article.id} value={article.id}>
                    {article.title} (ID: {article.post_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Editor Form */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedArticleId ? (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Author */}
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-2"
                  placeholder="https://..."
                />
              </div>

              {/* Vertical Slug */}
              <div>
                <Label htmlFor="verticalSlug">Vertical Slug</Label>
                <Input
                  id="verticalSlug"
                  value={verticalSlug}
                  onChange={(e) => setVerticalSlug(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Content Editor */}
              <div>
                <Label>Content</Label>
                <div className="mt-2 bg-card border border-border rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="min-h-[400px]"
                  />
                </div>
              </div>

              {/* Save Button (bottom) */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="lg"
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Select an article from the dropdown above to start editing</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleEditor;
