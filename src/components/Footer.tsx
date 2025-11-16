
import { useLocation } from "react-router-dom";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { CommonData } from "@/types/common";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { data: commonData, isLoading, error } = useJsonData<CommonData>('common.json');
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
                  alt="AmplifiX Logo" 
                  className="w-8 h-8"
                />
              </div>
            <h2 className="text-xl font-bold">
                {isLoading ? <Skeleton className="h-6 w-24" /> : commonData?.common.branding_name || 'AmplifiX'}
              </h2>
            </div>
            {commonData?.common.branding_description && (
              <p className="text-muted-foreground mb-4">
                {isLoading ? <Skeleton className="h-4 w-full" /> : commonData.common.branding_description}
              </p>
            )}
            <div className="flex space-x-4">
              <LanguageAwareLink to="#" className="text-muted-foreground hover:text-highlight-blue" title="X (Twitter)">
                <Twitter size={20} />
              </LanguageAwareLink>
              <LanguageAwareLink to="#" className="text-muted-foreground hover:text-highlight-blue" title="LinkedIn">
                <Linkedin size={20} />
              </LanguageAwareLink>
              <LanguageAwareLink to="#" className="text-muted-foreground hover:text-highlight-blue" title="Medium">
                <ExternalLink size={20} />
              </LanguageAwareLink>
              <LanguageAwareLink to="/contact" className="text-muted-foreground hover:text-highlight-blue" title="Email">
                <Mail size={20} />
              </LanguageAwareLink>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {isLoading ? <Skeleton className="h-5 w-20" /> : t('footer.platform')}
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <li key={i}><Skeleton className="h-4 w-24" /></li>
                ))
              ) : (
                <>
                  <li><LanguageAwareLink to="/" className="text-muted-foreground hover:text-highlight-blue">{t('footer.home')}</LanguageAwareLink></li>
                  <li><LanguageAwareLink to="/showcase" className="text-muted-foreground hover:text-highlight-blue">{t('nav.showcase')}</LanguageAwareLink></li>
                  <li><LanguageAwareLink to="/faq" className="text-muted-foreground hover:text-highlight-blue">{t('nav.faq')}</LanguageAwareLink></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {isLoading ? <Skeleton className="h-5 w-20" /> : t('footer.solutions')}
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <li key={i}><Skeleton className="h-4 w-32" /></li>
                ))
              ) : (
                <>
                  <li><LanguageAwareLink to="/solutions/public-companies" className="text-muted-foreground hover:text-highlight-blue">{t('footer.publicCompanies')}</LanguageAwareLink></li>
                  <li><LanguageAwareLink to="/solutions/private-companies" className="text-muted-foreground hover:text-highlight-blue">{t('footer.privateCompanies')}</LanguageAwareLink></li>
                  <li><LanguageAwareLink to="/solutions/ipo-preparation" className="text-muted-foreground hover:text-highlight-blue">{t('footer.ipoPreparation')}</LanguageAwareLink></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {isLoading ? <Skeleton className="h-5 w-20" /> : t('footer.company')}
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                <>
                  <li><Skeleton className="h-4 w-32" /></li>
                  <li><Skeleton className="h-4 w-28" /></li>
                </>
              ) : (
                <>
                  <li className="text-muted-foreground">{commonData?.common.footer_email || 'support@amplifix.net'}</li>
                </>
              )}
            </ul>
            <div className="flex items-center mt-4 p-3 bg-background rounded-lg border border-border">
              <div className={`w-2 h-2 rounded-full mr-2 ${commonData?.common.footer_status_indicator === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-sm">
                {isLoading ? <Skeleton className="h-4 w-24" /> : t('footer.statusOnline')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              t('footer.copyright', { year: new Date().getFullYear() })
            )}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))
            ) : (
              <>
                <LanguageAwareLink to="/privacy-policy" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.privacyPolicy')}</LanguageAwareLink>
                <LanguageAwareLink to="/compliance" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.compliance')}</LanguageAwareLink>
                <LanguageAwareLink to="/terms-of-service" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.termsOfService')}</LanguageAwareLink>
                <LanguageAwareLink to="/data-processing" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.dataProcessing')}</LanguageAwareLink>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
