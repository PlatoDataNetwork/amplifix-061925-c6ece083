
import { Link } from "react-router-dom";
import { Shield, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#121218] border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h2 className="text-xl font-bold">MoltenArc</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Redefining Digital Privacy with blockchain-secured communications.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">
                <Github size={20} />
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-[#8A3FFC]">Home</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-[#8A3FFC]">Dashboard</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">About</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">Features</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">Documentation</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">API</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-[#8A3FFC]">Support</Link></li>
            </ul>
          </div>
          
          {/* Contact & Security */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">hello@moltenarc.com</li>
              <li className="text-gray-400">+1 (555) 123-4567</li>
            </ul>
            <div className="flex items-center mt-4 p-3 bg-[#0A0A0A] rounded-lg border border-gray-800">
              <Shield className="text-[#8A3FFC] mr-2 h-5 w-5" />
              <span className="text-sm">End-to-end Encrypted & Secure</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} MoltenArc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-[#8A3FFC] text-sm">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-[#8A3FFC] text-sm">Terms of Service</Link>
            <Link to="#" className="text-gray-400 hover:text-[#8A3FFC] text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
