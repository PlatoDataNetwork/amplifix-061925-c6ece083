
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Mail, Clock, Phone, Search, HelpCircle, Book, Users } from "lucide-react";
import Footer from "@/components/Footer";

const Support = () => {
  const faqs = [
    {
      question: "How do I get started with MoltenArc?",
      answer: "Getting started is easy! Simply create an account, verify your email, connect your Solana or Arbitrum wallet, and you're ready to send secure messages."
    },
    {
      question: "Is my data really secure on the blockchain?",
      answer: "Yes! All messages are end-to-end encrypted and verified on the blockchain. Your data is never stored in plain text, and only you and your recipient can decrypt the messages."
    },
    {
      question: "Which blockchains does MoltenArc support?",
      answer: "Currently, we support Solana and Arbitrum networks. We're constantly evaluating new blockchain networks to expand our supported platforms."
    },
    {
      question: "Can I use MoltenArc without a crypto wallet?",
      answer: "While blockchain verification requires a wallet, you can still use basic messaging features with just an email account. However, for full security benefits, we recommend connecting a wallet."
    },
    {
      question: "What's the difference between free and paid plans?",
      answer: "Free plans include basic messaging with monthly limits, while paid plans offer unlimited messages, advanced features, priority support, and custom domains."
    }
  ];

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@moltenarc.com",
      responseTime: "Within 24 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us in real-time",
      contact: "Available 24/7",
      responseTime: "Immediate response"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      responseTime: "Business hours only"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <nav className="container mx-auto flex items-center justify-between py-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-bold">MoltenArc Support</h1>
        </div>
      </nav>

      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-6 py-2 border border-[#8A3FFC]/20">
              24/7 Support
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            We're Here to <span className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent">Help</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get the assistance you need with our comprehensive support resources and dedicated team.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for help articles, guides, or FAQs..."
                className="w-full bg-[#121218] border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-lg focus:border-[#8A3FFC] focus:outline-none"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800 text-center hover:border-[#8A3FFC]/30 transition-colors cursor-pointer">
              <Book className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Documentation</h3>
              <p className="text-gray-400 text-sm">Complete guides and tutorials</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800 text-center hover:border-[#8A3FFC]/30 transition-colors cursor-pointer">
              <HelpCircle className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">FAQ</h3>
              <p className="text-gray-400 text-sm">Frequently asked questions</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800 text-center hover:border-[#8A3FFC]/30 transition-colors cursor-pointer">
              <MessageCircle className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm">Chat with support team</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800 text-center hover:border-[#8A3FFC]/30 transition-colors cursor-pointer">
              <Users className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Community</h3>
              <p className="text-gray-400 text-sm">Join our Discord server</p>
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-[#121218] p-8 rounded-xl border border-gray-800">
                <channel.icon className="h-12 w-12 text-[#8A3FFC] mb-4" />
                <h3 className="text-xl font-bold mb-2">{channel.title}</h3>
                <p className="text-gray-400 mb-4">{channel.description}</p>
                <p className="text-white font-medium mb-2">{channel.contact}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{channel.responseTime}</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">
                  Contact Now
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#121218] p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-[#8A3FFC]" />
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline">View All FAQs</Button>
          </div>
        </section>

        {/* Status & Updates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">System Status</h2>
          <div className="bg-[#121218] p-8 rounded-xl border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h3 className="font-bold mb-1">API Services</h3>
                <p className="text-green-400 text-sm">Operational</p>
              </div>
              
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h3 className="font-bold mb-1">Blockchain Network</h3>
                <p className="text-green-400 text-sm">Operational</p>
              </div>
              
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h3 className="font-bold mb-1">Message Delivery</h3>
                <p className="text-green-400 text-sm">Operational</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button variant="link" className="text-[#8A3FFC]">
                View Detailed Status →
              </Button>
            </div>
          </div>
        </section>

        {/* Emergency Support */}
        <section>
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-8 rounded-xl border border-red-500/20 text-center">
            <h2 className="text-2xl font-bold mb-4">Emergency Support</h2>
            <p className="text-gray-300 mb-6">
              If you're experiencing a security issue or urgent problem that requires immediate attention, 
              please contact our emergency support line.
            </p>
            <Button className="bg-red-600 hover:bg-red-700">
              Emergency Contact: +1 (555) 911-HELP
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
