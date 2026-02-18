import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Map } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const SitemapsSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSiteSettings();
  const [form, setForm] = useState({
    sitemapEnabled: 'true',
    sitemapMaxUrls: '1000',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        sitemapEnabled: settings.sitemapEnabled,
        sitemapMaxUrls: settings.sitemapMaxUrls,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings(form);
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
        <h2 className="text-2xl font-bold">Sitemap Settings</h2>
        <p className="text-muted-foreground">Configure sitemap generation for SEO</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Sitemap Configuration
          </CardTitle>
          <CardDescription>Control how sitemaps are generated and served</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Sitemaps</Label>
              <p className="text-sm text-muted-foreground">Automatically generate XML sitemaps</p>
            </div>
            <Switch
              checked={form.sitemapEnabled === 'true'}
              onCheckedChange={(checked) =>
                setForm({ ...form, sitemapEnabled: checked ? 'true' : 'false' })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sitemapMaxUrls">Max URLs per Sitemap</Label>
            <Input
              id="sitemapMaxUrls"
              type="number"
              value={form.sitemapMaxUrls}
              onChange={(e) => setForm({ ...form, sitemapMaxUrls: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of URLs per sitemap file (recommended: 1000-50000)
            </p>
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

export default SitemapsSettings;
