import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Wand2,
  Archive,
  GitCompare,
  Download,
  Upload,
  Database,
  Users,
  Star,
  Map,
  Languages,
  BarChart3,
  LineChart,
  UserCog,
  Shield,
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
import { Button } from "@/components/ui/button";

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
    import: false,
    settings: false,
    analytics: false,
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
        { id: "article-editor", label: "Article Editor", icon: PenSquare, path: "/admin/articles" },
        { id: "article-formatter", label: "Article Formatter", icon: Wand2, path: "/admin/articles/format" },
        { id: "article-backups", label: "Article Backups", icon: Archive, path: "/admin/articles/backups" },
        { id: "article-comparison", label: "Article Comparison", icon: GitCompare, path: "/admin/articles/comparison" },
      ],
    },
    {
      id: "import",
      label: "Import",
      items: [
        { id: "import-dashboard", label: "Import Dashboard", icon: Download, path: "/admin/import" },
        { id: "bulk-import", label: "Bulk Import", icon: Upload, path: "/admin/bulk-import" },
        { id: "plato-import", label: "Plato Import", icon: Database, path: "/admin/plato-import" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      items: [
        { id: "users", label: "User Management", icon: Users, path: "/admin/users" },
        { id: "showcase", label: "Showcase Manager", icon: Star, path: "/admin/showcase" },
        { id: "sitemaps", label: "Sitemap Generator", icon: Map, path: "/admin/sitemaps" },
        { id: "translations", label: "Translations", icon: Languages, path: "/admin/translations/manager" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [
        { id: "intel-stats", label: "Intel Stats", icon: BarChart3, path: "/admin/intel-stats" },
        { id: "analytics", label: "Google Analytics", icon: LineChart, path: "/admin/analytics" },
        { id: "crm", label: "CRM", icon: UserCog, path: "/admin/crm" },
        { id: "security", label: "Security Dashboard", icon: Shield, path: "/admin/security" },
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
