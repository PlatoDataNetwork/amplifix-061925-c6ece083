import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tag } from "lucide-react";

export const UpdateShowcaseTags = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const companyTagUpdates = [
    { name: 'VSee Health', tags: ['Medical Device', 'AI', 'Telehealth'], type: 'stock', subtitle: 'NAS:VSEE', main_sector: 'Telehealth' },
    { name: 'FAIM', tags: ['AI', 'Blockchain', 'Token'], type: 'token', subtitle: 'AI Powered Fan Engagement', main_sector: 'WEB3' },
    { name: 'ForexGPT', tags: ['AI', 'Fintech', 'Forex'], type: 'private', subtitle: 'AI Powered Forex Analysis', main_sector: 'AI' },
    { name: 'CUT', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'token', subtitle: 'RWA / Carbon Tokenization', main_sector: 'CARBON' },
    { name: 'DevvStream Corp', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'token', subtitle: 'NAS:DEVS', main_sector: 'CARBON' },
    { name: "Int'l Land Alliance", tags: ['Real Estate'], type: 'stock', subtitle: 'OTCQB:ILAL', main_sector: 'REAL ESTATE' },
    { name: 'SILO Pharma Inc.', tags: ['AI', 'Biotech', 'Psychedelics'], type: 'stock', subtitle: 'NAS:SILO', main_sector: 'PSYCHEDELICS' },
    { name: "Synbio Int'l", tags: ['AI', 'Medical Device', 'Facial Analysis'], type: 'stock', subtitle: 'OTC:SYIN', main_sector: 'AI, FACIAL ANALYSIS' },
    { name: 'Abatis', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'token', subtitle: 'Defense Grade Cybersecurity', main_sector: 'CYBERSECURITY' },
    { name: 'FacialDX', tags: ['AI', 'Facial Analysis'], type: 'private', subtitle: 'AI Powered Facial Analysis', main_sector: 'AI, FACIAL ANALYSIS' },
    { name: 'Naoris Protocol', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'token', subtitle: 'Quantum Resistant Cybersecurity', main_sector: 'CYBERSECURITY' },
    { name: 'Karbon-X', tags: ['Carbon'], type: 'stock', subtitle: 'Carbon Credits', main_sector: 'CARBON' },
    { name: 'Micropolis', tags: ['AI', 'Automotive', 'Robotics'], type: 'stock', subtitle: 'AI Autonomous Vehicles', main_sector: 'ROBOTICS' },
  ];

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const company of companyTagUpdates) {
        const { error } = await supabase
          .from('showcase_companies')
          .update({ 
            tags: company.tags,
            type: company.type,
            subtitle: company.subtitle,
            main_sector: company.main_sector
          })
          .eq('company_name', company.name);

        if (error) {
          console.error(`Error updating ${company.name}:`, error);
          errorCount++;
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Tags Updated",
          description: `Successfully updated ${successCount} companies with new sector tags.`,
        });
      }

      if (errorCount > 0) {
        toast({
          title: "Some Updates Failed",
          description: `${errorCount} companies could not be updated. Check console for details.`,
          variant: "destructive",
        });
      }

      // Refresh the page to show updated data
      if (successCount > 0) {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error("Error updating showcase tags:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update showcase tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Tag className="h-5 w-5 text-highlight-blue" />
        <h3 className="text-lg font-semibold">Update Showcase Company Tags</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Update all 13 companies with correct tags, types, subtexts, and main sectors from the spreadsheet. This will update tags for filtering, set proper company types (stock/private/token), add descriptive subtexts, and assign main sector badges.
      </p>
      <Button 
        onClick={handleUpdate}
        disabled={isUpdating}
        className="bg-highlight-blue hover:bg-highlight-blue/90"
      >
        {isUpdating ? "Updating..." : "Update All Company Tags"}
      </Button>
    </div>
  );
};
