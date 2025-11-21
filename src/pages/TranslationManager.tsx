import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2, Clock, Eye, Languages, Loader2, XCircle, Check, ChevronsUpDown } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'zh', name: 'Chinese' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'km', name: 'Khmer' },
  { code: 'ko', name: 'Korean' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' }
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
  const [open, setOpen] = useState(false);
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
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Languages</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={isTranslating}
                    >
                      {selectedLanguages.length === 0
                        ? "Select languages..."
                        : `${selectedLanguages.length} language${selectedLanguages.length > 1 ? 's' : ''} selected`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }} align="start">
                    <Command>
                      <CommandInput placeholder="Search languages..." />
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <CommandItem
                            key={lang.code}
                            onSelect={() => {
                              setSelectedLanguages((prev) =>
                                prev.includes(lang.code)
                                  ? prev.filter((code) => code !== lang.code)
                                  : [...prev, lang.code]
                              );
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedLanguages.includes(lang.code) ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {lang.name} ({lang.code})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {selectedLanguages.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedLanguages.map((code) => {
                      const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
                      return (
                        <Badge key={code} variant="secondary" className="text-xs">
                          {lang?.name} ({code})
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              <Button
                onClick={() => translateSelectedLanguages(selectedLanguages)}
                disabled={isTranslating || selectedLanguages.length === 0}
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
                    Translate Selected ({selectedLanguages.length})
                  </>
                )}
              </Button>

              <Button
                onClick={() => translateSelectedLanguages(SUPPORTED_LANGUAGES.map(l => l.code))}
                disabled={isTranslating}
                size="lg"
                variant="secondary"
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
                    Generate All {SUPPORTED_LANGUAGES.length} Languages
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
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      Currently translating: <strong className="uppercase">{currentLang}</strong>
                    </span>
                  </div>
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
