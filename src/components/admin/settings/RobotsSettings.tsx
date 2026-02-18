import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Save, Bot, ExternalLink, RotateCcw } from "lucide-react";

const DEFAULT_ROBOTS_TXT = `User-agent: *\nAllow: /\n\nSitemap: https://amplifix-061925.lovable.app/sitemap.xml`;

const RobotsSettings = () => {
  const queryClient = useQueryClient();
  const [robotsTxt, setRobotsTxt] = useState("");
  const { data: settings, isLoading } = useQuery({ queryKey: ["site-settings", "robots_txt"], queryFn: async () => { const { data, error } = await supabase.from("site_settings").select("value").eq("key", "robots_txt").maybeSingle(); if (error) throw error; return data?.value || DEFAULT_ROBOTS_TXT; } });
  useEffect(() => { if (settings) setRobotsTxt(settings); }, [settings]);
  const saveMutation = useMutation({ mutationFn: async () => { const { error } = await supabase.from("site_settings").update({ value: robotsTxt }).eq("key", "robots_txt"); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["site-settings"] }); toast.success("Robots.txt saved"); }, onError: (e) => toast.error(`Failed: ${e.message}`) });

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground">Robots.txt</h2><p className="text-muted-foreground text-sm">Configure how search engine crawlers interact with your site</p></div>
      <div className="bg-card border border-border rounded-lg p-4"><div className="flex items-start gap-3"><Bot className="w-5 h-5 text-primary mt-0.5" /><div><p className="text-sm text-foreground font-medium">What is robots.txt?</p><p className="text-sm text-muted-foreground mt-1">The robots.txt file tells search engine crawlers which pages they can or cannot request from your site.</p></div></div></div>
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between"><Label htmlFor="robotsTxt">File Content</Label><a href="https://amplifix-061925.lovable.app/robots.txt" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">View live file <ExternalLink className="w-3 h-3" /></a></div>
        <Textarea id="robotsTxt" value={robotsTxt} onChange={(e) => setRobotsTxt(e.target.value)} placeholder="User-agent: *&#10;Allow: /" rows={12} className="font-mono text-sm" />
        <p className="text-xs text-muted-foreground">Common directives: <code className="bg-muted px-1 rounded">User-agent</code>, <code className="bg-muted px-1 rounded ml-1">Allow</code>, <code className="bg-muted px-1 rounded ml-1">Disallow</code>, <code className="bg-muted px-1 rounded ml-1">Sitemap</code></p>
      </div>
      <div className="flex justify-between"><Button variant="outline" onClick={() => setRobotsTxt(DEFAULT_ROBOTS_TXT)}><RotateCcw className="w-4 h-4 mr-2" />Reset to Default</Button><Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}><Save className="w-4 h-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Changes"}</Button></div>
    </div>
  );
};

export default RobotsSettings;