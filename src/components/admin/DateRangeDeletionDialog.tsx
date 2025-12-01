import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DateRangeDeletionDialogProps {
  onSuccess?: () => void;
}

export function DateRangeDeletionDialog({ onSuccess }: DateRangeDeletionDialogProps) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [previewData, setPreviewData] = useState<{
    count: number;
    samples: Array<{ title: string; date: string; vertical: string }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePreview = async () => {
    if (!startDate && !endDate) {
      toast.error('Please select at least one date');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-articles-after-date', {
        body: {
          startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
          endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
          previewOnly: true
        }
      });

      if (error) throw error;

      setPreviewData({
        count: data.count,
        samples: data.sampleArticles || []
      });

      if (data.count === 0) {
        toast.info('No articles found in selected date range');
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview articles', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!startDate && !endDate) {
      toast.error('Please select at least one date');
      return;
    }

    if (!previewData || previewData.count === 0) {
      toast.error('No articles to delete. Please preview first.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${previewData.count.toLocaleString()} articles? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-articles-after-date', {
        body: {
          startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
          endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
          previewOnly: false
        }
      });

      if (error) throw error;

      toast.success('Articles deleted successfully', {
        description: `${data.deleted.toLocaleString()} articles removed`,
        duration: 5000
      });

      // Reset state
      setStartDate(undefined);
      setEndDate(undefined);
      setPreviewData(null);
      setOpen(false);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete articles', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setPreviewData(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Date Range Deletion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Bulk Article Deletion by Date Range
          </DialogTitle>
          <DialogDescription>
            Select a date range to delete articles. You can preview the count before deletion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date (inclusive)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Leave empty to include all articles before end date
              </p>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date (inclusive)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Leave empty to include all articles after start date
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={(!startDate && !endDate) || isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? 'Loading...' : 'Preview Count'}
            </Button>
            <Button
              onClick={handleReset}
              variant="ghost"
              disabled={!startDate && !endDate}
            >
              Reset
            </Button>
          </div>

          {/* Preview Results */}
          {previewData && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="font-semibold text-lg">
                    {previewData.count.toLocaleString()} articles will be deleted
                  </div>
                  
                  {startDate && endDate && (
                    <p className="text-sm text-muted-foreground">
                      Date range: {format(startDate, "MMM dd, yyyy")} to {format(endDate, "MMM dd, yyyy")}
                    </p>
                  )}
                  {startDate && !endDate && (
                    <p className="text-sm text-muted-foreground">
                      From: {format(startDate, "MMM dd, yyyy")} onwards
                    </p>
                  )}
                  {!startDate && endDate && (
                    <p className="text-sm text-muted-foreground">
                      Up to: {format(endDate, "MMM dd, yyyy")}
                    </p>
                  )}

                  {previewData.samples.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Sample articles:</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {previewData.samples.map((article, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-background rounded border border-border text-xs"
                          >
                            <div className="font-medium truncate">{article.title}</div>
                            <div className="text-muted-foreground flex items-center gap-2 mt-1">
                              <span>{article.vertical}</span>
                              <span>•</span>
                              <span>{format(new Date(article.date), "MMM dd, yyyy")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!previewData || previewData.count === 0 || isDeleting}
          >
            {isDeleting ? 'Deleting...' : `Delete ${previewData ? previewData.count.toLocaleString() : '0'} Articles`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
