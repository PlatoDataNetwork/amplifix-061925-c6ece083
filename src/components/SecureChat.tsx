
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Shield, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const SecureChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Welcome to MoltenArc's encrypted chat. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-5 right-5 h-12 w-12 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#61dafb] hover:opacity-90 shadow-lg p-0 flex items-center justify-center z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:w-[380px] h-full border border-gray-700 bg-[#1A1F2C] overflow-hidden flex flex-col" side="right">
        <SheetHeader className="border-b border-gray-700 p-4">
          <SheetTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 text-[#9b87f5] mr-2" />
            Encrypted Chat
          </SheetTitle>
        </SheetHeader>
        
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
            <Shield className="h-3 w-3 mr-1" />
            End-to-end encrypted messaging
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SecureChat;
