import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ArrowLeft, Image, Upload, Trash2, Loader2, AlertCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DefaultImagesManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Check if storage bucket exists by attempting a list operation
  const { data: bucketExists } = useQuery({
    queryKey: ["check-article-images-bucket"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("article-images").list("default-images", { limit: 1 });
      // If we get an error about the bucket not existing, return false
      if (error?.message?.includes("Bucket not found")) {
        return false;
      }
      return true;
    },
  });

  // Fetch default images from storage
  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ["default-images"],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("article-images")
        .list("default-images", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });
      
      if (error) {
        console.error("Error fetching images:", error);
        return [];
      }
      
      // Get public URLs for each image
      return data
        .filter((file) => file.name !== ".emptyFolderPlaceholder")
        .map((file) => ({
          name: file.name,
          url: supabase.storage
            .from("article-images")
            .getPublicUrl(`default-images/${file.name}`).data.publicUrl,
          created_at: file.created_at,
        }));
    },
    enabled: bucketExists === true,
  });

  // Add image by URL
  const handleAddImageUrl = async () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    setIsUploading(true);
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");
      
      const blob = await response.blob();
      const fileName = `img-${Date.now()}.${blob.type.split("/")[1] || "jpg"}`;
      
      const { error } = await supabase.storage
        .from("article-images")
        .upload(`default-images/${fileName}`, blob, {
          contentType: blob.type,
        });
      
      if (error) throw error;
      
      toast.success("Image added successfully");
      setImageUrl("");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to add image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileName = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split(".").pop()}`;
        
        const { error } = await supabase.storage
          .from("article-images")
          .upload(`default-images/${fileName}`, file, {
            contentType: file.type,
          });
        
        if (error) throw error;
      }
      
      toast.success(`${files.length} image(s) uploaded successfully`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from("article-images")
        .remove([`default-images/${fileName}`]);
      
      if (error) throw error;
      
      toast.success("Image deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  if (bucketExists === false) {
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
                <h1 className="text-2xl font-bold">Default Featured Images</h1>
                <p className="text-muted-foreground">Manage default images for articles</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Storage Setup Required</AlertTitle>
            <AlertDescription>
              The article-images storage bucket needs to be created to use this feature.
              Please create a public storage bucket named "article-images" in Supabase.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">Default Featured Images</h1>
              <p className="text-muted-foreground">Manage default images for articles without featured images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Images</CardTitle>
            <CardDescription>
              Upload images or add them by URL. These will be used as fallback images for articles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Add by URL</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button onClick={handleAddImageUrl} disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Files</label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              <CardTitle>Image Pool</CardTitle>
            </div>
            <CardDescription>
              {images?.length || 0} images available. Random images from this pool will be used for articles without featured images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : images?.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Images Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload images or add them by URL to build your default image pool
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {images?.map((image) => (
                  <div
                    key={image.name}
                    className="group relative aspect-video rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this image? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteImage(image.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DefaultImagesManagement;
