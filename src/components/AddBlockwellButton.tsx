import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export const AddBlockwellButton = () => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    toast.info('Adding Blockwell to showcase...');

    try {
      const { data, error } = await supabase.functions.invoke('add-blockwell-company', {
        body: {},
      });

      if (error) {
        console.error('Error:', error);
        toast.error('Failed to add Blockwell');
        return;
      }

      console.log('Add result:', data);
      toast.success(data.message || 'Blockwell added successfully!');
      
      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add Blockwell');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button 
      onClick={handleAdd}
      disabled={isAdding}
      size="sm"
      className="gap-2 bg-highlight-blue hover:bg-highlight-blue/90"
    >
      <Plus className={`h-4 w-4 ${isAdding ? 'animate-spin' : ''}`} />
      {isAdding ? 'Adding...' : 'Add Blockwell'}
    </Button>
  );
};
