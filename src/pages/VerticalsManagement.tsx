import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search, FolderTree, Loader2, ExternalLink, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VerticalCount {
  vertical_slug: string;
  article_count: number;
}

const VerticalsManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch vertical counts using the existing RPC function
  const { data: verticals, isLoading } = useQuery({
    queryKey: ["vertical-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_vertical_article_counts");
      
      if (error) throw error;
      return data as VerticalCount[];
    },
  });

  // Calculate total articles
  const totalArticles = verticals?.reduce((sum, v) => sum + v.article_count, 0) || 0;

  // Filter verticals by search
  const filteredVerticals = verticals?.filter((v) =>
    v.vertical_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format vertical slug for display
  const formatVerticalName = (slug: string) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/management")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Verticals Management</h1>
              <p className="text-muted-foreground">View article distribution across verticals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Verticals</CardDescription>
              <CardTitle className="text-3xl">{verticals?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Articles</CardDescription>
              <CardTitle className="text-3xl">{totalArticles.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Articles/Vertical</CardDescription>
              <CardTitle className="text-3xl">
                {verticals?.length ? Math.round(totalArticles / verticals.length).toLocaleString() : 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              <CardTitle>All Verticals</CardTitle>
            </div>
            <CardDescription>
              Verticals are automatically derived from article content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verticals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredVerticals?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No verticals match your search" : "No verticals found"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Articles</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerticals?.map((vertical) => (
                    <TableRow key={vertical.vertical_slug}>
                      <TableCell className="font-medium">
                        {formatVerticalName(vertical.vertical_slug)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {vertical.vertical_slug}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {vertical.article_count.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/intel/${vertical.vertical_slug}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/articles?vertical=${vertical.vertical_slug}`)}
                          >
                            Manage Articles
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerticalsManagement;
