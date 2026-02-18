import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Image, Trash2, Upload } from 'lucide-react';
import ImageUpload from './ImageUpload';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DefaultFeaturedImages = () => {
  const queryClient = useQueryClient();
  const [uploadValue, setUploadValue] = useState('');

  const { data: images, isLoading } = useQuery({
    queryKey: ['default-featured-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('default_featured_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addImage = useMutation({
    mutationFn: async (url: string) => {
      const { error } = await supabase.from('default_featured_images').insert({ image_url: url });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['default-featured-images'] });
      toast.success('Image added to pool');
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  const deleteImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('default_featured_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['default-featured-images'] });
      toast.success('Image removed');
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Default Featured Images</h2>
        <p className="text-muted-foreground">
          Upload images that will be randomly assigned to articles without featured images.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Images are automatically resized to 1200×630 pixels for optimal social media previews.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Upload Images</CardTitle>
          <CardDescription>
            Drag and drop images or click to select — auto-resized to 1200×630
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={uploadValue}
            onChange={(url) => {
              if (url) {
                addImage.mutate(url);
                setUploadValue('');
              }
            }}
          />
          <p className="text-sm text-muted-foreground text-center mt-3">
            {images?.length || 0} images in pool
          </p>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-1">Image Pool</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These images will be randomly used when articles don't have a featured image
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-video rounded-lg" />)}
          </div>
        ) : images?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-video rounded-lg overflow-hidden border border-border">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Image</AlertDialogTitle>
                        <AlertDialogDescription>Remove this image from the default pool?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteImage.mutate(img.id)}>Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-border rounded-lg">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No default images yet. Upload one above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultFeaturedImages;
