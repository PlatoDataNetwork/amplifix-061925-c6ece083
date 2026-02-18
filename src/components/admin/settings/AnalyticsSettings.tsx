import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, BarChart3 } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const AnalyticsSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSiteSettings();
  const [form, setForm] = useState({
    gaTrackingId: '',
    gaMeasurementId: '',
    gaPropertyId: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        gaTrackingId: settings.gaTrackingId,
        gaMeasurementId: settings.gaMeasurementId,
        gaPropertyId: settings.gaPropertyId,
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
        <h2 className="text-2xl font-bold">Analytics Settings</h2>
        <p className="text-muted-foreground">Configure Google Analytics integration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Google Analytics
          </CardTitle>
          <CardDescription>Connect your GA4 property for traffic tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gaTrackingId">GA Tracking ID</Label>
            <Input
              id="gaTrackingId"
              placeholder="UA-XXXXXXXXX-X"
              value={form.gaTrackingId}
              onChange={(e) => setForm({ ...form, gaTrackingId: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gaMeasurementId">Measurement ID (GA4)</Label>
              <Input
                id="gaMeasurementId"
                placeholder="G-XXXXXXXXXX"
                value={form.gaMeasurementId}
                onChange={(e) => setForm({ ...form, gaMeasurementId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gaPropertyId">Property ID</Label>
              <Input
                id="gaPropertyId"
                placeholder="504421609"
                value={form.gaPropertyId}
                onChange={(e) => setForm({ ...form, gaPropertyId: e.target.value })}
              />
            </div>
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

export default AnalyticsSettings;
