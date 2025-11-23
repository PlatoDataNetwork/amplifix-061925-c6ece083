import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

export const AddVseeHealthShowcase = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { toast } = useToast();

  const checkIfExists = async () => {
    const { data } = await supabase
      .from("showcase_companies")
      .select("id")
      .eq("company_name", "VSee Health")
      .single();
    
    if (data) {
      setIsAdded(true);
    }
  };

  useEffect(() => {
    checkIfExists();
  }, []);

  const addVseeHealth = async () => {
    setIsAdding(true);
    try {
      const { error } = await supabase
        .from("showcase_companies")
        .insert({
          company_name: "VSee Health",
          ticker: "VSEE",
          subtitle: "Global Leader in Telehealth Solutions",
          description: "VSee Health is a global leader in telehealth solutions, providing secure video consultation platforms, remote patient monitoring, and integrated care management systems used by healthcare providers in over 100 countries.",
          tags: ["Telehealth", "Digital Health", "Remote Patient Monitoring", "Healthcare Technology", "SaaS"],
          button_text: "View Showcase",
          link: "/showcase/vsee-health",
          website: "https://vseehealth.com/",
          stock_url: "https://www.tradingview.com/symbols/NASDAQ-VSEE/",
          search_url: "https://www.google.com/search?q=VSee+Health+NASDAQ+VSEE",
          thumbnail: "/lovable-uploads/forex-gpt-thumbnail.png",
          type: "stock",
          display_order: 12,
          disabled: false
        });

      if (error) throw error;

      setIsAdded(true);
      toast({
        title: "Success!",
        description: "VSee Health has been added to the showcase companies.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add VSee Health",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isAdded) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            VSee Health Added
          </CardTitle>
          <CardDescription>
            VSee Health is now visible on the Showcase page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add VSee Health to Showcase</CardTitle>
        <CardDescription>
          Click the button below to add VSee Health to the showcase companies database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={addVseeHealth}
          disabled={isAdding}
          className="w-full"
        >
          {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isAdding ? "Adding..." : "Add VSee Health to Showcase"}
        </Button>
      </CardContent>
    </Card>
  );
};
