
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, RefreshCw, Shield, Lock, Globe, Plus, X } from "lucide-react";
import { useState } from "react";

const BrowserPage = () => {
  const [url, setUrl] = useState("https://platodata.io");
  const [currentUrl, setCurrentUrl] = useState("https://platodata.io");

  const handleNavigate = () => {
    setCurrentUrl(url);
  };

  const handleRefresh = () => {
    // Force iframe refresh by adding timestamp
    setCurrentUrl(currentUrl + (currentUrl.includes('?') ? '&' : '?') + '_t=' + Date.now());
  };

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
                <h2 className="font-semibold">Live Browser</h2>
                <div className="text-xs text-gray-400">Secure browsing experience</div>
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
            <Button variant="ghost" size="sm" className="text-gray-400" onClick={handleRefresh}>
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
                onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
                className="bg-transparent border-none p-0 text-white focus:ring-0"
                placeholder="Enter URL..."
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] hover:opacity-90 text-white"
              onClick={handleNavigate}
            >
              Go
            </Button>
          </div>
        </div>
        
        {/* Live Browser Content */}
        <div className="flex-1 overflow-hidden bg-[#0A0A0A] rounded-b-lg">
          <iframe
            src={currentUrl}
            className="w-full h-full border-none"
            title="Live Browser"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  );
};

export default BrowserPage;
