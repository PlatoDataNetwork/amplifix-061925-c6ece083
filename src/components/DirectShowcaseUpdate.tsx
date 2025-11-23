import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export const DirectShowcaseUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    toast.info('Updating all showcase companies...');

    try {
      const { data, error } = await supabase.functions.invoke('update-showcase-data', {
        body: {},
      });

      if (error) {
        console.error('Error:', error);
        toast.error('Failed to update companies');
        return;
      }

      console.log('Update result:', data);
      toast.success(data.message || 'All companies updated successfully!');
      
      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update companies');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdate}
      disabled={isUpdating}
      size="sm"
      variant="outline"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
      {isUpdating ? 'Updating...' : 'Update All Companies'}
    </Button>
  );
};
