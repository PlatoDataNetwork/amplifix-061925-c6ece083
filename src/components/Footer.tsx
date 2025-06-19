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
                  src="/lovable-uploads/cefeeb41-88d4-410c-bb83-323d0bf2c3e1.png" 
                  alt="AmplifiX Logo" 
                  className="w-8 h-8"
                />
              </div>
              <h2 className="text-xl font-bold">AmplifiX</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              AI-powered investor relations and public relations platform for modern companies.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Linkedin size={20} />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Mail size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary">Dashboard</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Public Companies</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Private Companies</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">IPO Preparation</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Fundraising</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">hello@amplifix.ai</li>
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
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm">Privacy Policy</Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm">Terms of Service</Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm">Data Processing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
