
import { Button } from "@/components/ui/button";
import { Mail, Inbox, Send, Archive, Trash, Logs, MessageCircle, Bot, Chrome } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Define the correct type for the sidebar items
interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const sidebarItems: SidebarItem[] = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'draft', label: 'Draft', icon: Mail },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'browser', label: 'Browser', icon: Chrome },
    { id: 'logs', label: 'Logs', icon: Logs },
    { id: 'trash', label: 'Trash', icon: Trash },
  ];

  return (
    <div className="w-64 bg-[#1A1A1A] border-r border-gray-800 flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 flex items-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="font-bold text-lg">MoltenArc</h1>
      </div>
      
      {/* New Message Button */}
      <div className="px-4 mb-6">
        <Button 
          className="w-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-90 transition-opacity"
          onClick={() => window.dispatchEvent(new CustomEvent("open-compose"))}
        >
          <Mail className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === item.id 
                  ? "bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 text-[#7C3AED] border border-[#7C3AED]/30" 
                  : "text-gray-300 hover:text-white hover:bg-[#0F0F0F]"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Security Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-[#0F0F0F] rounded-lg p-3 border border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Security Status</div>
            <div className="text-sm bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent font-medium">Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
