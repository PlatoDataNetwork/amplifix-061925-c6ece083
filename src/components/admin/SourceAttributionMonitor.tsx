import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface AttributionProgress {
  verticalSlug: string;
  total: number;
  updated: number;
  skipped: number;
  errors: number;
  status: 'running' | 'completed' | 'error';
  message?: string;
}

interface SourceAttributionMonitorProps {
  verticalSlug: string;
  isProcessing: boolean;
}

export const SourceAttributionMonitor = ({ verticalSlug, isProcessing }: SourceAttributionMonitorProps) => {
  const [progress, setProgress] = useState<AttributionProgress | null>(null);

  useEffect(() => {
    if (!isProcessing) {
      setProgress(null);
      return;
    }

    // Initialize progress tracking
    setProgress({
      verticalSlug,
      total: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      status: 'running',
      message: 'Starting source attribution...'
    });

    // Subscribe to article updates
    const channel = supabase
      .channel(`source-attribution-${verticalSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'articles',
          filter: `vertical_slug=eq.${verticalSlug}`
        },
        (payload) => {
          console.log('Article updated:', payload);
          setProgress(prev => {
            if (!prev) return null;
            
            // Check if this update includes source attribution
            const newContent = payload.new?.content || '';
            const oldContent = payload.old?.content || '';
            const hasNewAttribution = newContent.includes('Plato Data Intelligence');
            const hadOldAttribution = oldContent.includes('Plato Data Intelligence');
            
            if (hasNewAttribution && !hadOldAttribution) {
              return {
                ...prev,
                updated: prev.updated + 1,
                message: `Processing article ${prev.updated + 1}...`
              };
            }
            
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [verticalSlug, isProcessing]);

  if (!progress || !isProcessing) {
    return null;
  }

  const progressPercentage = progress.total > 0 
    ? Math.round((progress.updated / progress.total) * 100) 
    : 0;

  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {progress.status === 'running' && (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span>Adding Source Attribution</span>
            </>
          )}
          {progress.status === 'completed' && (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Attribution Complete</span>
            </>
          )}
          {progress.status === 'error' && (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <span>Attribution Error</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {progress.total > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-green-500/10">
                <p className="text-2xl font-bold text-green-500">{progress.updated}</p>
                <p className="text-xs text-muted-foreground">Updated</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <p className="text-2xl font-bold text-yellow-500">{progress.skipped}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10">
                <p className="text-2xl font-bold text-red-500">{progress.errors}</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
          </>
        )}

        {progress.message && (
          <p className="text-sm text-muted-foreground text-center">
            {progress.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
