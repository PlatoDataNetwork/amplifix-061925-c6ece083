
import React from "react";
import { Button } from "@/components/ui/button";
import { Reply, Forward, Trash, Archive, Shield } from "lucide-react";
import { Email, EmailActions } from "@/types/dashboard";

interface EmailContentProps {
  selectedEmail: string | null;
  emails: Email[];
  emailActions: EmailActions;
}

const EmailContent: React.FC<EmailContentProps> = ({ selectedEmail, emails, emailActions }) => {

  const email = emails.find(e => e.id === selectedEmail);

  if (!selectedEmail || !email) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        {emailActions.select_email_message}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Email Actions */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
          >
            <Reply className="h-4 w-4 mr-1" />
            {emailActions.reply}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
          >
            <Forward className="h-4 w-4 mr-1" />
            {emailActions.forward}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-3">{email.subject}</h1>
          <div className="flex items-start mb-4">
            <div className="bg-[#2A2F3C] h-10 w-10 rounded-full flex items-center justify-center text-lg font-medium mr-3">
              {email.sender.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="font-medium">{email.sender}</div>
                {email.isEncrypted && (
                  <div className="flex items-center text-xs bg-green-900 text-green-200 px-2 py-0.5 rounded">
                    <Shield className="h-3 w-3 mr-1" />
                    {emailActions.encrypted_badge}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400">
                <span>To: {email.to}</span>
                <span className="mx-2">•</span>
                <span>{email.date}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Body */}
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: email.body }} />
        </div>
      </div>
    </div>
  );
};

export default EmailContent;
