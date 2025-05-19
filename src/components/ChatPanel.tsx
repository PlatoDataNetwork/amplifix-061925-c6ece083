
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import MoltenShieldIcon from "@/components/MoltenShieldIcon";
import { Link } from "react-router-dom";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Colorful Guard Icon component - kept for reference
const ColorfulGuardIcon = ({ className = "h-5 w-5" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield shape */}
      <path 
        d="M12 2L3 7V13C3 17.9706 7.02944 22 12 22C16.9706 22 21 17.9706 21 13V7L12 2Z" 
        fill="url(#guardGradient)"
        stroke="#9b87f5"
        strokeWidth="1.5"
      />
      
      {/* Lock symbol */}
      <path 
        d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" 
        fill="white" 
      />
      <path 
        d="M9 14H15V18H9V14Z" 
        fill="white" 
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="guardGradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9b87f5" />
          <stop offset="100%" stopColor="#6E59A5" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Welcome to MoltenArc's encrypted chat. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Simulate encryption notification
    toast({
      title: "Encrypted Message",
      description: "Your message has been securely encrypted.",
    });

    // Simulate processing time for encryption
    setTimeout(() => {
      // Add assistant response after a short delay
      const assistantMessage: Message = {
        content: generateResponse(input),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  // Simple response generator
  const generateResponse = (query: string): string => {
    const responses = [
      "Your encrypted message has been received. I'm processing your request securely.",
      "Thanks for using our secure communication channel. Your privacy is our priority.",
      "I've analyzed your encrypted message. Is there anything specific you need assistance with?",
      "Your message was securely transmitted through our military-grade encryption layer.",
      `I understand you're asking about "${query.substring(0, 20)}...". Let me process that securely.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 w-[380px] bg-[#1A1F2C] border-r border-gray-700 shadow-xl transition-transform duration-300 ease-in-out z-30 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-[-100%]'
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <MoltenShieldIcon className="h-5 w-5 mr-2" />
          <h2 className="font-semibold">Encrypted Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Go to homepage</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  message.sender === 'user' 
                    ? 'bg-[#9b87f5] text-white rounded-tr-none' 
                    : 'bg-[#252A38] text-white rounded-tl-none'
                }`}
              >
                {message.content}
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 bg-[#1E2230]">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your secure message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="bg-[#252A38] border-gray-700 text-white"
          />
          <Button 
            onClick={handleSend} 
            className="bg-[#9b87f5] hover:bg-[#7E69AB] p-2 h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-400">
          <MoltenShieldIcon className="h-3 w-3 mr-1" letter="" />
          End-to-end encrypted messaging
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
