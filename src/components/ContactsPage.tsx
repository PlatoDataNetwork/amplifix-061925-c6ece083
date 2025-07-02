
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Mail, Phone, MoreHorizontal, Star } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  initial: string;
  starred: boolean;
}

const ContactsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const contacts: Contact[] = [
    { id: "1", name: "Alex Johnson", email: "alex@moltenarc.com", phone: "+1 (555) 123-4567", initial: "A", starred: true },
    { id: "2", name: "Taylor Swift", email: "taylor@moltenarc.com", phone: "+1 (555) 987-6543", initial: "T", starred: false },
    { id: "3", name: "Morgan Freeman", email: "morgan@moltenarc.com", phone: "+1 (555) 246-8102", initial: "M", starred: true },
    { id: "4", name: "Zoe Williams", email: "zoe@moltenarc.com", phone: "+1 (555) 135-7924", initial: "Z", starred: false },
    { id: "5", name: "James Cameron", email: "james@moltenarc.com", phone: "+1 (555) 680-1357", initial: "J", starred: false },
    { id: "6", name: "Emma Watson", email: "emma@moltenarc.com", phone: "+1 (555) 741-9632", initial: "E", starred: true },
    { id: "7", name: "Chris Evans", email: "chris@moltenarc.com", phone: "+1 (555) 852-7410", initial: "C", starred: false },
    { id: "8", name: "Natalie Portman", email: "natalie@moltenarc.com", phone: "+1 (555) 963-1470", initial: "N", starred: true },
    { id: "9", name: "Ryan Gosling", email: "ryan@moltenarc.com", phone: "+1 (555) 147-2580", initial: "R", starred: false },
    { id: "10", name: "Scarlett Johansson", email: "scarlett@moltenarc.com", phone: "+1 (555) 258-3690", initial: "S", starred: false },
    { id: "11", name: "Leonardo DiCaprio", email: "leonardo@moltenarc.com", phone: "+1 (555) 369-4710", initial: "L", starred: true },
    { id: "12", name: "Jennifer Lawrence", email: "jennifer@moltenarc.com", phone: "+1 (555) 741-5820", initial: "J", starred: false },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] p-6 overflow-hidden">
      <div className="bg-[#121218] rounded-lg shadow-lg flex flex-col h-full border border-gray-800">
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#0A0A0A] border-gray-800 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-[#0A0A0A] border border-gray-800 rounded-lg p-4 hover:border-[#8A3FFC]/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{contact.initial}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {contact.starred && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">{contact.name}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <Mail className="h-3 w-3 mr-2" />
                    {contact.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Phone className="h-3 w-3 mr-2" />
                    {contact.phone}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-gray-700"
                    onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-gray-700"
                    onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
