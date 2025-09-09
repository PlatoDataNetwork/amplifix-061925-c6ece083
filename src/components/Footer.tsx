
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { CommonData } from "@/types/common";
import { Skeleton } from "@/components/ui/skeleton";

const Footer = () => {
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
                {isLoading ? <Skeleton className="h-6 w-24" /> : commonData?.branding.name || 'AmplifiX'}
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {isLoading ? <Skeleton className="h-4 w-full" /> : commonData?.branding.description || 'AI-powered investor relations and public relations platform for modern companies.'}
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-highlight-blue">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-highlight-blue">
                <Linkedin size={20} />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-highlight-blue">
                <Mail size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {isLoading ? <Skeleton className="h-5 w-20" /> : commonData?.footer.sections.platform.title || 'Platform'}
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <li key={i}><Skeleton className="h-4 w-24" /></li>
                ))
              ) : commonData ? (
                commonData.footer.sections.platform.links.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.label === 'Home' ? '/' : link.label === 'Pricing' ? '/pricing' : link.label === 'FAQ' ? '/faq' : '#'} 
                      className="text-muted-foreground hover:text-highlight-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/" className="text-muted-foreground hover:text-highlight-blue">Home</Link></li>
                  <li><Link to="/pricing" className="text-muted-foreground hover:text-highlight-blue">Pricing</Link></li>
                  <li><Link to="/faq" className="text-muted-foreground hover:text-highlight-blue">FAQ</Link></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {isLoading ? <Skeleton className="h-5 w-20" /> : commonData?.footer.sections.solutions.title || 'Solutions'}
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <li key={i}><Skeleton className="h-4 w-32" /></li>
                ))
              ) : commonData ? (
                commonData.footer.sections.solutions.links.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.label === 'Public Companies' ? '/solutions/public-companies' : link.label === 'Private Companies' ? '/solutions/private-companies' : link.label === 'IPO Preparation' ? '/solutions/ipo-preparation' : link.label === 'Fundraising' ? '/solutions/fundraising' : '#'} 
                      className="text-muted-foreground hover:text-highlight-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/solutions/public-companies" className="text-muted-foreground hover:text-highlight-blue">Public Companies</Link></li>
                  <li><Link to="/solutions/private-companies" className="text-muted-foreground hover:text-highlight-blue">Private Companies</Link></li>
                  <li><Link to="/solutions/ipo-preparation" className="text-muted-foreground hover:text-highlight-blue">IPO Preparation</Link></li>
                  <li><Link to="/solutions/fundraising" className="text-muted-foreground hover:text-highlight-blue">Fundraising</Link></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {isLoading ? <Skeleton className="h-5 w-20" /> : commonData?.footer.sections.company.title || 'Company'}
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                <>
                  <li><Skeleton className="h-4 w-32" /></li>
                  <li><Skeleton className="h-4 w-28" /></li>
                </>
              ) : (
                <>
                  <li className="text-muted-foreground">{commonData?.footer.sections.company.contact.email || 'hello@amplifi.ai'}</li>
                  <li className="text-muted-foreground">{commonData?.footer.sections.company.contact.phone || '+1 (555) 123-4567'}</li>
                </>
              )}
            </ul>
            <div className="flex items-center mt-4 p-3 bg-background rounded-lg border border-border">
              <div className={`w-2 h-2 rounded-full mr-2 ${commonData?.footer.sections.company.status.indicator === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-sm">
                {isLoading ? <Skeleton className="h-4 w-24" /> : commonData?.footer.sections.company.status.text || 'AI Systems Online'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              commonData?.footer.copyright.replace('{year}', new Date().getFullYear().toString()) || `© ${new Date().getFullYear()} AmplifiX. All rights reserved.`
            )}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))
            ) : commonData ? (
              commonData.footer.legal_links.map((link, index) => (
                <Link key={index} to="#" className="text-muted-foreground hover:text-highlight-blue text-sm">
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-sm">Privacy Policy</Link>
                <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-sm">Terms of Service</Link>
                <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-sm">Data Processing</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
