
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Book, Code, Shield, Zap, FileText, Download } from "lucide-react";
import Footer from "@/components/Footer";

const Documentation = () => {
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
          <h1 className="text-xl font-bold">MoltenArc Documentation</h1>
        </div>
      </nav>

      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-6 py-2 border border-[#8A3FFC]/20">
              Complete Documentation
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Learn <span className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent">MoltenArc</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive guides, tutorials, and references to help you master blockchain-secured communications.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-[#8A3FFC]/20 flex items-center justify-center mb-4">
                <span className="text-[#8A3FFC] font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Account</h3>
              <p className="text-gray-400 mb-4">Sign up and verify your email to get started with secure messaging.</p>
              <Button variant="link" className="text-[#8A3FFC] p-0">Learn more →</Button>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-[#8A3FFC]/20 flex items-center justify-center mb-4">
                <span className="text-[#8A3FFC] font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
              <p className="text-gray-400 mb-4">Link your Solana or Arbitrum wallet for blockchain verification.</p>
              <Button variant="link" className="text-[#8A3FFC] p-0">Learn more →</Button>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-[#8A3FFC]/20 flex items-center justify-center mb-4">
                <span className="text-[#8A3FFC] font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Send Messages</h3>
              <p className="text-gray-400 mb-4">Start sending encrypted messages with full blockchain security.</p>
              <Button variant="link" className="text-[#8A3FFC] p-0">Learn more →</Button>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Documentation Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <Book className="h-12 w-12 text-[#8A3FFC] mb-4" />
              <h3 className="text-xl font-bold mb-2">User Guide</h3>
              <p className="text-gray-400 mb-4">Complete walkthrough of MoltenArc features and functionality.</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Account setup and verification</li>
                <li>• Wallet integration</li>
                <li>• Message encryption</li>
                <li>• Contact management</li>
              </ul>
              <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">View Guide</Button>
            </div>

            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <Code className="h-12 w-12 text-[#8A3FFC] mb-4" />
              <h3 className="text-xl font-bold mb-2">Developer Docs</h3>
              <p className="text-gray-400 mb-4">Technical documentation for developers and integrators.</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• API endpoints</li>
                <li>• SDK documentation</li>
                <li>• Code examples</li>
                <li>• Integration guides</li>
              </ul>
              <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">View Docs</Button>
            </div>

            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <Shield className="h-12 w-12 text-[#8A3FFC] mb-4" />
              <h3 className="text-xl font-bold mb-2">Security Guide</h3>
              <p className="text-gray-400 mb-4">Understanding MoltenArc's security features and best practices.</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Encryption methods</li>
                <li>• Blockchain verification</li>
                <li>• Security best practices</li>
                <li>• Threat protection</li>
              </ul>
              <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">View Security</Button>
            </div>

            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <Zap className="h-12 w-12 text-[#8A3FFC] mb-4" />
              <h3 className="text-xl font-bold mb-2">Tutorials</h3>
              <p className="text-gray-400 mb-4">Step-by-step tutorials for common tasks and advanced features.</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Setting up 2FA</li>
                <li>• Group messaging</li>
                <li>• File sharing</li>
                <li>• Advanced settings</li>
              </ul>
              <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">View Tutorials</Button>
            </div>
          </div>
        </section>

        {/* Downloads */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Downloads & Resources</h2>
          <div className="bg-[#121218] p-8 rounded-xl border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Download className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">SDK Package</h3>
                <p className="text-gray-400 mb-4">Complete SDK for developers</p>
                <Button variant="outline">Download SDK</Button>
              </div>
              
              <div className="text-center">
                <FileText className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">PDF Guides</h3>
                <p className="text-gray-400 mb-4">Offline documentation</p>
                <Button variant="outline">Download PDFs</Button>
              </div>
              
              <div className="text-center">
                <Code className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Code Examples</h3>
                <p className="text-gray-400 mb-4">Sample implementations</p>
                <Button variant="outline">View GitHub</Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Documentation;
