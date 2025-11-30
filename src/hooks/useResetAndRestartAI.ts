import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useResetAndRestartAI = () => {
  const [resetting, setResetting] = useState(false);

  const resetAndRestart = async (verticalSlug: string, fastMode = false, skipTags = false) => {
    try {
      setResetting(true);
      toast.info(`Resetting AI processing for ${verticalSlug}...`);

      const { data, error } = await supabase.functions.invoke('reset-and-restart-ai', {
        body: { verticalSlug, fastMode, skipTags }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('AI processing restarted!', {
          description: `Processing ${data.articlesToProcess} articles in ${data.totalChunks} chunks`,
          duration: 5000
        });
        return data;
      } else {
        toast.info(data.message || 'No articles to process');
        return data;
      }
    } catch (error) {
      toast.error('Failed to restart AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      setResetting(false);
    }
  };

  return { resetAndRestart, resetting };
};
