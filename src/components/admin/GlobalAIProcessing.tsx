import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Brain, Loader2 } from 'lucide-react';

export function GlobalAIProcessing() {
  const [processing, setProcessing] = useState(false);

  const handleProcessAll = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-all-verticals');
      
      if (error) throw error;
      
      toast.success('AI Processing Started', {
        description: data.message || 'Processing all verticals sequentially'
      });
      
      console.log('Processing results:', data.results);
    } catch (error) {
      console.error('Error starting global AI processing:', error);
      toast.error('Failed to start AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Global AI Processing
        </CardTitle>
        <CardDescription>
          Run AI processing on all verticals (except Aerospace and Aviation) sequentially
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleProcessAll} 
          disabled={processing}
          className="w-full"
        >
          {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {processing ? 'Starting AI Processing...' : 'Process All Verticals'}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          This will format and tag all unprocessed articles across all verticals one by one
        </p>
      </CardContent>
    </Card>
  );
}
