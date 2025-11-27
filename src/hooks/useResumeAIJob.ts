import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useResumeAIJob = () => {
  const [resuming, setResuming] = useState(false);

  const resumeJob = async (jobId: string) => {
    try {
      setResuming(true);
      toast.info('Resuming AI processing job...');

      const { data, error } = await supabase.functions.invoke('resume-ai-job', {
        body: { jobId }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('AI processing resumed!', {
          description: `Continuing from chunk ${data.nextChunkIndex}/${data.totalChunks}`,
          duration: 5000
        });
      } else {
        toast.warning(data.message || 'Could not resume job');
      }

      return data;
    } catch (error) {
      toast.error('Failed to resume AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      setResuming(false);
    }
  };

  return { resumeJob, resuming };
};
