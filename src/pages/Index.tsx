
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold">MoltenArc</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-[#7C3AED] transition-colors">About</Link>
          <Link to="/" className="hover:text-[#7C3AED] transition-colors">Features</Link>
          <Link to="/" className="hover:text-[#7C3AED] transition-colors">Security</Link>
          <Link to="/" className="hover:text-[#7C3AED] transition-colors">Pricing</Link>
          <Link to="/" className="hover:text-[#7C3AED] transition-colors">Contact</Link>
          <Button variant="ghost" className="hover:text-[#7C3AED] transition-colors">
            Sign In
          </Button>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-90 transition-opacity rounded-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-8">
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent rounded-full px-6 py-2 border border-[#7C3AED]/20 bg-[#7C3AED]/5">
              Blockchain-Secured Communication
            </div>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Redefining Digital <br />
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
              Privacy
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            MoltenArc combines the power of blockchain encryption with familiar 
            interfaces to deliver secure and private communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-90 transition-opacity px-8 py-4 text-lg rounded-lg">
                Get Started Free →
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-white/10 transition-colors px-8 py-4 text-lg rounded-lg">
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="container mx-auto py-16">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
            <span className="ml-4 text-gray-400 text-sm">MoltenArc Dashboard</span>
          </div>
          <div className="bg-[#0A0A0A] rounded-xl p-6 min-h-[400px] relative overflow-hidden">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="h-3 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] rounded"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]"></div>
                <div className="flex-1 h-3 bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#06B6D4]"></div>
                <div className="flex-1 h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 w-32 h-32 bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto py-16 border-t border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">256-bit</div>
            <div className="text-gray-400">Blockchain Encryption</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">24/7</div>
            <div className="text-gray-400">Secure Server Protection</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">30+</div>
            <div className="text-gray-400">Security Features</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Zero</div>
            <div className="text-gray-400">Data Breaches</div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
