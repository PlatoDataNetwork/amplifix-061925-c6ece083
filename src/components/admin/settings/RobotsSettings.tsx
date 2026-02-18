import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, FileCode, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const RobotsSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSiteSettings();
  const [robotsTxt, setRobotsTxt] = useState('');

  useEffect(() => {
    if (settings) {
      setRobotsTxt(settings.robotsTxt);
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings({ robotsTxt });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Robots.txt Settings</h2>
        <p className="text-muted-foreground">Control how search engines crawl your site</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Robots.txt Content
          </CardTitle>
          <CardDescription>
            Edit the robots.txt file served at your site root.{' '}
            <a
              href="https://developers.google.com/search/docs/crawling-indexing/robots/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="robotsTxt">Content</Label>
            <Textarea
              id="robotsTxt"
              className="font-mono text-sm min-h-[200px]"
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              placeholder="User-agent: *&#10;Allow: /"
            />
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RobotsSettings;
