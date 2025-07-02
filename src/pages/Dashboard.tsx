import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Search, 
  User, 
  MessageCircle, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Maximize, 
  Home, 
  Send, 
  Shield, 
  Wallet,
  Mail,
  Calendar,
  Users,
  Clock,
  Cloud,
  Grid3x3,
  Chrome,
  Logs,
  TrendingUp,
  Bell,
  FileText,
  Activity
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import EmailList from "@/components/EmailList";
import EmailContent from "@/components/EmailContent";
import Sidebar from "@/components/Sidebar";
import SecureChat from "@/components/SecureChat";
import ChatPanel from "@/components/ChatPanel";
import { Link } from "react-router-dom";
import ContactsPage from "@/components/ContactsPage";
import CalendarPage from "@/components/CalendarPage";
import CloudDrivePage from "@/components/CloudDrivePage";
import AppCenterPage from "@/components/AppCenterPage";
import BrowserPage from "@/components/BrowserPage";
import LogsPage from "@/components/LogsPage";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
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

  // Dashboard Home Content
  const renderDashboardHome = () => {
    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to AmplifiX</h1>
            <p className="text-gray-400">AI-Powered Corporate Communications Dashboard</p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#1A1A1A] border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Campaigns</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">24</div>
                <p className="text-xs text-green-500">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Media Mentions</span>
                  <Activity className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">847</div>
                <p className="text-xs text-blue-500">+8% this week</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Investor Contacts</span>
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,234</div>
                <p className="text-xs text-purple-500">+5% this quarter</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Engagement Rate</span>
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">89.2%</div>
                <p className="text-xs text-yellow-500">+3.2% improvement</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1A1A1A] border-gray-800">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Press release "Q3 Financial Results" published</p>
                        <p className="text-gray-400 text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">New investor meeting scheduled with Goldman Sachs</p>
                        <p className="text-gray-400 text-xs">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">AI content analysis completed for tech blog post</p>
                        <p className="text-gray-400 text-xs">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Media sentiment report generated</p>
                        <p className="text-gray-400 text-xs">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Crisis communication protocol activated</p>
                        <p className="text-gray-400 text-xs">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications & Quick Actions */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card className="bg-[#1A1A1A] border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    <Bell className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm font-medium">Media Alert</p>
                      <p className="text-gray-300 text-xs">Negative sentiment detected in tech news</p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm font-medium">Campaign Success</p>
                      <p className="text-gray-300 text-xs">Q3 campaign exceeded targets by 15%</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-400 text-sm font-medium">Meeting Reminder</p>
                      <p className="text-gray-300 text-xs">Board meeting tomorrow at 2 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-[#1A1A1A] border-gray-800">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90"
                      onClick={() => setShowCompose(true)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Press Release
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-700 text-white hover:bg-gray-800"
                      onClick={() => setActiveTab('calendar')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-700 text-white hover:bg-gray-800"
                      onClick={() => setActiveTab('contacts')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Contacts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-8">
            <Card className="bg-[#1A1A1A] border-gray-800">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0F0F0F] rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-400 font-medium">Board Meeting</span>
                      <span className="text-xs text-gray-400">Tomorrow</span>
                    </div>
                    <p className="text-white text-sm">Q3 Financial Review</p>
                    <p className="text-gray-400 text-xs">2:00 PM - 4:00 PM EST</p>
                  </div>
                  <div className="p-4 bg-[#0F0F0F] rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-400 font-medium">Investor Call</span>
                      <span className="text-xs text-gray-400">Dec 15</span>
                    </div>
                    <p className="text-white text-sm">Morgan Stanley Meeting</p>
                    <p className="text-gray-400 text-xs">10:00 AM - 11:00 AM EST</p>
                  </div>
                  <div className="p-4 bg-[#0F0F0F] rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-purple-400 font-medium">Product Launch</span>
                      <span className="text-xs text-gray-400">Dec 20</span>
                    </div>
                    <p className="text-white text-sm">AI Platform 2.0 Announcement</p>
                    <p className="text-gray-400 text-xs">9:00 AM - 10:30 AM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Show main content based on active tab
  const renderMainContent = () => {
    if (activeTab === 'home') {
      return renderDashboardHome();
    }
    
    if (activeTab === 'contacts') {
      return <ContactsPage />;
    }
    
    if (activeTab === 'calendar' || activeTab === 'scheduler') {
      return <CalendarPage />;
    }
    
    if (activeTab === 'clouddrive') {
      return <CloudDrivePage />;
    }
    
    if (activeTab === 'apps') {
      return <AppCenterPage />;
    }
    
    if (activeTab === 'browser') {
      return <BrowserPage />;
    }
    
    if (activeTab === 'logs') {
      return <LogsPage />;
    }
    
    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Email List Column */}
        <div className="w-80 border-r border-gray-800 overflow-y-auto">
          <div className="p-3 flex justify-between items-center border-b border-gray-800">
            <h3 className="font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCompose(true)}
              className="text-white bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] border-none hover:opacity-90"
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
    <div className="h-screen bg-[#0A0A0A] text-white flex overflow-hidden">
      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Container for sidebar and content that shifts right when chat is open */}
      <div className={`flex flex-1 transition-transform duration-300 ${
        isChatOpen ? 'translate-x-[264px]' : 'translate-x-0'
      }`}>
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-[#1A1A1A] border-b border-gray-800 p-2 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Top Header Icons - Added new icons based on the image */}
                <Button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="h-8 w-8 rounded-full bg-transparent hover:bg-[#0F0F0F] p-0 flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'home' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('home')}
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'inbox' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('inbox')}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'calendar' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('calendar')}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'contacts' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('contacts')}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'scheduler' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('scheduler')}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'clouddrive' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('clouddrive')}
                  >
                    <Cloud className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'apps' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('apps')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'browser' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('browser')}
                  >
                    <Chrome className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${activeTab === 'logs' ? 'text-[#8A3FFC]' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('logs')}
                  >
                    <Logs className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-[#0F0F0F] rounded-md px-2 py-1 flex items-center">
                  <span className="text-sm">/dashboard</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity rounded-md px-3 py-1 h-8"
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
          <div className="bg-[#1A1A1A] w-full max-w-2xl rounded-lg shadow-xl border border-gray-800">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
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
                    className="bg-[#0F0F0F] border-gray-800"
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Subject" 
                    className="bg-[#0F0F0F] border-gray-800"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder="Write your secure message here..." 
                    className="bg-[#0F0F0F] border-gray-800 min-h-[200px]"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity"
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
