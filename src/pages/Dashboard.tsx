import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, User, MessageCircle, ArrowLeft, ArrowRight, RefreshCw, Maximize, Home, Send, Shield, Wallet } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import EmailList from "@/components/EmailList";
import EmailContent from "@/components/EmailContent";
import Sidebar from "@/components/Sidebar";
import SecureChat from "@/components/SecureChat";
import ChatPanel from "@/components/ChatPanel";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your encrypted message has been securely delivered.",
    });
    setShowCompose(false);
  };
  
  // Handle compose modal opening
  useEffect(() => {
    const openComposeHandler = () => setShowCompose(true);
    window.addEventListener("open-compose", openComposeHandler);
    return () => {
      window.removeEventListener("open-compose", openComposeHandler);
    };
  }, []);

  // Toggle chat when Chat tab is selected
  useEffect(() => {
    if (activeTab === 'chat') {
      setIsChatOpen(true);
    } else if (isChatOpen && activeTab !== 'chat') {
      setIsChatOpen(false);
    }
  }, [activeTab]);

  // Show main content based on active tab
  const renderMainContent = () => {
    if (activeTab === 'chat') {
      return (
        <div className="flex-1 flex flex-col bg-[#1A1F2C] p-6">
          <div className="bg-[#252A38] rounded-lg shadow-lg flex flex-col h-full border border-gray-700">
            {/* Chat Header */}
            <div className="border-b border-gray-700 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#61dafb] flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">Secure Chat</h2>
                  <div className="text-xs text-gray-400">End-to-end encrypted</div>
                </div>
              </div>
              <div>
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat Messages - Re-use the existing chat panel component's logic */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* We'll use the same message format as ChatPanel but with a larger display */}
              <div className="flex justify-start">
                <div className="max-w-md p-3 rounded-xl text-sm bg-[#252A38] text-white rounded-tl-none">
                  Welcome to MoltenArc's encrypted chat. How can I assist you today?
                  <div className="text-xs mt-1 text-gray-400">09:30</div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-md p-3 rounded-xl text-sm bg-[#61dafb] text-white rounded-tr-none">
                  Can you help me with secure file transfers?
                  <div className="text-xs mt-1 text-white/70">09:32</div>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-md p-3 rounded-xl text-sm bg-[#252A38] text-white rounded-tl-none">
                  Absolutely. Our secure file transfer system uses end-to-end encryption. Would you like me to walk you through the process?
                  <div className="text-xs mt-1 text-gray-400">09:33</div>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="border-t border-gray-700 p-4 bg-[#1E2230]">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your secure message..."
                  className="bg-[#252A38] border-gray-700 text-white"
                />
                <Button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground p-2 h-10 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Shield className="h-3 w-3 mr-1" />
                End-to-end encrypted messaging
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Email List Column */}
        <div className="w-80 border-r border-gray-700 overflow-y-auto">
          <div className="p-3 flex justify-between items-center border-b border-gray-700">
            <h3 className="font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCompose(true)}
              className="text-secondary-foreground bg-secondary border-secondary hover:bg-secondary/80 hover:text-secondary-foreground"
            >
              Compose
            </Button>
          </div>
          <EmailList 
            activeTab={activeTab}
            selectedEmail={selectedEmail} 
            setSelectedEmail={setSelectedEmail} 
          />
        </div>
        
        {/* Email Content */}
        <div className="flex-1 overflow-y-auto">
          <EmailContent selectedEmail={selectedEmail} />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#1A1F2C] text-white flex overflow-hidden">
      {/* Chat Panel - positioned on the far left */}
      <ChatPanel isOpen={isChatOpen} onClose={() => {
        setIsChatOpen(false);
        if (activeTab === 'chat') {
          setActiveTab('inbox');
        }
      }} />
      
      {/* Container for sidebar and content that shifts right when chat is open */}
      <div className={`flex flex-1 transition-transform duration-300 ${
        isChatOpen ? 'translate-x-[264px]' : 'translate-x-0'
      }`}>
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-[#252A38] border-b border-gray-700 p-2 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Chat Button */}
                <Button 
                  onClick={() => {
                    setIsChatOpen(!isChatOpen);
                    if (!isChatOpen) {
                      setActiveTab('chat');
                    }
                  }}
                  className="h-8 w-8 rounded-full bg-transparent hover:bg-[#1E2230] p-0 flex items-center justify-center"
                >
                  <MessageCircle className={`h-5 w-5 ${activeTab === 'chat' ? 'text-[#61dafb]' : 'text-gray-400'}`} />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Link to="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#61dafb]">
                      <Home className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-[#1E2230] rounded-md px-2 py-1 flex items-center">
                  <span className="text-sm">/dashboard</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors rounded-md px-3 py-1 h-8"
                >
                  <Wallet className="h-4 w-4 mr-1" />
                  Wallet
                </Button>
              </div>
            </div>
          </header>

          {renderMainContent()}
        </div>
      </div>
      
      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#252A38] w-full max-w-2xl rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="font-medium">New Secure Message</h3>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                onClick={() => setShowCompose(false)}
              >
                &times;
              </Button>
            </div>
            <form onSubmit={handleComposeSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <Input 
                    placeholder="To" 
                    className="bg-[#1E2230] border-gray-700"
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Subject" 
                    className="bg-[#1E2230] border-gray-700"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder="Write your secure message here..." 
                    className="bg-[#1E2230] border-gray-700 min-h-[200px]"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Send Secure Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Toaster />
    </div>
  );
};

export default Dashboard;
