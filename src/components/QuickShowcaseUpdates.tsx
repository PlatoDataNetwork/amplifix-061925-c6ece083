import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

export const QuickShowcaseUpdates = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleQuickUpdate = async () => {
    setIsUpdating(true);
    let successCount = 0;
    
    try {
      // Update CUT to private
      const { error: cutError } = await supabase
        .from('showcase_companies')
        .update({ type: 'private' })
        .eq('company_name', 'CUT');

      if (!cutError) successCount++;

      // Update Naoris Protocol to private
      const { error: naorisError } = await supabase
        .from('showcase_companies')
        .update({ type: 'private' })
        .eq('company_name', 'Naoris Protocol');

      if (!naorisError) successCount++;

      // Add VSee Health if it doesn't exist
      const { data: existing } = await supabase
        .from("showcase_companies")
        .select("id")
        .eq("company_name", "VSee Health")
        .maybeSingle();

      if (!existing) {
        const { error: vseeError } = await supabase
          .from("showcase_companies")
          .insert({
            company_name: "VSee Health",
            ticker: "VSEE",
            subtitle: "Global Leader in Telehealth Solutions",
            description: "VSee Health is a global leader in telehealth solutions, providing secure video consultation platforms, remote patient monitoring, and integrated care management systems used by healthcare providers in over 100 countries.",
            tags: ["AI", "Telehealth", "Healthcare Technology"],
            button_text: "View Showcase",
            link: "/showcase/vsee-health",
            website: "https://vseehealth.com/",
            stock_url: "https://www.tradingview.com/symbols/NASDAQ-VSEE/",
            search_url: "https://www.google.com/search?q=VSee+Health+NASDAQ+VSEE",
            thumbnail: "/lovable-uploads/vsee-health-thumbnail.png",
            type: "stock",
            display_order: 12,
            disabled: false
          });

        if (!vseeError) successCount++;
      } else {
        successCount++; // Already exists
      }

      toast({
        title: "Updates Complete!",
        description: `Updated CUT and Naoris to private, and added VSee Health.`,
      });

      // Refresh after a short delay
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error during quick updates:", error);
      toast({
        title: "Update Failed",
        description: "Some updates failed. Please check the console.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-highlight-blue/10 to-purple-500/10 p-6 rounded-lg border-2 border-highlight-blue/30">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="h-6 w-6 text-highlight-blue" />
        <h3 className="text-xl font-bold">Quick Updates</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Click to: Update CUT & Naoris to private + Add VSee Health to showcase
      </p>
      <Button 
        onClick={handleQuickUpdate}
        disabled={isUpdating}
        className="bg-highlight-blue hover:bg-highlight-blue/90 text-lg px-8 py-6"
        size="lg"
      >
        {isUpdating ? "Updating..." : "Update CUT, Naoris & Add VSEE"}
      </Button>
    </div>
  );
};
