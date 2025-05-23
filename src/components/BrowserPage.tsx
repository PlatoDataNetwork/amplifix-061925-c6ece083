
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, RefreshCw, Shield, Lock, Globe, Plus, X } from "lucide-react";
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
                <h2 className="font-semibold">Wireframe Browser</h2>
                <div className="text-xs text-gray-400">Simple wireframe interface</div>
              </div>
            </div>
          </div>
          
          {/* Browser Tab Bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center bg-[#0A0A0A] border border-gray-700 rounded-t-md px-3 py-1 min-w-[200px]">
              <Globe className="h-3 w-3 text-gray-400 mr-2" />
              <span className="text-xs text-gray-300 truncate">Plato Data</span>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-auto">
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400">
              <Plus className="h-3 w-3" />
            </Button>
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
                placeholder="Enter URL..."
              />
            </div>
            <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] hover:opacity-90 text-white">
              Go
            </Button>
          </div>
        </div>
        
        {/* Browser Content - Wireframe */}
        <div className="flex-1 overflow-y-auto bg-white p-8">
          {/* Wireframe Header */}
          <div className="border-b border-gray-300 pb-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">P</span>
                </div>
                <div className="h-6 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="flex gap-6">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-18 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-8 w-20 bg-blue-200 border border-blue-400 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Wireframe Hero Section */}
          <div className="text-center py-16">
            <div className="inline-block h-6 w-24 bg-blue-200 border border-blue-400 rounded mb-8"></div>
            
            <div className="space-y-4 mb-8">
              <div className="h-12 w-full max-w-4xl mx-auto bg-gray-300 rounded"></div>
              <div className="h-12 w-full max-w-3xl mx-auto bg-gray-300 rounded"></div>
            </div>
            
            <div className="space-y-2 mb-12">
              <div className="h-4 w-full max-w-2xl mx-auto bg-gray-200 rounded"></div>
              <div className="h-4 w-full max-w-xl mx-auto bg-gray-200 rounded"></div>
              <div className="h-4 w-full max-w-lg mx-auto bg-gray-200 rounded"></div>
            </div>
            
            <div className="flex justify-center gap-4">
              <div className="h-10 w-32 bg-blue-200 border border-blue-400 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 border border-gray-400 rounded"></div>
            </div>
          </div>
          
          {/* Wireframe Features Grid */}
          <div className="grid grid-cols-3 gap-8 py-16">
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-200 border border-blue-400 rounded-lg mb-4"></div>
              <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="space-y-1">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-200 border border-purple-400 rounded-lg mb-4"></div>
              <div className="h-6 w-28 bg-gray-300 rounded mb-2"></div>
              <div className="space-y-1">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-200 border border-green-400 rounded-lg mb-4"></div>
              <div className="h-6 w-20 bg-gray-300 rounded mb-2"></div>
              <div className="space-y-1">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Wireframe Footer Section */}
          <div className="border-t border-gray-300 pt-8 mt-16">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <div className="h-5 w-20 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-3 w-14 bg-gray-200 rounded"></div>
                  <div className="h-3 w-18 bg-gray-200 rounded"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-5 w-24 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-3 w-14 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-5 w-16 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 w-18 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-14 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-5 w-22 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserPage;
