
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const Footer = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAdminCheck();

  const handleLogoClick = () => {
    if (isAdmin) {
      navigate('/admin');
    }
  };

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className={`w-10 h-10 flex items-center justify-center ${isAdmin ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                onClick={handleLogoClick}
              >
                <img 
                  src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
                  alt="AmplifiX Logo" 
                  className="w-8 h-8"
                />
              </div>
              <h2 className="text-xl font-bold">AmplifiX</h2>
            </div>
            <div className="flex space-x-4 mb-4">
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
            <div className="text-sm text-muted-foreground mb-3">
              <a href="mailto:support@amplifix.net" className="hover:text-highlight-blue">support@amplifix.net</a>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              <p>144 E 44th St</p>
              <p>New York NY 10017</p>
            </div>
            <div className="flex items-center p-3 bg-background rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
              <span className="text-sm translate">{t("footer.statusOnline")}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 translate">{t("footer.platform")}</h3>
            <ul className="space-y-2">
              <li><LanguageAwareLink to="/solutions/analytics" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.dataAnalytics")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/video-distribution" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.videoDistribution")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/blockchain" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.blockchainWeb3")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/intel" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.marketIntelligence")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/syndication" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.syndicationIrPr")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/influencer-marketing" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.influencerMarketing")}</LanguageAwareLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 translate">{t("footer.solutions")}</h3>
            <ul className="space-y-2">
              <li><LanguageAwareLink to="/solutions/advisory" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.advisory")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/research" className="text-muted-foreground hover:text-highlight-blue translate">{t("nav.research")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/development" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.development")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/ir-pr" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.investorRelations")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/public-companies" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.publicCompanies")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/solutions/private-companies" className="text-muted-foreground hover:text-highlight-blue translate">{t("footer.privateCompanies")}</LanguageAwareLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 translate">{t("footer.company")}</h3>
            <ul className="space-y-2">
              <li><LanguageAwareLink to="/about" className="text-muted-foreground hover:text-highlight-blue translate">{t("nav.about")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/about#mission" className="text-muted-foreground hover:text-highlight-blue translate">{t("nav.mission")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/about#process" className="text-muted-foreground hover:text-highlight-blue translate">{t("nav.process")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/showcase" className="text-muted-foreground hover:text-highlight-blue translate">{t("nav.showcase")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/contact" className="text-muted-foreground hover:text-highlight-blue translate">{t("nav.contact")}</LanguageAwareLink></li>
              <li><LanguageAwareLink to="/admin" className="text-muted-foreground hover:text-highlight-blue notranslate">Admin</LanguageAwareLink></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm translate">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <LanguageAwareLink to="/privacy-policy" className="text-muted-foreground hover:text-highlight-blue text-sm translate">{t("footer.privacyPolicy")}</LanguageAwareLink>
            <LanguageAwareLink to="/compliance" className="text-muted-foreground hover:text-highlight-blue text-sm translate">{t("footer.compliance")}</LanguageAwareLink>
            <LanguageAwareLink to="/terms-of-service" className="text-muted-foreground hover:text-highlight-blue text-sm translate">{t("footer.termsOfService")}</LanguageAwareLink>
            <LanguageAwareLink to="/faq" className="text-muted-foreground hover:text-highlight-blue text-sm translate">{t("nav.faq")}</LanguageAwareLink>
            <LanguageAwareLink to="/data-processing" className="text-muted-foreground hover:text-highlight-blue text-sm translate">{t("footer.dataProcessing")}</LanguageAwareLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
