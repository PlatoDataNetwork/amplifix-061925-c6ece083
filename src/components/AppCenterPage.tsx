import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Calendar, MessageCircle, FileText, Image, Brain, Sparkles, Zap, Cpu } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { AppsData } from "@/types/apps";
import { Skeleton } from "@/components/ui/skeleton";

const AppCenterPage = () => {
  const { data: appsData, isLoading } = useJsonData<AppsData>('apps.json');

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      FileText, Calendar, MessageCircle, Image, Brain, Sparkles, Zap, Cpu
    };
    return icons[iconName] || FileText;
  };

  if (isLoading || !appsData) {
    return (
      <div className="flex-1 flex flex-col bg-[#0A0A0A] overflow-hidden">
        <div className="p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-center flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">{appsData.page_title}</h1>
        <Button 
          variant="outline" 
          className="bg-[#0A0A0A] border-gray-700 text-white hover:bg-[#1A1A1A]"
        >
          <Settings className="h-4 w-4 mr-2" />
          {appsData.manage_apps_button}
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-8 pb-6">
          {/* Recently Used Apps */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">{appsData.recently_used_title}</h2>
            <div className="bg-transparent rounded-lg border border-gray-800 p-6">
              <ScrollArea className="w-full">
                <div className="flex gap-6 min-w-max">
                  {appsData.recentlyUsedApps.map((app) => {
                    const IconComponent = getIcon(app.icon);
                    return (
                      <div 
                        key={app.id}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-[#1A1A1A] transition-colors cursor-pointer min-w-[120px]"
                      >
                        <div className={`w-16 h-16 rounded-xl ${app.color} flex items-center justify-center`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-sm text-white text-center">{app.name}</span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Productivity Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">{appsData.productivity_title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appsData.productivityApps.map((app) => {
                const IconComponent = getIcon(app.icon);
                return (
                  <div 
                    key={app.id}
                    className="bg-transparent rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">{app.name}</h3>
                        </div>
                      </div>
                      <Button
                        className={
                          app.status === "installed" 
                            ? "bg-[#0A0A0A] border border-gray-700 text-white hover:bg-[#1A1A1A]" 
                            : "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90"
                        }
                        variant={app.status === "installed" ? "outline" : "default"}
                      >
                        {app.status === "installed" ? appsData.open_button : appsData.install_button}
                      </Button>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generative AI Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">{appsData.generative_ai_title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appsData.generativeAIApps.map((app) => {
                const IconComponent = getIcon(app.icon);
                return (
                  <div 
                    key={app.id}
                    className="bg-transparent rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">{app.name}</h3>
                        </div>
                      </div>
                      <Button
                        className={
                          app.status === "installed" 
                            ? "bg-[#0A0A0A] border border-gray-700 text-white hover:bg-[#1A1A1A]" 
                            : "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90"
                        }
                        variant={app.status === "installed" ? "outline" : "default"}
                      >
                        {app.status === "installed" ? appsData.open_button : appsData.install_button}
                      </Button>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AppCenterPage;
