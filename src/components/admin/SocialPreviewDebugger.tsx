import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Eye, Copy, ExternalLink } from 'lucide-react';

const SocialPreviewDebugger = () => {
  const [url, setUrl] = useState('');
  const [previewData, setPreviewData] = useState<{
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  } | null>(null);

  const testUrl = () => {
    if (!url) return;
    // Simulate OG meta extraction
    setPreviewData({
      title: 'Page Title',
      description: 'Page description will appear here when URL is tested',
      image: '',
      url,
    });
    toast.info('Enter a full URL to test social sharing previews');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Social Preview Debugger</h2>
        <p className="text-muted-foreground">Test how your content appears when shared on social media</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test URL</CardTitle>
          <CardDescription>Enter a URL to preview its social sharing metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://amplifix.net/intel/article/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={testUrl}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
          </div>

          {previewData && (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden max-w-lg">
                {previewData.image && (
                  <img src={previewData.image} alt="" className="w-full h-48 object-cover" />
                )}
                <div className="p-3 bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase">amplifix.net</p>
                  <p className="font-semibold text-sm">{previewData.title}</p>
                  <p className="text-xs text-muted-foreground">{previewData.description}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                    Facebook Debugger <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://cards-dev.twitter.com/validator`} target="_blank" rel="noopener noreferrer">
                    Twitter Validator <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                    LinkedIn Inspector <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialPreviewDebugger;
