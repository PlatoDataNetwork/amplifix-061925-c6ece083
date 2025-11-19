import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUpdateArticle = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateArticle = async (postId: number, content: string) => {
    setIsUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('update-article', {
        body: { post_id: postId, content },
      });

      if (error) throw error;

      toast.success('Article updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Failed to update article');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateArticle, isUpdating };
};
