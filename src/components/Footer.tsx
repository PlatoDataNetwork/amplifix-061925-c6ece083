
import { useLocation } from "react-router-dom";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
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
              <h2 className="text-xl font-bold">AmplifiX</h2>
            </div>
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
            <h3 className="text-lg font-medium mb-4">{t('footer.platform')}</h3>
            <ul className="space-y-2">
              <li><LanguageAwareLink to="/intel" className="text-muted-foreground hover:text-highlight-blue">Market Intelligence</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/analytics" className="text-muted-foreground hover:text-highlight-blue">Research & Analytics</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/syndication" className="text-muted-foreground hover:text-highlight-blue">Syndication / IR / PR</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/development" className="text-muted-foreground hover:text-highlight-blue">Blockchain / Web3</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/development" className="text-muted-foreground hover:text-highlight-blue">Influencer Marketing</LanguageAwareLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">{t('footer.solutions')}</h3>
            <ul className="space-y-2">
              <li><LanguageAwareLink to="/solutions/advisory" className="text-muted-foreground hover:text-highlight-blue">Advisory</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/development" className="text-muted-foreground hover:text-highlight-blue">Development</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/ir-pr" className="text-muted-foreground hover:text-highlight-blue">Investor Relations</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/public-companies" className="text-muted-foreground hover:text-highlight-blue">{t('footer.publicCompanies')}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/private-companies" className="text-muted-foreground hover:text-highlight-blue">{t('footer.privateCompanies')}</LanguageAwareLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><LanguageAwareLink to="/about" className="text-muted-foreground hover:text-highlight-blue">{t('nav.about')}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/showcase" className="text-muted-foreground hover:text-highlight-blue">{t('nav.showcase')}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/faq" className="text-muted-foreground hover:text-highlight-blue">{t('nav.faq')}</LanguageAwareLink></li>
              <li className="text-muted-foreground">support@amplifix.net</li>
            </ul>
            <div className="flex items-center mt-4 p-3 bg-background rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
              <span className="text-sm">{t('footer.statusOnline')}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <LanguageAwareLink to="/privacy-policy" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.privacyPolicy')}</LanguageAwareLink>
            <LanguageAwareLink to="/compliance" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.compliance')}</LanguageAwareLink>
            <LanguageAwareLink to="/terms-of-service" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.termsOfService')}</LanguageAwareLink>
            <LanguageAwareLink to="/data-processing" className="text-muted-foreground hover:text-highlight-blue text-sm">{t('footer.dataProcessing')}</LanguageAwareLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
