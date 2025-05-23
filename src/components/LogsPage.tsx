
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const LogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const logEntries = [
    {
      id: "1",
      timestamp: "2025-05-23 14:04:25",
      level: "info",
      message: "User authenticated successfully",
      category: "Auth",
      details: "User ID: 12345\nSession Token: 67890abcdef\nIP: 192.168.1.1"
    },
    {
      id: "2",
      timestamp: "2025-05-23 14:01:25",
      level: "warning",
      message: "High memory usage detected",
      category: "System",
      details: "Memory usage: 85%\nThreshold: 80%\nRecommended action: Scale up resources"
    },
    {
      id: "3",
      timestamp: "2025-05-23 13:56:25",
      level: "error",
      message: "Database connection failed",
      category: "Database",
      details: "Connection string: postgres://localhost:5432\nError code: ECONNREFUSED\nRetry attempts: 3"
    },
    {
      id: "4",
      timestamp: "2025-05-23 13:51:25",
      level: "success",
      message: "Backup completed successfully",
      category: "Backup",
      details: "Backup size: 2.4 GB\nDuration: 15 minutes\nLocation: /backups/2025-05-23/"
    },
    {
      id: "5",
      timestamp: "2025-05-23 13:36:25",
      level: "info",
      message: "Scheduled maintenance started",
      category: "System",
      details: "Maintenance window: 13:30-14:00\nAffected services: Database, API\nExpected downtime: 30 minutes"
    },
    {
      id: "6",
      timestamp: "2025-05-23 13:06:25",
      level: "warning",
      message: "API rate limit approaching threshold",
      category: "API",
      details: "Current rate: 950 requests/minute\nLimit: 1000 requests/minute\nClient IP: 203.0.113.1"
    },
    {
      id: "7",
      timestamp: "2025-05-23 12:06:25",
      level: "error",
      message: "Payment processing failed",
      category: "Payments",
      details: "Transaction ID: tx_1234567890\nAmount: $99.99\nError: Card declined"
    }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "text-blue-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0A] p-6">
      <div className="bg-[#121218] rounded-lg shadow-lg flex flex-col h-full border border-gray-800">
        {/* Header */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">System Logs</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              Last updated: 14:06:25
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0A0A0A] border-gray-800 text-white"
              />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded-md text-white"
            >
              <option value="All Levels">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
            <Button variant="outline" size="sm" className="border-gray-800">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="border-gray-800">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Log Entries with Accordion */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Log Entries ({logEntries.length})</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-400">Security Verified</span>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="space-y-2">
            {logEntries.map((entry) => (
              <AccordionItem 
                key={entry.id} 
                value={entry.id}
                className="border border-gray-800 rounded-lg bg-[#0A0A0A] data-[state=open]:bg-[#1A1A1A]"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {getLogIcon(entry.level)}
                      <span className="text-sm text-gray-400">{entry.timestamp}</span>
                      <span className={`text-sm font-medium ${getLogLevelColor(entry.level)}`}>
                        {entry.message}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {entry.category}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="bg-[#0F0F0F] rounded-md p-3 border border-gray-800">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {entry.details}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
