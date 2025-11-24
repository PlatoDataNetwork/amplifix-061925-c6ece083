import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Coins } from "lucide-react";

export const AddKedalionButton = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    setIsAdding(true);
    
    try {
      // Check if Kedalion already exists
      const { data: existing } = await supabase
        .from('showcase_companies')
        .select('id')
        .eq('company_name', 'Kedalion')
        .single();

      if (existing) {
        toast({
          title: "Already Exists",
          description: "Kedalion is already in the database.",
        });
        setIsAdding(false);
        return;
      }

      // Insert Kedalion
      const { error } = await supabase
        .from('showcase_companies')
        .insert({
          company_name: 'Kedalion',
          subtitle: 'Tokenized In-Ground Gold & Silver',
          description: 'Kedalion gives you tokenized access to verified in-ground gold and silver — before mining begins. 43-101 regulated resources with direct asset ownership.',
          tags: ['Token', 'FINTECH', 'Blockchain', 'Precious Metals'],
          button_text: 'View Showcase',
          link: '/showcase/kedalion',
          website: 'https://dev.kedalion.io/',
          search_url: 'https://www.bing.com/search?q=Kedalion+tokenized+gold+silver',
          thumbnail: '/lovable-uploads/kedalion-thumbnail.png',
          type: 'private',
          main_sector: 'FINTECH',
          display_order: 5,
          disabled: false
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Kedalion has been added to the showcase database.",
      });

      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error adding Kedalion:", error);
      toast({
        title: "Error",
        description: "Failed to add Kedalion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Coins className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold">Add Kedalion to Database</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Add Kedalion to the showcase_companies database for admin management and persistence.
      </p>
      <Button 
        onClick={handleAdd}
        disabled={isAdding}
        className="bg-amber-500 hover:bg-amber-600 text-black"
      >
        {isAdding ? "Adding..." : "Add Kedalion"}
      </Button>
    </div>
  );
};
