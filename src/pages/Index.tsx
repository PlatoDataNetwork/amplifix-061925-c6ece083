
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { Shield, Zap, LockKeyhole, Star, CheckCircle, Users, Globe, Award } from "lucide-react";
import Footer from "@/components/Footer";
import SignUpModal from "@/components/SignUpModal";
import SignInModal from "@/components/SignInModal";
import { useState } from "react";

const Index = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

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
          <a href="#about" className="hover:text-[#8A3FFC] transition-colors">About</a>
          <a href="#features" className="hover:text-[#8A3FFC] transition-colors">Features</a>
          <a href="#security" className="hover:text-[#8A3FFC] transition-colors">Security</a>
          <a href="#pricing" className="hover:text-[#8A3FFC] transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-[#8A3FFC] transition-colors">Contact</a>
          <Button 
            variant="ghost" 
            onClick={handleSignInClick}
            className="hover:text-[#8A3FFC] transition-colors"
          >
            Sign In
          </Button>
          <Button 
            onClick={handleGetStartedClick}
            className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity rounded-lg"
          >
            Get Started
          </Button>
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
            <Button 
              size="lg" 
              onClick={handleGetStartedClick}
              className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity px-8 py-4 text-lg rounded-lg"
            >
              Get Started Free →
            </Button>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-white/10 transition-colors px-8 py-4 text-lg rounded-lg">
                Try Demo
              </Button>
            </Link>
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

      {/* About Section */}
      <section id="about" className="container mx-auto py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">About MoltenArc</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Born from the need for truly secure digital communications, MoltenArc represents 
            the next evolution in private messaging. We believe privacy is a fundamental right, 
            not a privilege.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800 text-center">
            <Users className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-gray-400">
              Democratizing secure communications through cutting-edge blockchain technology.
            </p>
          </div>
          
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800 text-center">
            <Globe className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Global Reach</h3>
            <p className="text-gray-400">
              Serving users worldwide with decentralized, censorship-resistant communication.
            </p>
          </div>
          
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800 text-center">
            <Award className="h-12 w-12 text-[#8A3FFC] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Innovation</h3>
            <p className="text-gray-400">
              Pioneering the future of digital privacy with advanced cryptographic solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Powerful Features</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the perfect blend of security, speed, and simplicity with our comprehensive feature set.
          </p>
        </div>
        
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
      </section>

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
      <section id="security" className="container mx-auto py-16">
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
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <span>Blockchain-verified message authenticity</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#8A3FFC] flex items-center justify-center mr-3">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <span>Immutable record of communication history</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#8A3FFC] flex items-center justify-center mr-3">
                  <CheckCircle className="h-3 w-3 text-white" />
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
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core security features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-[#121218] p-8 rounded-xl border border-gray-800">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Up to 100 messages/month</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Basic support</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" onClick={handleGetStartedClick}>Get Started</Button>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-[#8A3FFC]/10 to-[#06B6D4]/10 p-8 rounded-xl border border-[#8A3FFC]/30 relative">
            <div className="absolute top-4 right-4 bg-[#8A3FFC] text-white px-3 py-1 rounded-full text-sm">Popular</div>
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Unlimited messages</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Advanced encryption</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Custom domains</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]" onClick={handleGetStartedClick}>Get Started</Button>
          </div>
          
          {/* Enterprise Plan */}
          <div className="bg-[#121218] p-8 rounded-xl border border-gray-800">
            <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#8A3FFC] mr-2" />
                <span>SLA guarantees</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about MoltenArc? We're here to help you secure your communications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Form */}
          <div className="bg-[#121218] p-8 rounded-xl border border-gray-800">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#8A3FFC] focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#8A3FFC] focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#8A3FFC] focus:outline-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <h4 className="text-lg font-bold mb-2">Email Support</h4>
              <p className="text-gray-400 mb-2">Get help from our support team</p>
              <p className="text-[#8A3FFC]">support@moltenarc.com</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <h4 className="text-lg font-bold mb-2">Sales Inquiries</h4>
              <p className="text-gray-400 mb-2">Questions about enterprise plans</p>
              <p className="text-[#8A3FFC]">sales@moltenarc.com</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <h4 className="text-lg font-bold mb-2">Business Hours</h4>
              <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM (UTC)</p>
              <p className="text-gray-400">Weekend: Emergency support only</p>
            </div>
            
            <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
              <h4 className="text-lg font-bold mb-2">Community</h4>
              <p className="text-gray-400 mb-4">Join our community for discussions and updates</p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">Discord</Button>
                <Button variant="outline" size="sm">Telegram</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={handleCloseSignUpModal} 
      />
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={handleCloseSignInModal} 
      />
      
      <Toaster />
    </div>
  );
};

export default Index;
