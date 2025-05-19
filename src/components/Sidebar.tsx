
import { Button } from "@/components/ui/button";
import { Mail, Inbox, Send, Archive, Trash, Logs, MessageCircle } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const sidebarItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'chat', label: 'Chat', icon: MessageCircle }, // Using MessageCircle from lucide-react
    { id: 'trash', label: 'Trash', icon: Trash },
    { id: 'logs', label: 'Logs', icon: Logs },
  ];

  return (
    <div className="w-64 bg-[#252A38] border-r border-gray-700 flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 flex items-center">
        <h1 className="font-bold text-lg">MoltenArc</h1>
      </div>
      
      {/* New Message Button */}
      <div className="px-4 mb-6">
        <Button 
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
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
                  ? "bg-[#2A2F3C] text-[#61dafb]" 
                  : "text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
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
      <div className="p-4 border-t border-gray-700">
        <div className="bg-[#1E2230] rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Security Status</div>
            <div className="text-sm text-[#33C3F0]">Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
