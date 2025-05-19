
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, User, MessageCircle, ArrowLeft, ArrowRight, RefreshCw, Maximize, Home } from "lucide-react";
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

  return (
    <div className="h-screen bg-[#1A1F2C] text-white flex overflow-hidden">
      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#252A38] border-b border-gray-700 p-2 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Chat Button - Moved to left side */}
              <Button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="h-8 w-8 rounded-full bg-transparent hover:bg-[#1E2230] p-0 flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 text-[#61dafb]" />
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
                Publish
              </Button>
            </div>
          </div>
        </header>

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
