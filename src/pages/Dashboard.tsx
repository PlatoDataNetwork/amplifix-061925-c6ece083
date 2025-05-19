import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail, Inbox, Send, Archive, Trash, Shield, Search, Globe, Zap, Plus, User } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import EmailList from "@/components/EmailList";
import EmailContent from "@/components/EmailContent";
import Sidebar from "@/components/Sidebar";
import SecureChat from "@/components/SecureChat";
import MoltenArcIcon from "@/components/MoltenArcIcon";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  
  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your encrypted message has been securely delivered.",
    });
    setShowCompose(false);
  };

  return (
    <div className="h-screen bg-[#1A1F2C] text-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#252A38] border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
                onClick={() => setShowBrowser(!showBrowser)}
              >
                <Globe className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
                onClick={() => toast({
                  title: "Security Check",
                  description: "All communications are end-to-end encrypted.",
                })}
              >
                <Shield className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search secure messages..."
                className="pl-10 bg-[#1E2230] border-gray-700 focus-visible:ring-[#9b87f5]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                className="rounded-full h-9 w-9 p-0"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Browser or Email interface */}
        {showBrowser ? (
          // ... keep existing code (browser view)
          <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between bg-[#252A38] border-b border-gray-700">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <Input 
                    placeholder="https://" 
                    className="w-[400px] bg-[#1E2230] border-gray-700"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-600 hover:bg-gray-800"
                    onClick={() => setShowBrowser(false)}
                  >
                    Connect Wallet
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-300"
                    onClick={() => setShowBrowser(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(100vh-180px)] flex items-center justify-center bg-[#1E2230]">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#252A38] border border-gray-700">
                      <Globe className="h-8 w-8 text-[#9b87f5]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Secure Browser</h3>
                    <p className="text-gray-400 max-w-md mb-4">
                      Browse the web with enhanced privacy protection and seamless wallet connections
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button 
                        className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                      >
                        Enter URL
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 hover:bg-gray-800"
                        onClick={() => setShowBrowser(false)}
                      >
                        Back to Mail
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Email List */}
            <div className="w-80 border-r border-gray-700 overflow-y-auto">
              <div className="p-3 flex justify-between items-center border-b border-gray-700">
                <h3 className="font-medium">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCompose(true)}
                  className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#2A2F3C]"
                >
                  <Plus className="h-4 w-4 mr-1" />
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
        )}
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
              <div className="mt-4 flex justify-between">
                <div className="flex items-center text-sm text-[#9b87f5]">
                  <Shield className="h-4 w-4 mr-1" />
                  End-to-end encrypted
                </div>
                <Button 
                  type="submit" 
                  className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                >
                  Send Secure Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Chat Component */}
      <SecureChat />
      
      <Toaster />
    </div>
  );
};

export default Dashboard;
