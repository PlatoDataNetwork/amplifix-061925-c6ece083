import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

const correctLogos = [
  {
    company_name: "Micropolis",
    thumbnail: "/lovable-uploads/micropolis-logo.svg"
  },
  {
    company_name: "Karbon-X",
    thumbnail: "/lovable-uploads/aa74295d-6cd4-4d0b-9a60-0904cd93a391.png"
  }
];

export const ShowcaseLogoFixer = () => {
  const [fixing, setFixing] = useState(false);
  const { toast } = useToast();

  const fixLogos = async () => {
    setFixing(true);
    try {
      for (const logo of correctLogos) {
        const { error } = await supabase
          .from("showcase_companies")
          .update({ thumbnail: logo.thumbnail })
          .eq("company_name", logo.company_name);

        if (error) throw error;
      }

      toast({
        title: "Logos fixed successfully",
        description: "Company thumbnails have been updated to use the correct logo files.",
      });
    } catch (error: any) {
      toast({
        title: "Error fixing logos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  return (
    <Card className="mb-4 border-orange-500/20 bg-orange-500/5">
      <CardHeader>
        <CardTitle className="text-orange-500 flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Fix Showcase Logos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will update the logos for Micropolis and Karbon-X to use the correct files from their showcase pages.
        </p>
        <Button onClick={fixLogos} disabled={fixing} variant="outline">
          {fixing ? "Fixing..." : "Fix Logos Now"}
        </Button>
      </CardContent>
    </Card>
  );
};
