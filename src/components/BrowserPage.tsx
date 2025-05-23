
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, RefreshCw, Shield, Lock, Globe } from "lucide-react";
import { useState } from "react";

const BrowserPage = () => {
  const [url, setUrl] = useState("https://platodata.io");

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0A] p-6">
      <div className="bg-[#121218] rounded-lg shadow-lg flex flex-col h-full border border-gray-800">
        {/* Browser Header */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Secure Browser</h2>
                <div className="text-xs text-gray-400">Browse securely with end-to-end encryption</div>
              </div>
            </div>
          </div>
          
          {/* Browser Controls */}
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" className="text-gray-400">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {/* URL Bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0A0A0A] rounded-md px-3 py-2 flex-1 border border-gray-800">
              <Shield className="h-4 w-4 text-green-500" />
              <Lock className="h-4 w-4 text-green-500" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-transparent border-none p-0 text-white focus:ring-0"
                placeholder="Enter secure URL..."
              />
            </div>
            <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] hover:opacity-90 text-white">
              Go
            </Button>
          </div>
        </div>
        
        {/* Browser Content - Plato Data Wireframe */}
        <div className="flex-1 overflow-y-auto bg-[#0F1629] p-6">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-black font-bold text-sm">P</span>
                </div>
                <span className="text-white font-bold text-xl">PLATO</span>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center ml-1">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
                <span className="text-white font-bold text-xl">AI</span>
              </div>
            </div>
            
            <nav className="flex items-center gap-8">
              <a href="#" className="text-gray-300 hover:text-white">About</a>
              <a href="#" className="text-gray-300 hover:text-white">Solutions</a>
              <a href="#" className="text-gray-300 hover:text-white">Protocol</a>
              <a href="#" className="text-gray-300 hover:text-white">Agents</a>
              <a href="#" className="text-gray-300 hover:text-white">Resources</a>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                Staking
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                Token
              </Button>
            </nav>
          </div>
          
          {/* Hero Section */}
          <div className="text-center py-16">
            <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm mb-8">
              PLATO AI
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Secure network protocol<br />
              for the next web
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Plato AI is building the infrastructure for secure, decentralized AI networks 
              that prioritize privacy and user control over data.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-8 py-16">
            <div className="bg-[#1A1A2E] border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Privacy First</h3>
              <p className="text-gray-400">End-to-end encryption ensures your data remains secure and private.</p>
            </div>
            
            <div className="bg-[#1A1A2E] border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Decentralized</h3>
              <p className="text-gray-400">Built on a distributed network that no single entity controls.</p>
            </div>
            
            <div className="bg-[#1A1A2E] border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Secure AI</h3>
              <p className="text-gray-400">AI agents that operate securely within encrypted environments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserPage;
