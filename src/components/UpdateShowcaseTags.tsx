import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tag } from "lucide-react";

export const UpdateShowcaseTags = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const companyTagUpdates = [
    { name: 'ForexGPT', tags: ['AI', 'Fintech', 'Forex'] },
    { name: 'CUT', tags: ['Carbon', 'Blockchain'] },
    { name: 'DevvStream Corp', tags: ['Carbon', 'Blockchain'] },
    { name: 'Naoris Protocol', tags: ['AI', 'Cyber', 'Blockchain'] },
    { name: 'Abatis', tags: ['Cyber', 'Blockchain'] },
    { name: 'SILO Pharma Inc.', tags: ['AI', 'Biotechnology', 'Pharma', 'Psychedelics'] },
    { name: 'Micropolis', tags: ['Automotive'] },
    { name: 'Karbon-X', tags: ['Carbon'] },
    { name: 'FacialDX', tags: ['AI', 'Facial Analysis'] },
    { name: 'Int\'l Land Alliance', tags: ['Real Estate'] },
    { name: 'Synbio Int\'l', tags: ['AI', 'Facial Analysis'] },
    { name: 'FAIM', tags: ['AI', 'Blockchain'] }
  ];

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const company of companyTagUpdates) {
        const { error } = await supabase
          .from('showcase_companies')
          .update({ tags: company.tags })
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
        Update sector tags for all companies to support the new filtering system with multiple tags per company.
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
