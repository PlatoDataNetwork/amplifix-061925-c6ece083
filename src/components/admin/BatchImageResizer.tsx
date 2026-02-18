import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ImageIcon, Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const TARGET_WIDTH = 1200; const TARGET_HEIGHT = 630;
interface ResizeResult { fileName: string; status: "success" | "error" | "skipped"; message: string; }

const resizeImageToOG = (imageUrl: string): Promise<Blob> => new Promise((resolve, reject) => {
  const img = new Image(); img.crossOrigin = "anonymous"; const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d");
  if (!ctx) { reject(new Error("No canvas context")); return; }
  img.onload = () => { canvas.width = TARGET_WIDTH; canvas.height = TARGET_HEIGHT; const ta = TARGET_WIDTH / TARGET_HEIGHT; const sa = img.width / img.height; let sx = 0, sy = 0, sw = img.width, sh = img.height; if (sa > ta) { sw = img.height * ta; sx = (img.width - sw) / 2; } else { sh = img.width / ta; sy = (img.height - sh) / 2; } ctx.fillStyle = "#FFF"; ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT); ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_WIDTH, TARGET_HEIGHT); canvas.toBlob(b => b ? resolve(b) : reject(new Error("No blob")), "image/jpeg", 0.9); };
  img.onerror = () => reject(new Error("Failed to load")); img.src = imageUrl;
});

const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => new Promise((resolve, reject) => { const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => resolve({ width: img.width, height: img.height }); img.onerror = () => reject(new Error("Failed")); img.src = url; });

export default function BatchImageResizer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [results, setResults] = useState<ResizeResult[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [processedFiles, setProcessedFiles] = useState(0);

  const processAllImages = async () => {
    setIsProcessing(true); setProgress(0); setResults([]); setProcessedFiles(0);
    try {
      const { data: files, error } = await supabase.storage.from("article-images").list("", { limit: 1000 });
      if (error) { toast.error(`Failed: ${error.message}`); setIsProcessing(false); return; }
      const imageFiles = files?.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !f.name.startsWith(".")) || [];
      if (!imageFiles.length) { toast.info("No images found"); setIsProcessing(false); return; }
      setTotalFiles(imageFiles.length); const nr: ResizeResult[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]; setCurrentFile(file.name); setProcessedFiles(i + 1); setProgress(Math.round(((i + 1) / imageFiles.length) * 100));
        try {
          const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(file.name);
          const dim = await getImageDimensions(publicUrl);
          if (dim.width === TARGET_WIDTH && dim.height === TARGET_HEIGHT) { nr.push({ fileName: file.name, status: "skipped", message: "Already 1200×630" }); setResults([...nr]); continue; }
          const blob = await resizeImageToOG(publicUrl);
          await supabase.storage.from("article-images").remove([file.name]);
          await supabase.storage.from("article-images").upload(file.name, blob, { contentType: "image/jpeg", upsert: true });
          nr.push({ fileName: file.name, status: "success", message: `Resized from ${dim.width}×${dim.height}` });
        } catch (err) { nr.push({ fileName: file.name, status: "error", message: err instanceof Error ? err.message : "Unknown" }); }
        setResults([...nr]);
      }
      const sc = nr.filter(r => r.status === "success").length; const sk = nr.filter(r => r.status === "skipped").length; const ec = nr.filter(r => r.status === "error").length;
      toast.success(`Done: ${sc} resized, ${sk} skipped, ${ec} errors`);
    } catch (err) { toast.error(`Failed: ${err instanceof Error ? err.message : "Unknown"}`); } finally { setIsProcessing(false); setCurrentFile(null); }
  };

  const sc = results.filter(r => r.status === "success").length; const sk = results.filter(r => r.status === "skipped").length; const ec = results.filter(r => r.status === "error").length;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground">Batch Image Resizer</h2><p className="text-muted-foreground mt-1">Resize all images to 1200×630 for optimal social media previews.</p></div>
      <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="h-5 w-5" />Resize All Featured Images</CardTitle><CardDescription>Process all images in the article-images bucket. Images already at 1200×630 will be skipped.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={processAllImages} disabled={isProcessing} className="w-full sm:w-auto">{isProcessing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</> : <><RefreshCw className="h-4 w-4 mr-2" />Start Batch Resize</>}</Button>
          {isProcessing && <div className="space-y-2"><div className="flex justify-between text-sm text-muted-foreground"><span>Processing: {currentFile}</span><span>{processedFiles} / {totalFiles}</span></div><Progress value={progress} className="h-2" /></div>}
          {results.length > 0 && <div className="space-y-3"><div className="flex gap-4 text-sm"><span className="text-primary">✓ {sc} resized</span><span className="text-muted-foreground">⊘ {sk} skipped</span>{ec > 0 && <span className="text-destructive">✗ {ec} errors</span>}</div>
            <ScrollArea className="h-64 border rounded-md"><div className="p-3 space-y-1">{results.map((r, i) => <div key={i} className="flex items-center gap-2 text-sm py-1 border-b border-border/50 last:border-0">{r.status === "success" && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}{r.status === "skipped" && <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50 shrink-0" />}{r.status === "error" && <XCircle className="h-4 w-4 text-destructive shrink-0" />}<span className="font-mono text-xs truncate flex-1">{r.fileName}</span><span className="text-muted-foreground text-xs shrink-0">{r.message}</span></div>)}</div></ScrollArea>
          </div>}
        </CardContent>
      </Card>
    </div>
  );
}