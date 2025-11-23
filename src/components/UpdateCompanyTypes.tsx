import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building } from "lucide-react";

export const UpdateCompanyTypes = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      // Update CUT to private
      const { error } = await supabase
        .from('showcase_companies')
        .update({ type: 'private' })
        .eq('company_name', 'CUT');

      if (error) throw error;

      toast({
        title: "Company Type Updated",
        description: "CUT has been updated to private company.",
      });

      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error updating company type:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update company type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Building className="h-5 w-5 text-highlight-blue" />
        <h3 className="text-lg font-semibold">Update CUT to Private Company</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Change CUT from public to private company type.
      </p>
      <Button 
        onClick={handleUpdate}
        disabled={isUpdating}
        className="bg-highlight-blue hover:bg-highlight-blue/90"
      >
        {isUpdating ? "Updating..." : "Update CUT to Private"}
      </Button>
    </div>
  );
};
