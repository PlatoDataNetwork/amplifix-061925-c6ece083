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
      // Update CUT to token with green thumbnail
      const { error: cutError } = await supabase
        .from('showcase_companies')
        .update({ 
          type: 'token',
          thumbnail: '/lovable-uploads/cut-eco-thumbnail.png'
        })
        .eq('company_name', 'CUT');

      if (!cutError) successCount++;

      // Update Naoris Protocol to private with new subtitle
      const { error: naorisError } = await supabase
        .from('showcase_companies')
        .update({ 
          type: 'private',
          subtitle: 'Quantum Resistant Cybersecurity'
        })
        .eq('company_name', 'Naoris Protocol');

      if (!naorisError) successCount++;

      // Update VSee Health ticker
      const { error: vseeTickerError } = await supabase
        .from('showcase_companies')
        .update({ ticker: 'NAS: VSEE' })
        .eq('company_name', 'VSee Health');

      if (!vseeTickerError) successCount++;

      // Update FAIM subtitle
      const { error: faimError } = await supabase
        .from('showcase_companies')
        .update({ subtitle: 'AI Powered Fan Engagement' })
        .eq('company_name', 'FAIM');

      if (!faimError) successCount++;

      // Update DevvStream ticker
      const { error: devvError } = await supabase
        .from('showcase_companies')
        .update({ ticker: 'NAS: DEVS' })
        .eq('company_name', 'DevvStream Corp');

      if (!devvError) successCount++;

      // Update FacialDX subtitle
      const { error: facialError } = await supabase
        .from('showcase_companies')
        .update({ subtitle: 'Early Detection for PTSD' })
        .eq('company_name', 'FacialDX');

      if (!facialError) successCount++;

      // Update Micropolis ticker
      const { error: micropolisError } = await supabase
        .from('showcase_companies')
        .update({ ticker: 'NYSE: MCRP' })
        .eq('company_name', 'Micropolis');

      if (!micropolisError) successCount++;

      // Update Karbon-X ticker
      const { error: karbonError } = await supabase
        .from('showcase_companies')
        .update({ ticker: 'OTC: KARX' })
        .eq('company_name', 'Karbon-X');

      if (!karbonError) successCount++;

      // Update Abatis subtitle
      const { error: abatisError } = await supabase
        .from('showcase_companies')
        .update({ subtitle: 'Defense Proof Cybersecurity' })
        .eq('company_name', 'Abatis');

      if (!abatisError) successCount++;

      // Update Silo Pharma ticker
      const { error: siloError } = await supabase
        .from('showcase_companies')
        .update({ ticker: 'NAS: SILO' })
        .eq('company_name', 'SILO Pharma Inc.');

      if (!siloError) successCount++;

      // Add Token tag to FAIM, CUT, ABATIS, NAORIS, DEVS
      const tokenCompanies = ['FAIM', 'CUT', 'Abatis', 'Naoris Protocol', 'DevvStream Corp'];
      
      for (const companyName of tokenCompanies) {
        const { data: company } = await supabase
          .from('showcase_companies')
          .select('tags')
          .eq('company_name', companyName)
          .maybeSingle();

        if (company) {
          const existingTags = company.tags || [];
          if (!existingTags.includes('Token')) {
            const updatedTags = [...existingTags, 'Token'];
            const { error: tokenError } = await supabase
              .from('showcase_companies')
              .update({ tags: updatedTags })
              .eq('company_name', companyName);

            if (!tokenError) successCount++;
          } else {
            successCount++; // Already has Token tag
          }
        }
      }

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
            ticker: "NAS: VSEE",
            subtitle: "Global Leader in Telehealth Solutions",
            description: "VSee Health is a global leader in telehealth solutions, providing secure video consultation platforms, remote patient monitoring, and integrated care management systems.",
            tags: ["AI", "Telehealth", "Healthcare Technology", "Medical Devices"],
            button_text: "View Showcase",
            link: "/showcase/vsee-health",
            website: "https://vseehealth.com/about",
            stock_url: "https://www.tradingview.com/symbols/NASDAQ-VSEE/",
            search_url: "https://www.bing.com/copilotsearch?q=VSEE%20Health%20NASDAQ:%20VSEE&FORM=CSSCOP",
            thumbnail: "/lovable-uploads/vsee-health-thumbnail.png",
            type: "stock",
            display_order: 12,
            disabled: false
          });

        if (!vseeError) successCount++;
      } else {
        // Update existing entry
        const { error: updateError } = await supabase
          .from("showcase_companies")
          .update({
            ticker: "NAS: VSEE",
            description: "VSee Health is a global leader in telehealth solutions, providing secure video consultation platforms, remote patient monitoring, and integrated care management systems.",
            button_text: "View Showcase",
            link: "/showcase/vsee-health",
            search_url: "https://www.bing.com/copilotsearch?q=VSEE%20Health%20NASDAQ:%20VSEE&FORM=CSSCOP"
          })
          .eq("company_name", "VSee Health");
        
        if (!updateError) successCount++;
      }

      toast({
        title: "Updates Complete!",
        description: `Updated ${successCount} showcase companies with new tickers and subtitles.`,
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
        Click to: Update all showcase company tickers and subtitles
      </p>
      <Button 
        onClick={handleQuickUpdate}
        disabled={isUpdating}
        className="bg-highlight-blue hover:bg-highlight-blue/90 text-lg px-8 py-6"
        size="lg"
      >
        {isUpdating ? "Updating..." : "Update All Showcase Companies"}
      </Button>
    </div>
  );
};
