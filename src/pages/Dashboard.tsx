import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
import { useJsonData } from "@/hooks/useJsonData";
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

interface DashboardData {
  dashboard: {
    seo: {
      title: string;
      description: string;
      keywords: string;
      og_title: string;
      og_description: string;
      twitter_title: string;
      twitter_description: string;
      canonical_url: string;
    };
    header: {
      title: string;
      subtitle: string;
    };
    stats_cards: Array<{
      title: string;
      value: string;
      change: string;
      change_type: string;
      icon: string;
      color: string;
    }>;
    recent_activity: {
      title: string;
      activities: Array<{
        message: string;
        timestamp: string;
        color: string;
      }>;
    };
    notifications: {
      title: string;
      items: Array<{
        title: string;
        message: string;
        type: string;
        color: string;
      }>;
    };
    quick_actions: {
      title: string;
      actions: Array<{
        title: string;
        icon: string;
        action: string;
        variant: string;
      }>;
    };
    upcoming_events: {
      title: string;
      events: Array<{
        title: string;
        description: string;
        date: string;
        time: string;
        color: string;
      }>;
    };
    navigation: {
      sidebar_items: Array<{
        id: string;
        title: string;
        icon: string;
      }>;
    };
  };
}

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useJsonData<DashboardData>('dashboard.json');
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

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-red-400">Failed to load dashboard data</p>
      </div>
    );
  }

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      TrendingUp,
      Activity,
      Users,
      FileText,
      Calendar
    };
    return icons[iconName] || TrendingUp;
  };

  // Dashboard Home Content
  const renderDashboardHome = () => {
    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{dashboardData.dashboard.header.title}</h1>
            <p className="text-gray-400">{dashboardData.dashboard.header.subtitle}</p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {dashboardData.dashboard.stats_cards.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              return (
                <Card key={index} className="bg-[#1A1A1A] border-gray-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{stat.title}</span>
                      <IconComponent className={`h-4 w-4 text-${stat.color}-500`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <p className={`text-xs text-${stat.color}-500`}>{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1A1A1A] border-gray-800">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">{dashboardData.dashboard.recent_activity.title}</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.dashboard.recent_activity.activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`}></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.message}</p>
                          <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
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
                    <h3 className="text-lg font-semibold text-white">{dashboardData.dashboard.notifications.title}</h3>
                    <Bell className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.dashboard.notifications.items.map((item, index) => (
                      <div key={index} className={`p-3 bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-lg`}>
                        <p className={`text-${item.color}-400 text-sm font-medium`}>{item.title}</p>
                        <p className="text-gray-300 text-xs">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-[#1A1A1A] border-gray-800">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">{dashboardData.dashboard.quick_actions.title}</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.dashboard.quick_actions.actions.map((action, index) => {
                      const IconComponent = getIconComponent(action.icon);
                      const isPrimary = action.variant === 'primary';
                      
                      return (
                        <Button 
                          key={index}
                          className={isPrimary ? "w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90" : "w-full border-gray-700 text-white hover:bg-gray-800"}
                          variant={isPrimary ? undefined : 'outline'}
                          onClick={() => {
                            if (action.action === 'compose') setShowCompose(true);
                            else if (action.action === 'calendar') setActiveTab('calendar');
                            else if (action.action === 'contacts') setActiveTab('contacts');
                          }}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {action.title}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-8">
            <Card className="bg-[#1A1A1A] border-gray-800">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">{dashboardData.dashboard.upcoming_events.title}</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.dashboard.upcoming_events.events.map((event, index) => (
                    <div key={index} className="p-4 bg-[#0F0F0F] rounded-lg border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm text-${event.color}-400 font-medium`}>{event.title}</span>
                        <span className="text-xs text-gray-400">{event.date}</span>
                      </div>
                      <p className="text-white text-sm">{event.description}</p>
                      <p className="text-gray-400 text-xs">{event.time}</p>
                    </div>
                  ))}
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
      <Helmet>
        <title>{dashboardData.dashboard.seo.title}</title>
        <meta name="description" content={dashboardData.dashboard.seo.description} />
        <meta name="keywords" content={dashboardData.dashboard.seo.keywords} />
        <meta property="og:title" content={dashboardData.dashboard.seo.og_title} />
        <meta property="og:description" content={dashboardData.dashboard.seo.og_description} />
        <meta name="twitter:title" content={dashboardData.dashboard.seo.twitter_title} />
        <meta name="twitter:description" content={dashboardData.dashboard.seo.twitter_description} />
        <link rel="canonical" href={dashboardData.dashboard.seo.canonical_url} />
      </Helmet>
      
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
