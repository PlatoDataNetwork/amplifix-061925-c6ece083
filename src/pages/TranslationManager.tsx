import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2, Clock, Eye, Languages, Loader2, XCircle } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const SUPPORTED_LANGUAGES = [
  'ar', 'bn', 'zh', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'he', 'hi', 'hu', 
  'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sl', 
  'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'
];

// Only translate data files, not i18next files (common/home handled separately)
const FILES_TO_TRANSLATE = [
  'blog-intel.json',
  'solutions.json',
  'about.json',
  'faq.json',
  'contact.json',
  'showcase.json'
];

interface TranslationStats {
  total: number;
  completed: number;
  success: number;
  failed: number;
  retries: number;
  startTime: number | null;
  estimatedTimeRemaining: number | null;
}

export default function TranslationManager() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLang, setCurrentLang] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [stats, setStats] = useState<TranslationStats>({
    total: 0,
    completed: 0,
    success: 0,
    failed: 0,
    retries: 0,
    startTime: null,
    estimatedTimeRemaining: null,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update estimated time remaining based on progress
  useEffect(() => {
    if (stats.startTime && stats.completed > 0 && stats.completed < stats.total) {
      const elapsed = Date.now() - stats.startTime;
      const avgTimePerTask = elapsed / stats.completed;
      const remaining = stats.total - stats.completed;
      const estimated = Math.round((avgTimePerTask * remaining) / 1000); // in seconds
      
      setStats(prev => ({ ...prev, estimatedTimeRemaining: estimated }));
    }
  }, [stats.completed, stats.total, stats.startTime]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateStats = (updates: Partial<TranslationStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object') {
      const anyErr = error as any;
      if (typeof anyErr.message === 'string') return anyErr.message;
      try {
        return JSON.stringify(anyErr);
      } catch {
        return String(anyErr);
      }
    }
    return String(error);
  };

  // Retry logic with exponential backoff
  const translateWithRetry = async (
    englishContent: any,
    language: string,
    fileName: string,
    maxRetries: number = 3
  ): Promise<any> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke('translate-locales', {
          body: {
            englishContent,
            targetLanguage: language,
            fileName
          }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          addLog(`⟳ Retry ${attempt}/${maxRetries} for ${language}/${fileName} in ${backoffMs/1000}s...`);
          updateStats({ retries: stats.retries + 1 });
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    throw lastError;
  };

  const saveTranslation = async (content: any, language: string, namespace: string) => {
    const { error } = await supabase
      .from('translations')
      .upsert(
        {
          language_code: language,
          namespace: namespace.replace('.json', ''),
          content,
        },
        { onConflict: 'language_code,namespace' }
      );
    
    if (error) {
      console.error(`Error saving ${language}/${namespace}:`, error);
      throw error;
    }
  };

  const translateSingleLanguage = async (language: string) => {
    setIsTranslating(true);
    setProgress(0);
    setLogs([]);
    setStats({
      total: FILES_TO_TRANSLATE.length,
      completed: 0,
      success: 0,
      failed: 0,
      retries: 0,
      startTime: Date.now(),
      estimatedTimeRemaining: null,
    });
    addLog(`Testing translation for ${language.toUpperCase()}...`);

    try {
      // Load all source files
      const fileContents: Record<string, any> = {};
      for (const file of FILES_TO_TRANSLATE) {
        const isLocaleFile = file === 'common.json' || file === 'home.json';
        const path = isLocaleFile ? `/locales/en/${file}` : `/data/${file}`;
        const response = await fetch(path);
        fileContents[file] = await response.json();
      }

      setCurrentLang(language);

      // Translate all files
      for (const fileName of FILES_TO_TRANSLATE) {
        try {
          addLog(`→ Translating ${language}/${fileName}...`);
          
          const data = await translateWithRetry(fileContents[fileName], language, fileName);
          
          if (data?.translatedContent) {
            const namespace = fileName.replace('.json', '');
            await saveTranslation(data.translatedContent, language, namespace);
            addLog(`✓ ${language}/${fileName} saved (${data.duration || '?'}ms)`);
            updateStats({ 
              completed: stats.completed + 1, 
              success: stats.success + 1 
            });
          }

          setProgress((stats.completed / stats.total) * 100);
        } catch (error) {
          const errorMsg = formatErrorMessage(error);
          addLog(`✗ ${language}/${fileName} failed after retries: ${errorMsg}`);
          console.error(`Full error for ${language}/${fileName}:`, error);
          updateStats({ 
            completed: stats.completed + 1, 
            failed: stats.failed + 1 
          });
        }

        // Delay between files
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Test Translation Complete",
        description: `Completed test translation for ${language.toUpperCase()}. Check logs for details.`,
      });
      addLog(`✓ Test translation for ${language.toUpperCase()} completed!`);

    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Error",
        description: error instanceof Error ? error.message : "Failed to generate translation",
        variant: "destructive",
      });
      addLog(`✗ Fatal error: ${error}`);
    } finally {
      setIsTranslating(false);
      setCurrentLang('');
    }
  };

  const translateSelectedLanguages = async (languages: string[]) => {
    setIsTranslating(true);
    setProgress(0);
    setLogs([]);
    const totalTasks = languages.length * FILES_TO_TRANSLATE.length;
    setStats({
      total: totalTasks,
      completed: 0,
      success: 0,
      failed: 0,
      retries: 0,
      startTime: Date.now(),
      estimatedTimeRemaining: null,
    });
    addLog(`Starting translation for ${languages.length} language(s): ${languages.join(', ').toUpperCase()}...`);

    try {
      // Load all source files
      const fileContents: Record<string, any> = {};
      for (const file of FILES_TO_TRANSLATE) {
        const isLocaleFile = file === 'common.json' || file === 'home.json';
        const path = isLocaleFile ? `/locales/en/${file}` : `/data/${file}`;
        const response = await fetch(path);
        fileContents[file] = await response.json();
      }

      for (const language of languages) {
        setCurrentLang(language);
        addLog(`Translating to ${language.toUpperCase()}...`);

        // Translate all files
        for (const fileName of FILES_TO_TRANSLATE) {
          try {
            addLog(`→ Translating ${language}/${fileName}...`);
            
            const data = await translateWithRetry(fileContents[fileName], language, fileName);
            
            if (data?.translatedContent) {
              const namespace = fileName.replace('.json', '');
              await saveTranslation(data.translatedContent, language, namespace);
              addLog(`✓ ${language}/${fileName} saved (${data.duration || '?'}ms)`);
              updateStats({ 
                completed: stats.completed + 1, 
                success: stats.success + 1 
              });
            } else {
              addLog(`✗ ${language}/${fileName} - no content returned`);
              updateStats({ 
                completed: stats.completed + 1, 
                failed: stats.failed + 1 
              });
            }

            setProgress((stats.completed / stats.total) * 100);
          } catch (error) {
            const errorMsg = formatErrorMessage(error);
            addLog(`✗ ${language}/${fileName} failed after retries: ${errorMsg}`);
            console.error(`Full error for ${language}/${fileName}:`, error);
            updateStats({ 
              completed: stats.completed + 1, 
              failed: stats.failed + 1 
            });
          }

          // Small delay between files
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Delay between languages to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      toast({
        title: "Translation Complete",
        description: `Generated and saved translations for ${languages.length} language(s) to database.`,
      });
      addLog('✓ All translations completed and saved to database!');

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
                This will translate all UI and data files for supported languages using Lovable AI.
                Translations will be automatically saved to the database and served dynamically.
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Languages:</span>
                <span className="text-muted-foreground">{SUPPORTED_LANGUAGES.length} languages</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Files per language:</span>
                <span className="text-muted-foreground">{FILES_TO_TRANSLATE.length} files (UI + Data)</span>
              </div>
            </div>

            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Quick Fix for Missing Translations:</strong> Run Ukrainian (uk), Romanian (ro), and Thai (th) to fix homepage body text translations.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => translateSelectedLanguages(['uk'])}
                  disabled={isTranslating}
                  size="sm"
                  variant="outline"
                >
                  {isTranslating && currentLang === 'uk' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Ukrainian (uk)
                </Button>
                <Button
                  onClick={() => translateSelectedLanguages(['ro'])}
                  disabled={isTranslating}
                  size="sm"
                  variant="outline"
                >
                  {isTranslating && currentLang === 'ro' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Romanian (ro)
                </Button>
                <Button
                  onClick={() => translateSelectedLanguages(['th'])}
                  disabled={isTranslating}
                  size="sm"
                  variant="outline"
                >
                  {isTranslating && currentLang === 'th' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Thai (th)
                </Button>
                <Button
                  onClick={() => translateSelectedLanguages(['uk', 'ro', 'th'])}
                  disabled={isTranslating}
                  size="sm"
                  variant="default"
                >
                  {isTranslating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  All Three
                </Button>
              </div>

              <Button
                onClick={() => translateSelectedLanguages(SUPPORTED_LANGUAGES)}
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
                    <Languages className="mr-2 h-4 w-4" />
                    Generate All 34 Languages
                  </>
                )}
              </Button>

              <Button
                onClick={() => navigate('/admin/translations/test')}
                disabled={isTranslating}
                size="lg"
                variant="secondary"
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Translation Test Page
              </Button>
            </div>

            {isTranslating && (
              <>
                {/* Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-green-500">{stats.success}</p>
                          <p className="text-xs text-muted-foreground">Success</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <div>
                          <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
                          <p className="text-xs text-muted-foreground">Failed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-2xl font-bold text-yellow-500">{stats.retries}</p>
                          <p className="text-xs text-muted-foreground">Retries</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">{formatTime(stats.estimatedTimeRemaining)}</p>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      Progress: {stats.completed} / {stats.total} tasks
                    </span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full h-2" />
                </div>

                {/* Current Language */}
                {currentLang && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Currently translating: <strong className="uppercase">{currentLang}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </>
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
