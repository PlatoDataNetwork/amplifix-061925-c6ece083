
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { Shield, Zap, LockKeyhole, Star } from "lucide-react";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold">MoltenArc</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-[#8A3FFC] transition-colors">About</Link>
          <Link to="/" className="hover:text-[#8A3FFC] transition-colors">Features</Link>
          <Link to="/" className="hover:text-[#8A3FFC] transition-colors">Security</Link>
          <Link to="/" className="hover:text-[#8A3FFC] transition-colors">Pricing</Link>
          <Link to="/" className="hover:text-[#8A3FFC] transition-colors">Contact</Link>
          <Button variant="ghost" className="hover:text-[#8A3FFC] transition-colors">
            Sign In
          </Button>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity rounded-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-8">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-6 py-2 border border-[#8A3FFC]/20">
              Blockchain-Secured Communication
            </div>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Redefining Digital <br />
            <span className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent">
              Privacy
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            MoltenArc combines the power of blockchain encryption with familiar 
            interfaces to deliver secure and private communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity px-8 py-4 text-lg rounded-lg">
                Get Started Free →
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-white/10 transition-colors px-8 py-4 text-lg rounded-lg">
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Preview with softer glow */}
      <div className="container mx-auto py-16 relative">
        {/* Background glow effects */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8A3FFC]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-[#06B6D4]/20 rounded-full blur-3xl"></div>
        
        {/* Dashboard preview container */}
        <div className="relative bg-[#121218] rounded-2xl p-6 border border-gray-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
            <span className="ml-4 text-gray-400 text-sm">MoltenArc Dashboard</span>
          </div>
          <div className="bg-[#0A0A0A] rounded-xl p-8 min-h-[400px] relative overflow-hidden">
            {/* Side navigation */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <div className="bg-[#1E1E2F] rounded-lg h-12 w-full mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-[#1E1E2F] rounded-lg h-10 w-full"></div>
                  <div className="bg-[#1E1E2F] rounded-lg h-10 w-full"></div>
                  <div className="bg-[#1E1E2F] rounded-lg h-10 w-full"></div>
                  <div className="bg-[#1E1E2F] rounded-lg h-10 w-full"></div>
                </div>
              </div>
              
              {/* Main content area */}
              <div className="col-span-9">
                <div className="bg-[#1E1E2F] rounded-lg h-12 w-full mb-6"></div>
                
                <div className="space-y-5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#8A3FFC]/40"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-[#1E1E2F] rounded-lg w-1/4 mb-2"></div>
                        <div className="h-2 bg-[#1E1E2F] rounded-lg w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Inner glow effects */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#8A3FFC]/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#06B6D4]/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="mb-4 w-12 h-12 rounded-lg bg-[#8A3FFC]/20 flex items-center justify-center">
              <LockKeyhole className="h-6 w-6 text-[#8A3FFC]" />
            </div>
            <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
            <p className="text-gray-400">
              Every message is encrypted using advanced blockchain cryptography, ensuring only
              the intended recipient can access your communications.
            </p>
            <Button variant="link" className="text-[#8A3FFC] mt-4 p-0">
              Learn more →
            </Button>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="mb-4 w-12 h-12 rounded-lg bg-[#8A3FFC]/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-[#8A3FFC]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Blockchain Security</h3>
            <p className="text-gray-400">
              Messages are secured and verified through the Solana or Arbitrum blockchain
              networks, preventing tampering and unauthorized access.
            </p>
            <Button variant="link" className="text-[#8A3FFC] mt-4 p-0">
              Learn more →
            </Button>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="mb-4 w-12 h-12 rounded-lg bg-[#8A3FFC]/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-[#8A3FFC]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Experience rapid message delivery with the speed of modern blockchain technology
              while maintaining complete security.
            </p>
            <Button variant="link" className="text-[#8A3FFC] mt-4 p-0">
              Learn more →
            </Button>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="mb-4 w-12 h-12 rounded-lg bg-[#8A3FFC]/20 flex items-center justify-center">
              <Star className="h-6 w-6 text-[#8A3FFC]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Familiar Interface</h3>
            <p className="text-gray-400">
              Enjoy the security of blockchain with the intuitive design of traditional email clients
              like Gmail and Apple Mail.
            </p>
            <Button variant="link" className="text-[#8A3FFC] mt-4 p-0">
              Learn more →
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="text-4xl font-bold text-[#06B6D4]">256-bit</div>
            <div className="text-gray-400">Military-Grade Encryption</div>
          </div>
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="text-4xl font-bold text-[#06B6D4]">24/7</div>
            <div className="text-gray-400">Secure Server Protection</div>
          </div>
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="text-4xl font-bold text-[#06B6D4]">30+</div>
            <div className="text-gray-400">Security Features</div>
          </div>
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="text-4xl font-bold text-[#06B6D4]">Zero</div>
            <div className="text-gray-400">Data Breaches</div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="container mx-auto py-16">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6">Military-Grade Security<br />For Your Communications</h2>
            <p className="text-gray-300 mb-8">
              MoltenArc leverages blockchain technology to provide unprecedented levels of
              security and privacy for your sensitive communications.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#8A3FFC] flex items-center justify-center mr-3">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Blockchain-verified message authenticity</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#8A3FFC] flex items-center justify-center mr-3">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Immutable record of communication history</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#8A3FFC] flex items-center justify-center mr-3">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Cross-chain compatibility (Solana & Arbitrum)</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="w-64 h-64 bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] rounded-full blur-3xl opacity-30 absolute -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-64 h-64 rounded-full border-4 border-[#8A3FFC]/30 p-3">
              <div className="w-full h-full rounded-full border-4 border-[#06B6D4]/30 p-3">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-[#8A3FFC]/40 to-[#06B6D4]/40 flex items-center justify-center">
                  <Shield className="h-20 w-20 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      <Toaster />
    </div>
  );
};

export default Index;
