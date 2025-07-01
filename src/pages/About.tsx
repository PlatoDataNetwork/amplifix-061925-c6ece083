
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { CheckCircle, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-12 md:py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            About <span className="text-highlight-blue">AmplifiX</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Empowering companies with AI-driven corporate communications and investor relations solutions
            that amplify your message and accelerate growth.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="container mx-auto py-12 md:py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-card p-6 md:p-8 rounded-xl border border-border text-center">
              <Target className="h-10 w-10 md:h-12 md:w-12 text-highlight-blue mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-4">Our Mission</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                To revolutionize corporate communications through AI-powered solutions that help companies
                tell their story more effectively and connect with stakeholders.
              </p>
            </div>
            
            <div className="bg-card p-6 md:p-8 rounded-xl border border-border text-center">
              <Users className="h-10 w-10 md:h-12 md:w-12 text-highlight-blue mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-4">Our Vision</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                A world where every company, regardless of size, has access to sophisticated
                communication tools that amplify their impact and drive meaningful connections.
              </p>
            </div>
            
            <div className="bg-card p-6 md:p-8 rounded-xl border border-border text-center">
              <Award className="h-10 w-10 md:h-12 md:w-12 text-highlight-blue mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-4">Our Values</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Innovation, transparency, and excellence drive everything we do as we help
                companies achieve their communication and growth objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose AmplifiX</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-base md:text-lg font-bold mb-2">AI-Powered Content Creation</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Generate compelling press releases, investor updates, and corporate communications
                  with our advanced AI technology.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-base md:text-lg font-bold mb-2">Comprehensive IR Solutions</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  From IPO preparation to ongoing investor relations, we provide end-to-end
                  solutions for public and private companies.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-base md:text-lg font-bold mb-2">Expert Guidance</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Our team of communications and finance experts ensures your message
                  resonates with the right audience at the right time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
