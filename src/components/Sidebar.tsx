import { Button } from "@/components/ui/button";
import { Mail, Inbox, Calendar, Users, Clock, Cloud, Grid3x3, Chrome, Logs, MessageCircle, Bot, Trash } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { SidebarContent } from "@/types/dashboard";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarData: SidebarContent;
}

const Sidebar = ({ activeTab, setActiveTab, sidebarData }: SidebarProps) => {
  // Map icon names to Lucide components
  const iconMap: { [key: string]: LucideIcon } = {
    Inbox,
    Calendar,
    Users,
    Clock,
    Cloud,
    Grid3x3,
    Chrome,
    MessageCircle,
    Logs,
    Trash,
  };

  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Mail;
  };

  return (
    <div className="w-64 bg-[#121218] border-r border-gray-800 flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 flex items-center">
        <div className="w-8 h-8 flex items-center justify-center mr-3">
          <img 
            src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
            alt={sidebarData.logo_alt} 
            className="w-8 h-8"
          />
        </div>
        <h1 className="font-bold text-lg">{sidebarData.app_name}</h1>
      </div>
      
      {/* New Message Button */}
      <div className="px-4 mb-6">
        <Button 
          className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity"
          onClick={() => window.dispatchEvent(new CustomEvent("open-compose"))}
        >
          <Mail className="mr-2 h-4 w-4" />
          {sidebarData.new_message_button}
        </Button>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {sidebarData.sidebar_items.map((item) => {
            const IconComponent = getIcon(item.icon);
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === item.id 
                    ? "bg-gradient-to-r from-[#8A3FFC]/20 to-[#06B6D4]/20 text-[#8A3FFC] border border-[#8A3FFC]/30" 
                    : "text-gray-300 hover:text-white hover:bg-[#0A0A0A]"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <IconComponent className="mr-2 h-5 w-5" />
                {item.title}
              </Button>
            );
          })}
        </nav>
      </div>
      
      {/* Security Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-[#0A0A0A] rounded-lg p-3 border border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">{sidebarData.security_status_label}</div>
            <div className="text-sm bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent font-medium">{sidebarData.security_status_value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
