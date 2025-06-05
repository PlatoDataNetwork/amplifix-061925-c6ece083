
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Key, Globe, Database, Lock, Zap } from "lucide-react";
import Footer from "@/components/Footer";

const API = () => {
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
          <h1 className="text-xl font-bold">MoltenArc API</h1>
        </div>
      </nav>

      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-6 py-2 border border-[#8A3FFC]/20">
              Powerful API
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            MoltenArc <span className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent">API</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Integrate blockchain-secured messaging into your applications with our comprehensive REST API.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">Get API Key</Button>
            <Button variant="outline">View Examples</Button>
          </div>
        </div>

        {/* API Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">API Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <Lock className="h-12 w-12 text-[#8A3FFC] mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
              <p className="text-gray-400">OAuth 2.0 and API key authentication with blockchain verification.</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <Zap className="h-12 w-12 text-[#8A3FFC] mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Events</h3>
              <p className="text-gray-400">WebSocket connections for instant message delivery and status updates.</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <Globe className="h-12 w-12 text-[#8A3FFC] mb-4" />
              <h3 className="text-xl font-bold mb-2">Global CDN</h3>
              <p className="text-gray-400">Low-latency API endpoints deployed across multiple regions worldwide.</p>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">API Endpoints</h2>
          <div className="space-y-6">
            {/* Messages Endpoint */}
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Messages</h3>
                <span className="bg-[#8A3FFC]/20 text-[#8A3FFC] px-3 py-1 rounded-full text-sm">v1</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-gray-300">/api/v1/messages</code>
                  <span className="text-gray-400">Send encrypted message</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-gray-300">/api/v1/messages</code>
                  <span className="text-gray-400">Retrieve messages</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-mono">DELETE</span>
                  <code className="text-gray-300">/api/v1/messages/:id</code>
                  <span className="text-gray-400">Delete message</span>
                </div>
              </div>
            </div>

            {/* Contacts Endpoint */}
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Contacts</h3>
                <span className="bg-[#8A3FFC]/20 text-[#8A3FFC] px-3 py-1 rounded-full text-sm">v1</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-gray-300">/api/v1/contacts</code>
                  <span className="text-gray-400">Add contact</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-gray-300">/api/v1/contacts</code>
                  <span className="text-gray-400">List contacts</span>
                </div>
              </div>
            </div>

            {/* Blockchain Endpoint */}
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Blockchain</h3>
                <span className="bg-[#8A3FFC]/20 text-[#8A3FFC] px-3 py-1 rounded-full text-sm">v1</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-gray-300">/api/v1/blockchain/verify/:hash</code>
                  <span className="text-gray-400">Verify message on blockchain</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-gray-300">/api/v1/blockchain/status</code>
                  <span className="text-gray-400">Check blockchain status</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Quick Start Example</h2>
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Send a Message</h3>
              <div className="flex gap-2">
                <span className="text-sm text-gray-400">JavaScript</span>
                <Code className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <pre className="bg-[#0A0A0A] p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-gray-300">{`const response = await fetch('https://api.moltenarc.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: 'user@example.com',
    content: 'Hello from MoltenArc!',
    encryption: 'blockchain'
  })
});

const result = await response.json();
console.log('Message sent:', result.messageId);`}</code>
            </pre>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Rate Limits & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Free Tier</h3>
              <div className="text-3xl font-bold text-[#8A3FFC] mb-2">100</div>
              <p className="text-gray-400 mb-4">requests per hour</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Basic endpoints access</li>
                <li>• Standard rate limiting</li>
                <li>• Community support</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-b from-[#8A3FFC]/10 to-[#06B6D4]/10 p-6 rounded-xl border border-[#8A3FFC]/30">
              <h3 className="text-xl font-bold mb-4">Pro Tier</h3>
              <div className="text-3xl font-bold text-[#8A3FFC] mb-2">10K</div>
              <p className="text-gray-400 mb-4">requests per hour</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• All endpoints access</li>
                <li>• Higher rate limits</li>
                <li>• Priority support</li>
                <li>• Webhook notifications</li>
              </ul>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Enterprise</h3>
              <div className="text-3xl font-bold text-[#8A3FFC] mb-2">Custom</div>
              <p className="text-gray-400 mb-4">unlimited requests</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Custom rate limits</li>
                <li>• Dedicated support</li>
                <li>• Custom integrations</li>
                <li>• SLA guarantees</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default API;
