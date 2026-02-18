import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, FileText, Tags, FolderTree, Rss, ScrollText, Image,
  Settings, BarChart3, Map, FileCode, LogOut, ChevronDown, ImageIcon,
  Share2, Scaling, TrendingUp,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ManagementSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const ManagementSidebar = ({ currentView, onViewChange }: ManagementSidebarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    content: true,
    feeds: false,
    tools: false,
    settings: false,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuGroups = [
    {
      id: 'content',
      label: 'Content',
      items: [
        { id: 'articles', label: 'All Articles', icon: FileText },
        { id: 'tags', label: 'Tags', icon: Tags },
        { id: 'verticals', label: 'Verticals', icon: FolderTree },
        { id: 'default-images', label: 'Default Images', icon: Image },
      ],
    },
    {
      id: 'feeds',
      label: 'Feed Syndicator',
      items: [
        { id: 'feeds', label: 'All Feeds', icon: Rss },
        { id: 'feed-logs', label: 'Sync Logs', icon: ScrollText },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        { id: 'og-generator', label: 'OG Image Generator', icon: ImageIcon },
        { id: 'social-preview', label: 'Social Preview', icon: Share2 },
        { id: 'batch-resize', label: 'Batch Resizer', icon: Scaling },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      items: [
        { id: 'settings-general', label: 'General', icon: Settings },
        { id: 'settings-analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'sitemaps', label: 'Sitemaps', icon: Map },
        { id: 'robots', label: 'Robots.txt', icon: FileCode },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          {!isCollapsed && (
            <span className="font-semibold text-lg">Management</span>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === 'dashboard'}
                onClick={() => onViewChange('dashboard')}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                {!isCollapsed && <span>Dashboard</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === 'analytics-dashboard'}
                onClick={() => onViewChange('analytics-dashboard')}
                tooltip="Analytics"
              >
                <TrendingUp className="h-4 w-4" />
                {!isCollapsed && <span>Analytics</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Grouped Sections */}
        {menuGroups.map((group) => (
          <SidebarGroup key={group.id}>
            <Collapsible
              open={openGroups[group.id]}
              onOpenChange={() => toggleGroup(group.id)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent rounded-md transition-colors">
                  {!isCollapsed && (
                    <>
                      <span>{group.label}</span>
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${
                          openGroups[group.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={currentView === item.id}
                          onClick={() => onViewChange(item.id)}
                          tooltip={item.label}
                        >
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.label}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {!isCollapsed && user && (
            <SidebarMenuItem>
              <div className="px-2 py-1 text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ManagementSidebar;
