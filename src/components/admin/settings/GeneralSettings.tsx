import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const GeneralSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSiteSettings();
  const [form, setForm] = useState({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    contactEmail: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        siteUrl: settings.siteUrl,
        contactEmail: settings.contactEmail,
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
        <h2 className="text-2xl font-bold">General Settings</h2>
        <p className="text-muted-foreground">Configure your site's basic information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic details about your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={form.siteDescription}
              onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              value={form.siteUrl}
              onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
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

export default GeneralSettings;
