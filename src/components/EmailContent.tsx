
import React from "react";
import { Button } from "@/components/ui/button";
import { Reply, Forward, Trash, Archive, Shield } from "lucide-react";

interface EmailContentProps {
  selectedEmail: string | null;
}

const EmailContent: React.FC<EmailContentProps> = ({ selectedEmail }) => {
  // Sample email data for demonstration
  const emails = [
    {
      id: '1',
      sender: 'Alice Secure <alice@securemail.com>',
      to: 'you@secureflowmail.com',
      subject: 'Protected Document Transfer',
      date: 'August 28, 2025 at 10:23 AM',
      body: `<p>Hello,</p>
             <p>I've attached the encrypted documents as requested. These have been secured with our standard AES-256 encryption protocol.</p>
             <p>The password will be sent via our secure messaging channel as discussed.</p>
             <p>Please confirm receipt when you've successfully decrypted the files.</p>
             <p>Best regards,<br>Alice</p>`,
      isEncrypted: true
    },
    {
      id: '2',
      sender: 'Security Team <security@secureflowmail.com>',
      to: 'you@secureflowmail.com',
      subject: 'Your encryption keys have been updated',
      date: 'August 27, 2025 at 3:45 PM',
      body: `<p>Dear User,</p>
             <p>We've updated your encryption keys as part of our regular security protocol. This is an automatic process that happens every 30 days to ensure maximum security of your communications.</p>
             <p>Your new public key fingerprint is: E7CC 9B5E 8F19 2A67 D90C 5A39 D817 3312 F5EC D98A</p>
             <p>All your previous messages remain accessible with your existing credentials.</p>
             <p>If you notice any issues, please contact our support team immediately.</p>
             <p>Regards,<br>SecureFlowMail Security Team</p>`,
      isEncrypted: true
    },
    // Add more emails as needed for other IDs
  ];

  const email = emails.find(e => e.id === selectedEmail);

  if (!selectedEmail || !email) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select an email to view its contents
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
            Reply
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
          >
            <Forward className="h-4 w-4 mr-1" />
            Forward
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
                    Encrypted
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
