import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ImageIcon, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OGImageGenerator = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-og-image', {
        body: { title, subtitle },
      });
      if (error) throw error;
      if (data?.url) {
        setGeneratedUrl(data.url);
        toast.success('OG image generated');
      }
    } catch (err: any) {
      toast.error(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">OG Image Generator</h2>
        <p className="text-muted-foreground">Generate Open Graph images for social sharing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Generate Image
          </CardTitle>
          <CardDescription>Create a 1200×630 OG image with custom text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title..." />
          </div>
          <div className="space-y-2">
            <Label>Subtitle (optional)</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional subtitle..." />
          </div>
          <Button onClick={handleGenerate} disabled={!title || generating}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            Generate
          </Button>

          {generatedUrl && (
            <div className="space-y-2">
              <img src={generatedUrl} alt="Generated OG" className="w-full max-w-lg rounded-lg border" />
              <div className="flex gap-2">
                <Input value={generatedUrl} readOnly className="text-xs" />
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(generatedUrl); toast.success('Copied'); }}>
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OGImageGenerator;
