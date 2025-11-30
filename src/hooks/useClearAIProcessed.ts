import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useClearAIProcessed = () => {
  const [clearing, setClearing] = useState(false);

  const clearAIProcessed = async (verticalSlug: string) => {
    try {
      setClearing(true);
      toast.info(`Clearing AI processing flags for ${verticalSlug}...`);

      const { data, error } = await supabase.functions.invoke('clear-ai-processed', {
        body: { verticalSlug }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('AI flags cleared successfully!', {
          description: `Cleared ${data.cleared} articles. Ready to reprocess with source extraction.`,
          duration: 5000
        });
        return data;
      } else {
        toast.warning(data.message || 'No articles to clear');
        return data;
      }
    } catch (error) {
      toast.error('Failed to clear AI processing flags', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      setClearing(false);
    }
  };

  return { clearAIProcessed, clearing };
};
