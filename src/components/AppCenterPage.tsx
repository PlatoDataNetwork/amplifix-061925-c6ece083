
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Calendar, MessageCircle, FileText, Image } from "lucide-react";

const AppCenterPage = () => {
  const recentlyUsedApps = [
    {
      id: 1,
      name: "Notes",
      icon: FileText,
      color: "bg-yellow-600"
    },
    {
      id: 2,
      name: "Calendar",
      icon: Calendar,
      color: "bg-blue-600"
    },
    {
      id: 3,
      name: "Messages", 
      icon: MessageCircle,
      color: "bg-green-600"
    },
    {
      id: 4,
      name: "Gallery",
      icon: Image,
      color: "bg-purple-600"
    }
  ];

  const productivityApps = [
    {
      id: 1,
      name: "Advanced Notes",
      description: "A powerful note-taking app with markdown support and real-time collaboration.",
      icon: FileText,
      color: "bg-yellow-600",
      status: "installed"
    },
    {
      id: 2,
      name: "Calendar Pro",
      description: "Manage your schedule with advanced calendar features and integrations.",
      icon: Calendar,
      color: "bg-blue-600",
      status: "installed"
    },
    {
      id: 3,
      name: "Task Manager",
      description: "Organize your tasks with priorities, deadlines, and progress tracking.",
      icon: FileText,
      color: "bg-green-600",
      status: "available"
    },
    {
      id: 4,
      name: "Document Editor",
      description: "Create and edit documents with advanced formatting and templates.",
      icon: FileText,
      color: "bg-purple-600",
      status: "available"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0A] p-6">
      <div className="bg-[#121218] rounded-lg shadow-lg flex flex-col h-full border border-gray-800">
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">App Center</h1>
          <Button 
            variant="outline" 
            className="bg-[#0A0A0A] border-gray-700 text-white hover:bg-[#1A1A1A]"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Apps
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Recently Used Apps */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Recently Used Apps</h2>
            <div className="bg-[#0A0A0A] rounded-lg border border-gray-800 p-6">
              <div className="grid grid-cols-4 gap-6">
                {recentlyUsedApps.map((app) => {
                  const IconComponent = app.icon;
                  return (
                    <div 
                      key={app.id}
                      className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      <div className={`w-16 h-16 rounded-xl ${app.color} flex items-center justify-center`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-sm text-white text-center">{app.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Productivity Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Productivity</h2>
            <div className="grid grid-cols-2 gap-6">
              {productivityApps.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div 
                    key={app.id}
                    className="bg-[#0A0A0A] rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
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
                        {app.status === "installed" ? "Open" : "Install"}
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
      </div>
    </div>
  );
};

export default AppCenterPage;
