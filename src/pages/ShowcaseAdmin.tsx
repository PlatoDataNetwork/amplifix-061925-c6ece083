import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Upload, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";
import { Helmet } from "react-helmet-async";
import { ShowcaseLogoFixer } from "@/components/ShowcaseLogoFixer";
import { LogoGallery } from "@/components/LogoGallery";

interface ShowcaseCompany {
  id: string;
  company_name: string;
  ticker: string | null;
  subtitle: string | null;
  description: string;
  tags: string[];
  button_text: string;
  link: string;
  website: string | null;
  stock_url: string | null;
  search_url: string | null;
  thumbnail: string | null;
  type: string;
  disabled: boolean;
  display_order: number;
}

const ShowcaseAdmin = () => {
  const [companies, setCompanies] = useState<ShowcaseCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<ShowcaseCompany>>({
    company_name: "",
    ticker: "",
    subtitle: "",
    description: "",
    tags: [],
    button_text: "View Showcase",
    link: "",
    website: "",
    stock_url: "",
    search_url: "",
    thumbnail: "",
    type: "stock",
    disabled: false,
    display_order: 0,
  });

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("showcase_companies")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching companies",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const importFromJSON = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/showcase.json');
      const data = await response.json();
      
      const showcases = data.showcase.showcases;
      
      // Get existing companies to determine next display_order
      const { data: existing } = await supabase
        .from("showcase_companies")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);
      
      let nextOrder = (existing && existing.length > 0) ? existing[0].display_order + 1 : 1;
      
      // Import only companies that don't exist yet
      for (const showcase of showcases) {
        const { data: existingCompany } = await supabase
          .from("showcase_companies")
          .select("id")
          .eq("company_name", showcase.company_name)
          .single();
        
        if (!existingCompany) {
          const { error } = await supabase
            .from("showcase_companies")
            .insert({
              company_name: showcase.company_name,
              ticker: showcase.ticker || null,
              description: showcase.description,
              tags: showcase.tags || [],
              button_text: showcase.button_text || "View Showcase",
              link: showcase.link,
              website: showcase.website || null,
              stock_url: showcase.stock_url || null,
              search_url: showcase.search_url || null,
              thumbnail: showcase.thumbnail || null,
              type: showcase.type || "stock",
              disabled: showcase.disabled || false,
              display_order: nextOrder++
            });
          
          if (error) {
            console.error(`Error importing ${showcase.company_name}:`, error);
          }
        }
      }
      
      toast({
        title: "Import completed",
        description: "Companies have been imported from JSON",
      });
      
      await fetchCompanies();
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const autoImportMissing = async () => {
      try {
        const response = await fetch('/data/showcase.json');
        const data = await response.json();
        const showcases = data.showcase.showcases;
        
        // Check which companies are missing
        const missingCompanies = [];
        for (const showcase of showcases) {
          const { data: existing } = await supabase
            .from("showcase_companies")
            .select("id")
            .eq("company_name", showcase.company_name)
            .single();
          
          if (!existing) {
            missingCompanies.push(showcase);
          }
        }
        
        // Auto-import missing companies
        if (missingCompanies.length > 0) {
          const { data: lastCompany } = await supabase
            .from("showcase_companies")
            .select("display_order")
            .order("display_order", { ascending: false })
            .limit(1);
          
          let nextOrder = (lastCompany && lastCompany.length > 0) ? lastCompany[0].display_order + 1 : 1;
          
          for (const showcase of missingCompanies) {
            await supabase
              .from("showcase_companies")
              .insert({
                company_name: showcase.company_name,
                ticker: showcase.ticker || null,
                description: showcase.description,
                tags: showcase.tags || [],
                button_text: showcase.button_text || "View Showcase",
                link: showcase.link,
                website: showcase.website || null,
                stock_url: showcase.stock_url || null,
                search_url: showcase.search_url || null,
                thumbnail: showcase.thumbnail || null,
                type: showcase.type || "stock",
                disabled: showcase.disabled || false,
                display_order: nextOrder++
              });
          }
          
          toast({
            title: "Auto-imported companies",
            description: `Added ${missingCompanies.length} new companies from JSON`,
          });
          
          // Refresh the list
          fetchCompanies();
        }
      } catch (error: any) {
        console.error("Auto-import error:", error);
      }
    };
    
    if (companies.length > 0) {
      autoImportMissing();
    }
  }, [companies.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("showcase_companies")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Company updated successfully" });
      } else {
        const insertData = {
          company_name: formData.company_name || "",
          description: formData.description || "",
          link: formData.link || "",
          ticker: formData.ticker || null,
          subtitle: formData.subtitle || null,
          tags: formData.tags || [],
          button_text: formData.button_text || "View Showcase",
          website: formData.website || null,
          stock_url: formData.stock_url || null,
          search_url: formData.search_url || null,
          thumbnail: formData.thumbnail || null,
          type: formData.type || "stock",
          disabled: formData.disabled || false,
          display_order: formData.display_order || 0,
        };

        const { error } = await supabase
          .from("showcase_companies")
          .insert([insertData]);

        if (error) throw error;
        toast({ title: "Company created successfully" });
      }

      resetForm();
      fetchCompanies();
    } catch (error: any) {
      toast({
        title: "Error saving company",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const { error } = await supabase
        .from("showcase_companies")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Company deleted successfully" });
      fetchCompanies();
    } catch (error: any) {
      toast({
        title: "Error deleting company",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (company: ShowcaseCompany) => {
    setFormData(company);
    setEditingId(company.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      ticker: "",
      subtitle: "",
      description: "",
      tags: [],
      button_text: "View Showcase",
      link: "",
      website: "",
      stock_url: "",
      search_url: "",
      thumbnail: "",
      type: "stock",
      disabled: false,
      display_order: companies.length,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("showcase-thumbnails")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("showcase-thumbnails")
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail: publicUrl });
      toast({ title: "Thumbnail uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto py-20 px-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Showcase Admin - AmplifiX</title>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <MainHeader />

        <div className="container mx-auto py-20 px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold">Showcase Management</h1>
            </div>
            {!showForm && (
              <div className="flex gap-2">
                <Button onClick={importFromJSON} variant="outline" disabled={loading}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import from JSON
                </Button>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
            )}
          </div>

          <ShowcaseLogoFixer />

          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Company" : "Add New Company"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="ticker">Ticker</Label>
                      <Input
                        id="ticker"
                        value={formData.ticker || ""}
                        onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={formData.subtitle || ""}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stock">Stock</SelectItem>
                          <SelectItem value="token">Token</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags?.join(", ") || ""}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="button_text">Button Text *</Label>
                      <Input
                        id="button_text"
                        value={formData.button_text}
                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="link">Link *</Label>
                      <Input
                        id="link"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        value={formData.website || ""}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock_url">Stock/Token URL</Label>
                      <Input
                        id="stock_url"
                        value={formData.stock_url || ""}
                        onChange={(e) => setFormData({ ...formData, stock_url: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="search_url">Search URL</Label>
                      <Input
                        id="search_url"
                        value={formData.search_url || ""}
                        onChange={(e) => setFormData({ ...formData, search_url: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="disabled"
                        checked={formData.disabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, disabled: checked })}
                      />
                      <Label htmlFor="disabled">Disabled</Label>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="thumbnail">Thumbnail</Label>
                      <div className="flex items-center gap-4 mb-4">
                        <Input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        {formData.thumbnail && (
                          <img
                            src={formData.thumbnail}
                            alt="Preview"
                            className="h-12 w-12 object-contain rounded border p-1"
                          />
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        Or select from existing logos:
                      </div>
                      <LogoGallery 
                        onSelect={(logoPath) => setFormData({ ...formData, thumbnail: logoPath })}
                        selectedLogo={formData.thumbnail || undefined}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={uploading}>
                      {editingId ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Card key={company.id} className={company.disabled ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {company.thumbnail && (
                        <img
                          src={company.thumbnail}
                          alt={company.company_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{company.company_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{company.ticker}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {company.description}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(company)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(company.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowcaseAdmin;
