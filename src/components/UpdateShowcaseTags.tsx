import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tag } from "lucide-react";

export const UpdateShowcaseTags = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const companyTagUpdates = [
    { name: 'VSee Health', tags: ['Medical Device', 'AI', 'Telehealth'], type: 'stock', subtitle: 'NAS:VSEE' },
    { name: 'FAIM', tags: ['AI', 'Blockchain'], type: 'token', subtitle: 'AI Powered Fan Engagement' },
    { name: 'ForexGPT', tags: ['AI', 'Fintech', 'Forex'], type: 'private', subtitle: 'AI Powered Forex Analysis' },
    { name: 'CUT', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech'], type: 'token', subtitle: 'RWA / Carbon Tokenization' },
    { name: 'DevvStream Corp', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech'], type: 'token', subtitle: 'NAS:DEVS' },
    { name: "Int'l Land Alliance", tags: ['Real Estate'], type: 'stock', subtitle: 'OTCQB:ILAL' },
    { name: 'SILO Pharma Inc.', tags: ['AI', 'Biotech', 'Psychedelics'], type: 'stock', subtitle: 'NAS:SILO' },
    { name: "Synbio Int'l", tags: ['AI', 'Medical Device', 'Facial Analysis'], type: 'stock', subtitle: 'OTC:SYIN' },
    { name: 'Abatis', tags: ['AI', 'Blockchain', 'Cyber'], type: 'token', subtitle: 'Defense Grade Cybersecurity' },
    { name: 'FacialDX', tags: ['AI', 'Facial Analysis'], type: 'private', subtitle: 'AI Powered Facial Analysis' },
    { name: 'Naoris Protocol', tags: ['AI', 'Blockchain', 'Cyber'], type: 'token', subtitle: 'Quantum Resistant Cybersecurity' },
    { name: 'Karbon-X', tags: ['Carbon'], type: 'stock', subtitle: 'Carbon Credits' },
    { name: 'Micropolis', tags: ['AI', 'Automotive'], type: 'stock', subtitle: 'AI Autonomous Vehicles' },
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
            subtitle: company.subtitle
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
        Update all 13 companies with correct tags, types, and subtexts from the spreadsheet. This will update tags for filtering, set proper company types (stock/private/token), and add descriptive subtexts.
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
