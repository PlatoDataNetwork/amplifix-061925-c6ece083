import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";

interface BackupProgressProps {
  backupName: string;
  onComplete?: () => void;
}

interface ProgressPayload {
  backed: number;
  total: number;
  status: 'starting' | 'processing' | 'completed' | 'interrupted' | 'error';
  error?: string;
}

export function BackupProgress({ backupName, onComplete }: BackupProgressProps) {
  const [progress, setProgress] = useState<ProgressPayload>({
    backed: 0,
    total: 0,
    status: 'starting'
  });

  useEffect(() => {
    console.log(`Subscribing to backup progress: ${backupName}`);
    
    const channel = supabase
      .channel(`backup-progress-${backupName}`)
      .on('broadcast', { event: 'progress' }, (payload) => {
        console.log('Progress update:', payload);
        setProgress(payload.payload as ProgressPayload);
        
        if (payload.payload.status === 'completed' || payload.payload.status === 'error') {
          onComplete?.();
        }
      })
      .subscribe((status) => {
        console.log('Channel subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from backup progress');
      supabase.removeChannel(channel);
    };
  }, [backupName, onComplete]);

  const percentage = progress.total > 0 
    ? Math.round((progress.backed / progress.total) * 100) 
    : 0;

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'starting':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'interrupted':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'starting':
        return 'Starting backup...';
      case 'processing':
        return 'Backing up articles...';
      case 'completed':
        return 'Backup completed!';
      case 'interrupted':
        return 'Backup interrupted';
      case 'error':
        return 'Backup failed';
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'starting':
      case 'processing':
        return 'border-blue-500/50';
      case 'completed':
        return 'border-green-500/50';
      case 'interrupted':
        return 'border-yellow-500/50';
      case 'error':
        return 'border-red-500/50';
    }
  };

  return (
    <Card className={`border-2 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {getStatusText()}
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {backupName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              {progress.backed.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Backed Up</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-muted-foreground">
              {progress.total.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-muted-foreground">
              {(progress.total - progress.backed).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>

        {/* Error Message */}
        {progress.status === 'error' && progress.error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            <p className="font-semibold">Error:</p>
            <p className="mt-1">{progress.error}</p>
          </div>
        )}

        {/* Completion Message */}
        {progress.status === 'completed' && (
          <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
            <p className="font-semibold">
              ✅ Successfully backed up {progress.backed.toLocaleString()} articles!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
