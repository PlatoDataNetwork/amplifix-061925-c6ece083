
import React from "react";
import { Shield } from "lucide-react";

interface EmailListProps {
  activeTab: string;
  selectedEmail: string | null;
  setSelectedEmail: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ 
  activeTab, 
  selectedEmail, 
  setSelectedEmail 
}) => {
  // Sample email data for demonstration
  const emails = [
    { 
      id: '1', 
      sender: 'Alice Secure', 
      subject: 'Protected Document Transfer', 
      preview: 'I\'ve attached the encrypted documents as requested...', 
      time: '10:23 AM',
      isRead: false,
      isEncrypted: true,
      folder: 'inbox'
    },
    { 
      id: '2', 
      sender: 'Security Team', 
      subject: 'Your encryption keys have been updated', 
      preview: 'We\'ve updated your encryption keys as part of our regular security protocol...', 
      time: 'Yesterday',
      isRead: true,
      isEncrypted: true,
      folder: 'inbox'
    },
    { 
      id: '3', 
      sender: 'Bob Cryptographer', 
      subject: 'New communication protocol', 
      preview: 'We\'re implementing a new secure communication protocol starting next week...', 
      time: 'Aug 24',
      isRead: true,
      isEncrypted: true,
      folder: 'inbox'
    },
    { 
      id: '4', 
      sender: 'Team Collaboration', 
      subject: 'Project Delta updates', 
      preview: 'Here are the latest updates on Project Delta with enhanced security measures...', 
      time: 'Aug 22',
      isRead: false,
      isEncrypted: true,
      folder: 'inbox'
    },
    { 
      id: '5', 
      sender: 'Charlie Tech', 
      subject: 'New authentication method', 
      preview: 'We\'re rolling out a new multi-factor authentication system for all users...', 
      time: 'Aug 20',
      isRead: true,
      isEncrypted: true,
      folder: 'inbox'
    },
    { 
      id: '6', 
      sender: 'Eve Analyzer', 
      subject: 'Security audit results', 
      preview: 'I\'ve completed the security audit and wanted to share the results...', 
      time: 'Aug 18',
      isRead: true, 
      isEncrypted: true,
      folder: 'sent'
    },
    { 
      id: '7', 
      sender: 'Frank Developer', 
      subject: 'API security implementation', 
      preview: 'Here\'s the documentation for the secure API implementation we discussed...', 
      time: 'Aug 15',
      isRead: true,
      isEncrypted: true,
      folder: 'sent'
    },
    { 
      id: '8', 
      sender: 'Grace Admin', 
      subject: 'System access protocols', 
      preview: 'Please review the updated system access protocols for our secure network...', 
      time: 'Aug 12',
      isRead: true,
      isEncrypted: true,
      folder: 'archive'
    }
  ];

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
          No messages in {activeTab}
        </div>
      )}
    </div>
  );
};

export default EmailList;
