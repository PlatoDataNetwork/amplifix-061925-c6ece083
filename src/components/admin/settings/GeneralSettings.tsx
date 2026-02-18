import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Save, Globe } from "lucide-react";

const GeneralSettings = () => {
  const queryClient = useQueryClient();
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const { data: settings, isLoading } = useQuery({ queryKey: ["site-settings", "general"], queryFn: async () => { const { data, error } = await supabase.from("site_settings").select("key, value").in("key", ["site_name", "site_description"]); if (error) throw error; const m: Record<string, string> = {}; data?.forEach(s => { m[s.key] = s.value || ""; }); return m; } });
  useEffect(() => { if (settings) { setSiteName(settings.site_name || ""); setSiteDescription(settings.site_description || ""); } }, [settings]);
  const saveMutation = useMutation({ mutationFn: async () => { for (const u of [{ key: "site_name", value: siteName }, { key: "site_description", value: siteDescription }]) { const { error } = await supabase.from("site_settings").update({ value: u.value }).eq("key", u.key); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["site-settings"] }); toast.success("General settings saved"); }, onError: (e) => toast.error(`Failed: ${e.message}`) });

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground">General Settings</h2><p className="text-muted-foreground text-sm">Configure your site name and description</p></div>
      <div className="bg-card border border-border rounded-lg p-4"><div className="flex items-start gap-3"><Globe className="w-5 h-5 text-primary mt-0.5" /><div><p className="text-sm text-foreground font-medium">Site Identity</p><p className="text-sm text-muted-foreground mt-1">These settings affect how your site appears in search engines and browser tabs.</p></div></div></div>
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="space-y-2"><Label htmlFor="siteName">Site Name</Label><Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Enter site name" /><p className="text-xs text-muted-foreground">Displayed in browser title bar and search results.</p></div>
        <div className="space-y-2"><Label htmlFor="siteDescription">Site Description</Label><Textarea id="siteDescription" value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="Enter site description" rows={4} /><p className="text-xs text-muted-foreground">A brief description for search engines (meta description).</p></div>
        <div className="flex justify-end"><Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}><Save className="w-4 h-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Changes"}</Button></div>
      </div>
    </div>
  );
};

export default GeneralSettings;