
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Upload, 
  Folder, 
  Download, 
  Share, 
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Music,
  Archive
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  fileType?: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'text';
}

const CloudDrivePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data matching the reference image
  const files: FileItem[] = [
    { id: '1', name: 'Documents', type: 'folder', modified: '2 days ago' },
    { id: '2', name: 'Images', type: 'folder', modified: '1 week ago' },
    { id: '3', name: 'Videos', type: 'folder', modified: '3 days ago' },
    { id: '4', name: 'Project Files', type: 'folder', modified: '5 days ago' },
    { id: '5', name: 'profile_picture.jpg', type: 'file', size: '2.4 MB', modified: '2 days ago', fileType: 'image' },
    { id: '6', name: 'presentation.pdf', type: 'file', size: '4.7 MB', modified: '1 week ago', fileType: 'document' },
    { id: '7', name: 'meeting_notes.docx', type: 'file', size: '1.2 MB', modified: 'Yesterday', fileType: 'document' },
    { id: '8', name: 'product_demo.mp4', type: 'file', size: '156 MB', modified: '3 days ago', fileType: 'video' },
    { id: '9', name: 'audio_sample.mp3', type: 'file', size: '3.8 MB', modified: '5 days ago', fileType: 'audio' },
    { id: '10', name: 'backup_data.zip', type: 'file', size: '89 MB', modified: '1 week ago', fileType: 'archive' },
    { id: '11', name: 'research_notes.txt', type: 'file', size: '45 KB', modified: '3 days ago', fileType: 'text' },
    { id: '12', name: 'team_photo.png', type: 'file', size: '8.2 MB', modified: '5 days ago', fileType: 'image' },
  ];

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return <Folder className="h-8 w-8 text-[#8A3FFC]" />;
    }
    
    switch (item.fileType) {
      case 'document':
        return <FileText className="h-8 w-8 text-yellow-500" />;
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'audio':
        return <Music className="h-8 w-8 text-green-500" />;
      case 'archive':
        return <Archive className="h-8 w-8 text-gray-500" />;
      case 'text':
        return <FileText className="h-8 w-8 text-orange-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Cloud Drive</h1>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-700 text-white hover:bg-[#1A1A1A]"
            >
              <Folder className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1A1A1A] border-gray-800 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* File Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((item) => (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger>
                <Card className="bg-transparent border-gray-800 hover:bg-[#202026] transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(item)}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-white truncate">{item.name}</h3>
                          <p className="text-sm text-gray-400">
                            {item.type === 'folder' ? 'Folder' : item.size}
                          </p>
                          <p className="text-xs text-gray-500">Modified {item.modified}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-[#1A1A1A] border-gray-800">
                <ContextMenuItem className="text-white hover:bg-[#2A2A2A]">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </ContextMenuItem>
                <ContextMenuItem className="text-white hover:bg-[#2A2A2A]">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </ContextMenuItem>
                <ContextMenuItem className="text-white hover:bg-[#2A2A2A]">
                  Rename
                </ContextMenuItem>
                <ContextMenuItem className="text-red-400 hover:bg-[#2A2A2A]">
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No files found</div>
            <div className="text-sm text-gray-500">Try adjusting your search query</div>
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="p-6 border-t border-gray-800">
        <div className="bg-transparent rounded-lg p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Storage Used</span>
            <span className="text-sm bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent font-medium">
              45.2 GB / 100 GB
            </span>
          </div>
          <div className="w-full bg-[#0A0A0A] rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]" 
              style={{ width: '45%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudDrivePage;
