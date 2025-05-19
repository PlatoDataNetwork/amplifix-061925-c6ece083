
import { Button } from "@/components/ui/button";
import { Mail, Inbox, Send, Archive, Trash, Shield, Zap } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const sidebarItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash },
  ];

  return (
    <div className="w-64 bg-[#252A38] border-r border-gray-700 flex flex-col">
      {/* Logo Area */}
      <div className="p-4 border-b border-gray-700 flex items-center">
        <Zap className="h-6 w-6 text-[#9b87f5] mr-2" />
        <h1 className="font-bold text-lg">SecureFlowMail</h1>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-6">
          <Button 
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#61dafb] hover:opacity-90"
          >
            <Mail className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
        
        <nav>
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start mb-1 ${
                activeTab === item.id 
                  ? "bg-[#2A2F3C] text-[#9b87f5]" 
                  : "text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Security Status */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-[#1E2230] rounded-lg p-3 flex items-center">
          <Shield className="h-5 w-5 text-green-500 mr-3" />
          <div>
            <div className="text-sm font-medium">Security Status</div>
            <div className="text-xs text-green-500">Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
