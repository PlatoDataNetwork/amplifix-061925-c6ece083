import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Languages, Play, Square, RefreshCw, Zap } from 'lucide-react';

const SUPPORTED_LANGUAGES = ['ar', 'bn', 'zh', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sl', 'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'];

const LANGUAGE_NAMES: Record<string, string> = {
  ar: 'Arabic', bn: 'Bengali', zh: 'Chinese', da: 'Danish', nl: 'Dutch',
  et: 'Estonian', fi: 'Finnish', fr: 'French', de: 'German', el: 'Greek',
  he: 'Hebrew', hi: 'Hindi', hu: 'Hungarian', id: 'Indonesian', it: 'Italian',
  ja: 'Japanese', km: 'Khmer', ko: 'Korean', no: 'Norwegian', fa: 'Persian',
  pl: 'Polish', pt: 'Portuguese', pa: 'Punjabi', ro: 'Romanian', ru: 'Russian',
  sl: 'Slovenian', es: 'Spanish', sv: 'Swedish', th: 'Thai', tr: 'Turkish',
  uk: 'Ukrainian', ur: 'Urdu', vi: 'Vietnamese'
};

export default function TranslationAdmin() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [isTranslating, setIsTranslating] = useState(false);
  const [batchSize, setBatchSize] = useState(50);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0, language: '' });
  const [stats, setStats] = useState({ totalArticles: 0, translatedArticles: 0, languageStats: {} as Record<string, number> });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: totalArticles } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    const { data: translations } = await supabase
      .from('article_translations')
      .select('language_code');

    const languageStats: Record<string, number> = {};
    translations?.forEach(t => {
      languageStats[t.language_code] = (languageStats[t.language_code] || 0) + 1;
    });

    setStats({
      totalArticles: totalArticles || 0,
      translatedArticles: Object.values(languageStats).reduce((a, b) => a + b, 0),
      languageStats
    });
  };

  const translateBatch = async () => {
    setIsTranslating(true);
    toast.info(`Starting batch translation (${batchSize} articles, offset ${currentOffset})...`);

    try {
      const { data, error } = await supabase.functions.invoke('batch-translate-articles', {
        body: { 
          limit: batchSize, 
          offset: currentOffset,
          languages: SUPPORTED_LANGUAGES 
        }
      });

      if (error) throw error;

      toast.success(`Batch complete: ${data.results.translated} translated, ${data.results.errors} errors`);
      setCurrentOffset(prev => prev + batchSize);
      fetchStats();
    } catch (error) {
      console.error('Batch translation error:', error);
      toast.error('Batch translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  const translateSingleLanguage = async (lang: string) => {
    setIsTranslating(true);
    toast.info(`Translating to ${LANGUAGE_NAMES[lang]}...`);

    try {
      const { data, error } = await supabase.functions.invoke('batch-translate-articles', {
        body: { 
          limit: batchSize, 
          offset: 0,
          languages: [lang] 
        }
      });

      if (error) throw error;

      toast.success(`${LANGUAGE_NAMES[lang]}: ${data.results.translated} translated`);
      fetchStats();
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  if (adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Languages className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Translation Admin</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalArticles.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.translatedArticles.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{SUPPORTED_LANGUAGES.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fast Batch Translation (5x Parallel)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div>
                <label className="text-sm text-muted-foreground">Batch Size</label>
                <Input 
                  type="number" 
                  value={batchSize} 
                  onChange={e => setBatchSize(Number(e.target.value))}
                  className="w-24"
                  min={10}
                  max={200}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Offset</label>
                <Input 
                  type="number" 
                  value={currentOffset} 
                  onChange={e => setCurrentOffset(Number(e.target.value))}
                  className="w-24"
                  min={0}
                />
              </div>
              <Button 
                onClick={translateBatch} 
                disabled={isTranslating}
                className="gap-2"
              >
                {isTranslating ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isTranslating ? 'Translating...' : 'Translate Batch'}
              </Button>
              <Button variant="outline" onClick={fetchStats} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Processes {batchSize} articles × {SUPPORTED_LANGUAGES.length} languages = {batchSize * SUPPORTED_LANGUAGES.length} translations per batch with 5x parallelism
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translation Coverage by Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
              {SUPPORTED_LANGUAGES.map(lang => {
                const count = stats.languageStats[lang] || 0;
                const percent = stats.totalArticles > 0 ? (count / stats.totalArticles) * 100 : 0;
                return (
                  <button
                    key={lang}
                    onClick={() => !isTranslating && translateSingleLanguage(lang)}
                    disabled={isTranslating}
                    className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-colors text-left disabled:opacity-50"
                  >
                    <span className="text-sm font-medium">{LANGUAGE_NAMES[lang]}</span>
                    <span className="text-sm text-muted-foreground">{count} ({percent.toFixed(0)}%)</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
