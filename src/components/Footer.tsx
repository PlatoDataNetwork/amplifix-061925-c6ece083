
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
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
                AmplifiX
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              AI-powered investor relations and public relations platform for modern companies.
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
            <h3 className="text-lg font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-highlight-blue">Home</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-highlight-blue">Dashboard</Link></li>
              <li><a href="#features" className="text-muted-foreground hover:text-highlight-blue">Features</a></li>
              <li><Link to="/documentation" className="text-muted-foreground hover:text-highlight-blue">Documentation</Link></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-highlight-blue">Pricing</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-highlight-blue">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="/solutions/public-companies" className="text-muted-foreground hover:text-highlight-blue">Public Companies</Link></li>
              <li><Link to="/solutions/private-companies" className="text-muted-foreground hover:text-highlight-blue">Private Companies</Link></li>
              <li><Link to="/solutions/ipo-preparation" className="text-muted-foreground hover:text-highlight-blue">IPO Preparation</Link></li>
              <li><Link to="/solutions/fundraising" className="text-muted-foreground hover:text-highlight-blue">Fundraising</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">hello@amplifi.ai</li>
              <li className="text-muted-foreground">+1 (555) 123-4567</li>
            </ul>
            <div className="flex items-center mt-4 p-3 bg-background rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">AI Systems Online</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} AmplifiX. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-sm">Privacy Policy</Link>
            <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-sm">Terms of Service</Link>
            <Link to="#" className="text-muted-foreground hover:text-highlight-blue text-sm">Data Processing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
