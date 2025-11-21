import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages, RefreshCw, ExternalLink } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import { Link } from "react-router-dom";

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'da', name: 'Danish (Dansk)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'et', name: 'Estonian (Eesti)' },
  { code: 'fi', name: 'Finnish (Suomi)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'he', name: 'Hebrew (עברית)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'hu', name: 'Hungarian (Magyar)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ro', name: 'Romanian (Română)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
];

export default function TranslationTest() {
  const { t, i18n } = useTranslation(['common', 'home']);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    await i18n.changeLanguage(langCode);
  };

  const refreshTranslations = () => {
    i18n.reloadResources();
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-6 w-6" />
                  Translation Test Viewer
                </CardTitle>
                <CardDescription>
                  View and test translations in different languages
                </CardDescription>
              </div>
              <Button onClick={refreshTranslations} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Language</label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Common Translations Preview */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Common Translations (common.json)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Navigation</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <span className="text-xs text-muted-foreground">About:</span>
                      <p className="font-medium">{t('common:nav.about')}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <span className="text-xs text-muted-foreground">Solutions:</span>
                      <p className="font-medium">{t('common:nav.solutions')}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <span className="text-xs text-muted-foreground">Showcase:</span>
                      <p className="font-medium">{t('common:nav.showcase')}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <span className="text-xs text-muted-foreground">Contact:</span>
                      <p className="font-medium">{t('common:nav.contact')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Buttons</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <span className="text-xs text-muted-foreground">Book Demo:</span>
                      <p className="font-medium">{t('common:buttons.bookDemo')}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <span className="text-xs text-muted-foreground">Learn More:</span>
                      <p className="font-medium">{t('common:buttons.learnMore')}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <span className="text-xs text-muted-foreground">Contact Us:</span>
                      <p className="font-medium">{t('common:buttons.contactUs')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Footer</h3>
                  <div className="p-3 bg-muted rounded space-y-1 text-sm">
                    <p><strong>Status:</strong> {t('common:footer.statusOnline')}</p>
                    <p><strong>Copyright:</strong> {t('common:footer.copyright', { year: new Date().getFullYear() })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Home Translations Preview */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Home Translations (home.json)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Hero Section</h3>
                  <div className="p-4 bg-muted rounded space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Badge:</span>
                      <p className="font-medium text-primary">{t('home:hero.badge')}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Title:</span>
                      <h2 className="text-2xl font-bold">{t('home:hero.title')}</h2>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Description:</span>
                      <p className="text-sm">{t('home:hero.description')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">About Section</h3>
                  <div className="p-4 bg-muted rounded space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Title:</span>
                      <h3 className="text-xl font-bold">{t('home:about.title')}</h3>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Description:</span>
                      <p className="text-sm">{t('home:about.description')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted rounded">
                      <p className="font-semibold text-sm">{t('home:features.smartAnalytics.title')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('home:features.smartAnalytics.description')}</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="font-semibold text-sm">{t('home:features.aiContent.title')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('home:features.aiContent.description')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">FAQ Section</h3>
                  <div className="p-4 bg-muted rounded space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Title:</span>
                      <h3 className="text-lg font-bold">{t('home:faq.title')}</h3>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Description:</span>
                      <p className="text-sm">{t('home:faq.description')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test on Actual Pages */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Test on Actual Pages</CardTitle>
                <CardDescription>View translations on real site pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <Button asChild variant="outline" className="justify-start">
                    <Link to={`/${selectedLanguage}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Home Page
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to={`/${selectedLanguage}/about`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      About Page
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to={`/${selectedLanguage}/solutions`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Solutions Page
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to={`/${selectedLanguage}/showcase`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Showcase Page
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to={`/${selectedLanguage}/faq`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      FAQ Page
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to={`/${selectedLanguage}/contact`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Contact Page
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Language Info */}
            <div className="text-xs text-muted-foreground text-center">
              Current Language: <strong>{i18n.language}</strong> | 
              Direction: <strong>{document.documentElement.getAttribute('dir') || 'ltr'}</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}