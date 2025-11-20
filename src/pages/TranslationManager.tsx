import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Languages, Loader2 } from "lucide-react";
import MainHeader from "@/components/MainHeader";

const SUPPORTED_LANGUAGES = [
  'ar', 'bn', 'zh', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'he', 'hi', 'hu', 
  'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sl', 
  'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'
];

const FILES_TO_TRANSLATE = ['common.json', 'home.json'];

export default function TranslationManager() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLang, setCurrentLang] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const downloadTranslation = (content: any, language: string, fileName: string) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${language}-${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const translateAllLanguages = async () => {
    setIsTranslating(true);
    setProgress(0);
    setLogs([]);
    addLog('Starting translation process...');

    try {
      // Load English source files
      const commonResponse = await fetch('/locales/en/common.json');
      const homeResponse = await fetch('/locales/en/home.json');
      
      const commonContent = await commonResponse.json();
      const homeContent = await homeResponse.json();

      const totalTasks = SUPPORTED_LANGUAGES.length * FILES_TO_TRANSLATE.length;
      let completedTasks = 0;

      for (const language of SUPPORTED_LANGUAGES) {
        setCurrentLang(language);
        addLog(`Translating to ${language.toUpperCase()}...`);

        // Translate common.json
        try {
          const { data: commonData, error: commonError } = await supabase.functions.invoke('translate-locales', {
            body: {
              englishContent: commonContent,
              targetLanguage: language,
              fileName: 'common.json'
            }
          });

          if (commonError) throw commonError;
          
          if (commonData?.translatedContent) {
            downloadTranslation(commonData.translatedContent, language, 'common.json');
            addLog(`✓ ${language}/common.json completed`);
          }

          completedTasks++;
          setProgress((completedTasks / totalTasks) * 100);
        } catch (error) {
          addLog(`✗ Error translating ${language}/common.json: ${error}`);
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));

        // Translate home.json
        try {
          const { data: homeData, error: homeError } = await supabase.functions.invoke('translate-locales', {
            body: {
              englishContent: homeContent,
              targetLanguage: language,
              fileName: 'home.json'
            }
          });

          if (homeError) throw homeError;
          
          if (homeData?.translatedContent) {
            downloadTranslation(homeData.translatedContent, language, 'home.json');
            addLog(`✓ ${language}/home.json completed`);
          }

          completedTasks++;
          setProgress((completedTasks / totalTasks) * 100);
        } catch (error) {
          addLog(`✗ Error translating ${language}/home.json: ${error}`);
        }

        // Delay between languages
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Translation Complete",
        description: `Generated translations for ${SUPPORTED_LANGUAGES.length} languages. Check downloads folder.`,
      });
      addLog('✓ All translations completed!');

    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Error",
        description: error instanceof Error ? error.message : "Failed to generate translations",
        variant: "destructive",
      });
      addLog(`✗ Fatal error: ${error}`);
    } finally {
      setIsTranslating(false);
      setCurrentLang('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-6 w-6" />
              Translation Manager
            </CardTitle>
            <CardDescription>
              Auto-generate translations for all 34 supported languages using AI
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will translate common.json and home.json for all languages using Lovable AI.
                Translations will be downloaded as individual files that you can then upload to /public/locales/[lang]/.
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Languages:</span>
                <span className="text-muted-foreground">{SUPPORTED_LANGUAGES.length} languages</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Files per language:</span>
                <span className="text-muted-foreground">{FILES_TO_TRANSLATE.join(', ')}</span>
              </div>
            </div>

            <Button
              onClick={translateAllLanguages}
              disabled={isTranslating}
              size="lg"
              className="w-full"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating {currentLang.toUpperCase()}...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate All Translations
                </>
              )}
            </Button>

            {isTranslating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {logs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Translation Log</h3>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('✗') ? 'text-destructive' : log.includes('✓') ? 'text-green-500' : ''}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
