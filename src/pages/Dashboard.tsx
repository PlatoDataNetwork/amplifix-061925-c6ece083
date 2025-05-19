
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, User } from "lucide-react";
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
  
  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your encrypted message has been securely delivered.",
    });
    setShowCompose(false);
  };
  
  // Handle compose modal opening
  useState(() => {
    const openComposeHandler = () => setShowCompose(true);
    window.addEventListener("open-compose", openComposeHandler);
    return () => {
      window.removeEventListener("open-compose", openComposeHandler);
    };
  });

  return (
    <div className="h-screen bg-[#1A1F2C] text-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#252A38] border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="mr-2 rounded-full h-8 w-8"
              >
                <span className="sr-only">Switch account</span>
                <User className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search secure messages..."
                className="pl-10 bg-[#1E2230] border-gray-700 focus-visible:ring-[#9b87f5] rounded-full"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Right header elements */}
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
                className="text-[#9b87f5] border-[#9b87f5] hover:bg-[#2A2F3C] hover:text-[#9b87f5]"
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
                  className="bg-gradient-to-r from-indigo-500 to-blue-400 hover:opacity-90"
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
