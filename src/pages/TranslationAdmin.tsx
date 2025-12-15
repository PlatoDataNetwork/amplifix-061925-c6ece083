import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Languages, Play, Square, RefreshCw } from 'lucide-react';

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

    const uniqueArticles = new Set(translations?.map(t => t.language_code)).size;

    setStats({
      totalArticles: totalArticles || 0,
      translatedArticles: Object.values(languageStats).reduce((a, b) => a + b, 0),
      languageStats
    });
  };

  const translateAllArticles = async () => {
    setIsTranslating(true);
    
    try {
      const { data: articles, error } = await supabase
        .from('articles')
        .select('id')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const totalOperations = articles.length * SUPPORTED_LANGUAGES.length;
      setProgress({ current: 0, total: totalOperations, language: '' });

      let completed = 0;

      for (const lang of SUPPORTED_LANGUAGES) {
        setProgress(p => ({ ...p, language: LANGUAGE_NAMES[lang] }));
        
        for (const article of articles) {
          // Check if translation exists
          const { data: existing } = await supabase
            .from('article_translations')
            .select('id')
            .eq('article_id', article.id)
            .eq('language_code', lang)
            .single();

          if (!existing) {
            try {
              const { error: fnError } = await supabase.functions.invoke('translate-article', {
                body: { articleId: article.id, targetLanguage: lang }
              });
              
              if (fnError) {
                console.error(`Translation error for ${article.id} to ${lang}:`, fnError);
              }
            } catch (e) {
              console.error(`Failed to translate ${article.id} to ${lang}:`, e);
            }
            
            // Rate limiting delay
            await new Promise(r => setTimeout(r, 500));
          }

          completed++;
          setProgress(p => ({ ...p, current: completed }));
        }
      }

      toast.success('Batch translation completed!');
      fetchStats();
    } catch (error) {
      console.error('Batch translation error:', error);
      toast.error('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  if (adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

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
            <CardTitle>Batch Translation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTranslating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Translating to {progress.language}...</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <Progress value={progressPercent} />
              </div>
            )}
            
            <div className="flex gap-4">
              <Button 
                onClick={translateAllArticles} 
                disabled={isTranslating}
                className="gap-2"
              >
                {isTranslating ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isTranslating ? 'Translating...' : 'Start Batch Translation'}
              </Button>
              
              <Button variant="outline" onClick={fetchStats} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Stats
              </Button>
            </div>
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
                  <div key={lang} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm font-medium">{LANGUAGE_NAMES[lang]}</span>
                    <span className="text-sm text-muted-foreground">{count} ({percent.toFixed(0)}%)</span>
                  </div>
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
