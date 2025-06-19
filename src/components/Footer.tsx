
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
                  alt="AmplifiX Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">
                AmplifiX
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              AI-powered investor relations and public relations platform for modern companies.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors">
                <Mail size={20} />
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">Home</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">Dashboard</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">Features</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">Public Companies</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">Private Companies</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">IPO Preparation</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-highlight-blue transition-colors text-sm sm:text-base">Fundraising</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Company</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm sm:text-base">hello@amplifi.ai</li>
              <li className="text-muted-foreground text-sm sm:text-base">+1 (555) 123-4567</li>
            </ul>
            <div className="flex items-center mt-4 p-3 bg-background rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">AI Systems Online</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-xs sm:text-sm">&copy; {new Date().getFullYear()} AmplifiX. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-xs sm:text-sm">Privacy Policy</Link>
            <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-xs sm:text-sm">Terms of Service</Link>
            <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-xs sm:text-sm">Data Processing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
