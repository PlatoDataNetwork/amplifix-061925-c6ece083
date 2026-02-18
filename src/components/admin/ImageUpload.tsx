import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Loader2, ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onUpload?: (url: string) => void;
  bucket?: string;
  folder?: string;
}

const ImageUpload = ({ onUpload, bucket = 'article-images', folder = 'uploads' }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split('.').pop();
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
      return urlData.publicUrl;
    },
    onSuccess: (url) => {
      toast.success('Image uploaded');
      onUpload?.(url);
      setPreview(null);
      setFile(null);
    },
    onError: (err) => toast.error(`Upload failed: ${err.message}`),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className="h-4 w-4" />
          Image Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded-md" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => { setPreview(null); setFile(null); }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Click to select image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
        {file && (
          <Button
            onClick={() => uploadMutation.mutate(file)}
            disabled={uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
