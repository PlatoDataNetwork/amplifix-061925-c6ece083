import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  gaTrackingId: string;
  gaMeasurementId: string;
  gaPropertyId: string;
  robotsTxt: string;
  sitemapEnabled: string;
  sitemapMaxUrls: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'AmplifiX',
  siteDescription: 'AmplifiX Intelligence Platform',
  siteUrl: 'https://amplifix.net',
  contactEmail: 'support@amplifix.net',
  gaTrackingId: '',
  gaMeasurementId: 'G-FQ4G09PD29',
  gaPropertyId: '504421609',
  robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://amplifix.net/sitemaps/index.xml',
  sitemapEnabled: 'true',
  sitemapMaxUrls: '1000',
};

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      if (error) throw error;

      const settingsMap = { ...DEFAULT_SETTINGS };
      data?.forEach((row) => {
        if (row.key in settingsMap) {
          (settingsMap as any)[row.key] = row.value || (DEFAULT_SETTINGS as any)[row.key];
        }
      });
      return settingsMap;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({ key, value });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: (error) => {
      toast.error(`Failed to update setting: ${error.message}`);
    },
  });

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    for (const [key, value] of Object.entries(updates)) {
      await updateSetting.mutateAsync({ key, value: value as string });
    }
    toast.success('Settings saved');
  };

  return {
    settings: settings || DEFAULT_SETTINGS,
    isLoading,
    updateSettings,
    isUpdating: updateSetting.isPending,
  };
}
