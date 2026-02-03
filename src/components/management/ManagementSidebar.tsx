import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Tags,
  FolderTree,
  Rss,
  PlusCircle,
  ScrollText,
  Image,
  Settings,
  BarChart3,
  Map,
  FileCode,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ManagementSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const ManagementSidebar = ({ currentView, onViewChange }: ManagementSidebarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    content: true,
    feeds: false,
    settings: false,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleNavigation = (view: string, path?: string) => {
    if (path) {
      navigate(path);
    } else {
      onViewChange(view);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuGroups = [
    {
      id: "content",
      label: "Content",
      items: [
        { id: "articles", label: "All Articles", icon: FileText, path: "/admin/articles" },
        { id: "new-article", label: "New Article", icon: FilePlus, path: "/admin/articles/new" },
        { id: "tags", label: "Tags", icon: Tags, path: "/admin/tags" },
        { id: "verticals", label: "Verticals", icon: FolderTree, path: "/admin/verticals" },
      ],
    },
    {
      id: "feeds",
      label: "Feed Syndicator",
      items: [
        { id: "feeds", label: "All Feeds", icon: Rss, path: "/admin/feeds" },
        { id: "add-feed", label: "Add Feed", icon: PlusCircle, path: "/admin/feeds/new" },
        { id: "feed-logs", label: "Sync Logs", icon: ScrollText, path: "/admin/feeds/logs" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      items: [
        { id: "settings-general", label: "General", icon: Settings, path: "/admin/settings" },
        { id: "settings-analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
        { id: "sitemaps", label: "Sitemaps", icon: Map, path: "/admin/sitemap-admin" },
        { id: "robots", label: "Robots.txt", icon: FileCode, path: "/admin/robots" },
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
                isActive={currentView === "dashboard"}
                onClick={() => onViewChange("dashboard")}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                {!isCollapsed && <span>Dashboard</span>}
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
                          openGroups[group.id] ? "rotate-180" : ""
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
                          onClick={() => handleNavigation(item.id, item.path)}
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

        {/* Default Images - standalone item */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "default-images"}
                onClick={() => handleNavigation("default-images", "/admin/default-images")}
                tooltip="Default Images"
              >
                <Image className="h-4 w-4" />
                {!isCollapsed && <span>Default Images</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
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
