
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">MoltenArc</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-secondary transition-colors">Features</Link>
          <Link to="/" className="hover:text-secondary transition-colors">Security</Link>
          <Link to="/" className="hover:text-secondary transition-colors">Pricing</Link>
          <Link to="/" className="hover:text-secondary transition-colors">Testimonials</Link>
          <Link to="/dashboard">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Try MoltenArc
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-gradient-to-r from-[#9b87f5] to-secondary bg-clip-text text-transparent">
              <div className="bg-[#2A2F3C] rounded-full px-6 py-2 mb-8 inline-flex items-center">
                Military-Grade Encrypted Communications
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              AI-Enhanced <br />
              Secure Messaging <br />
              & Communications
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              MoltenArc combines military-grade encryption with intuitive design to deliver
              secure communications, helping you protect your privacy in an increasingly
              vulnerable digital landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-600 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                View Demo
              </Button>
            </div>
          </div>
          <div className="bg-[#252A38] p-6 rounded-2xl shadow-lg border border-gray-700">
            <div className="bg-[#1E2230] rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span>Message Encryption Status</span>
                </div>
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  Secure
                </div>
              </div>
              <div className="h-[300px] bg-[#1A1F2C] rounded-lg p-4 mb-4">
                <div className="h-full w-full rounded-lg bg-gradient-to-br from-[#2A2F3C] to-[#1A1F2C] relative overflow-hidden">
                  <div className="absolute w-full h-full">
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M0,100 Q100,50 200,100 T400,100" 
                        fill="none" 
                        stroke="#9b87f5" 
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                  <div className="absolute w-2 h-2 bg-secondary rounded-full" style={{ left: "30%", top: "60%" }}></div>
                  <div className="absolute w-3 h-3 bg-[#9b87f5] rounded-full" style={{ left: "70%", top: "40%" }}></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Encryption</div>
                  <div className="font-mono font-medium">AES-256</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Protocol</div>
                  <div className="font-mono font-medium">E2EE</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Status</div>
                  <div className="font-mono font-medium">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto py-16 border-t border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold text-secondary">256-bit</div>
            <div className="text-gray-400">Military-Grade Encryption</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary">24/7</div>
            <div className="text-gray-400">Secure Server Protection</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary">30+</div>
            <div className="text-gray-400">Security Features</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary">Zero</div>
            <div className="text-gray-400">Data Breaches</div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
