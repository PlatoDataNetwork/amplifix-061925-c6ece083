import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { ImageIcon, Download, Loader2 } from 'lucide-react';

const BatchImageResizer = () => {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [quality, setQuality] = useState([80]);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleResize = async () => {
    if (!files.length) return;
    setProcessing(true);
    try {
      // Client-side resize using canvas
      for (const file of files) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `resized-${file.name}`;
                  a.click();
                }
                resolve();
              },
              'image/jpeg',
              quality[0] / 100
            );
            URL.revokeObjectURL(url);
          };
          img.src = url;
        });
      }
      toast.success(`Resized ${files.length} image(s)`);
    } catch (err) {
      toast.error('Resize failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Batch Image Resizer</h2>
        <p className="text-muted-foreground">Resize multiple images at once for consistent dimensions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resize Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quality: {quality[0]}%</Label>
            <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
          </div>
          <div className="space-y-2">
            <Label>Select Images</Label>
            <Input type="file" accept="image/*" multiple onChange={handleFiles} />
            {files.length > 0 && (
              <p className="text-sm text-muted-foreground">{files.length} file(s) selected</p>
            )}
          </div>
          <Button onClick={handleResize} disabled={!files.length || processing}>
            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Resize & Download
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchImageResizer;
