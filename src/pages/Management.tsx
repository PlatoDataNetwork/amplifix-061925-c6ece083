import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ManagementSidebar from "@/components/management/ManagementSidebar";
import DashboardView from "@/components/management/DashboardView";

const Management = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <ManagementSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <SidebarInset>
          {renderContent()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Management;
