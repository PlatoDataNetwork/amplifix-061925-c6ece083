
import React from "react";
import { Shield } from "lucide-react";
import { Email } from "@/types/dashboard";

interface EmailListProps {
  activeTab: string;
  selectedEmail: string | null;
  setSelectedEmail: (id: string) => void;
  emails: Email[];
  emptyMessage: string;
}

const EmailList: React.FC<EmailListProps> = ({ 
  activeTab, 
  selectedEmail, 
  setSelectedEmail,
  emails,
  emptyMessage
}) => {

  // Filter emails based on active tab
  const filteredEmails = emails.filter(email => email.folder === activeTab);

  return (
    <div className="divide-y divide-gray-700">
      {filteredEmails.map((email) => (
        <div 
          key={email.id}
          className={`p-3 cursor-pointer hover:bg-[#2A2F3C] ${
            selectedEmail === email.id ? 'bg-[#2A2F3C]' : ''
          } ${!email.isRead ? 'font-semibold' : ''}`}
          onClick={() => setSelectedEmail(email.id)}
        >
          <div className="flex justify-between items-start mb-1">
            <div className={`${!email.isRead ? 'text-white' : 'text-gray-300'}`}>
              {email.sender}
            </div>
            <div className="text-xs text-gray-400">{email.time}</div>
          </div>
          <div className="mb-1 flex items-center">
            {email.isEncrypted && (
              <Shield className="h-3 w-3 text-green-500 mr-1" />
            )}
            <div className={`${!email.isRead ? 'text-white' : 'text-gray-300'}`}>
              {email.subject}
            </div>
          </div>
          <div className="text-sm text-gray-400 truncate">{email.preview}</div>
        </div>
      ))}
      {filteredEmails.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          {emptyMessage} {activeTab}
        </div>
      )}
    </div>
  );
};

export default EmailList;
