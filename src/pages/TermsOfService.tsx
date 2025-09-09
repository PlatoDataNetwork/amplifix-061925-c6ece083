import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { FileText, Scale, Shield, AlertTriangle, Users, Zap } from "lucide-react";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - AmplifiX AI-Powered Corporate Communications</title>
        <meta name="description" content="Read AmplifiX's Terms of Service governing the use of our AI-powered corporate communications platform. Understand your rights and responsibilities." />
        <meta name="keywords" content="terms of service, user agreement, AmplifiX terms, platform usage, legal terms, service conditions" />
        <meta property="og:title" content="AmplifiX Terms of Service" />
        <meta property="og:description" content="Complete terms of service for AmplifiX AI-powered corporate communications platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/terms-of-service" />
        <link rel="canonical" href="https://amplifix.ai/terms-of-service" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        
        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-blue-500/10 px-6 py-3 rounded-full mb-6">
                <Scale className="h-6 w-6 text-blue-500" />
                <span className="text-blue-500 font-semibold">Legal Agreement</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
              <p className="text-xl text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Terms of Service Content */}
        <section className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="prose prose-lg max-w-none">
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-highlight-blue" />
                    Agreement Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms of Service ("Terms") govern your use of AmplifiX's AI-powered corporate communications 
                    platform and related services ("Services") provided by AmplifiX ("Company," "we," "our," or "us"). 
                    By accessing or using our Services, you agree to be bound by these Terms.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-green-500" />
                    Account Registration and Eligibility
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Eligibility Requirements</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>You must be at least 18 years old and have legal capacity to enter contracts</li>
                    <li>You represent a legitimate business entity or are an authorized individual</li>
                    <li>You have not been previously suspended or banned from our Services</li>
                    <li>Your use complies with all applicable laws and regulations</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Account Responsibilities</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain the security and confidentiality of your account credentials</li>
                    <li>Promptly notify us of any unauthorized use of your account</li>
                    <li>You are responsible for all activities that occur under your account</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-purple-500" />
                    Service Description and Usage
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Platform Services</h3>
                  <p className="text-muted-foreground mb-4">
                    AmplifiX provides AI-powered tools for corporate communications, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>AI-assisted content creation and editing for investor relations</li>
                    <li>Automated press release generation and distribution</li>
                    <li>Corporate communication analytics and optimization</li>
                    <li>Stakeholder engagement tracking and management</li>
                    <li>Compliance and regulatory communication assistance</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Acceptable Use</h3>
                  <p className="text-muted-foreground mb-4">You agree to use our Services only for lawful purposes and in accordance with these Terms. You may not:</p>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Use the Services for any illegal, harmful, or fraudulent activities</li>
                    <li>Generate misleading, false, or defamatory content</li>
                    <li>Attempt to reverse engineer, hack, or compromise our systems</li>
                    <li>Share your account access with unauthorized third parties</li>
                    <li>Use the Services to compete with or replicate our platform</li>
                    <li>Violate any applicable securities laws or regulations</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Intellectual Property Rights</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Our Intellectual Property</h3>
                  <p className="text-muted-foreground mb-4">
                    The AmplifiX platform, including all software, AI models, algorithms, designs, trademarks, and content, 
                    is owned by AmplifiX or our licensors and is protected by intellectual property laws.
                  </p>

                  <h3 className="text-xl font-semibold mb-3">Your Content</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>You retain ownership of content you input into our platform</li>
                    <li>You grant us a license to use your content to provide and improve our Services</li>
                    <li>You represent that you have the right to use and share your content</li>
                    <li>AI-generated content based on your inputs is jointly owned</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Payment Terms and Billing</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Subscription Fees</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                    <li>All fees are non-refundable except as expressly stated in these Terms</li>
                    <li>We may change pricing with 30 days' written notice</li>
                    <li>Taxes are your responsibility unless otherwise stated</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Usage-Based Charges</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Additional charges may apply for premium AI features or high-volume usage</li>
                    <li>Usage limits and overage charges are specified in your subscription plan</li>
                    <li>We will provide usage notifications and billing transparency</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Data and Privacy</h2>
                  <p className="text-muted-foreground mb-4">
                    Your privacy is important to us. Our use of your personal information is governed by our 
                    <Link to="/privacy-policy" className="text-highlight-blue hover:underline"> Privacy Policy</Link>, 
                    which is incorporated into these Terms by reference.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Data Usage for AI Training</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>We may use aggregated, anonymized data to improve our AI models</li>
                    <li>Your specific content remains confidential and is not shared with other users</li>
                    <li>You can opt out of AI training data usage by contacting support</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    Disclaimers and Limitations
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Service Availability</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>We strive for high availability but do not guarantee uninterrupted service</li>
                    <li>Scheduled maintenance and updates may temporarily affect service availability</li>
                    <li>We are not liable for service interruptions beyond our reasonable control</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">AI-Generated Content</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>AI-generated content should be reviewed and validated before publication</li>
                    <li>We do not guarantee the accuracy, completeness, or suitability of AI outputs</li>
                    <li>You are responsible for compliance with securities laws and regulations</li>
                    <li>AI models may reflect biases present in training data</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                  <p className="text-muted-foreground mb-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, AMPLIFAX SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS 
                    OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES.
                  </p>
                  <p className="text-muted-foreground">
                    OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICES 
                    DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Termination</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Termination by You</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>You may terminate your account at any time through your account settings</li>
                    <li>Termination will be effective at the end of your current billing period</li>
                    <li>You remain responsible for all charges incurred before termination</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Termination by Us</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>We may suspend or terminate your account for violation of these Terms</li>
                    <li>We may terminate the Services with 30 days' notice for business reasons</li>
                    <li>Immediate termination may occur for serious violations or legal requirements</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Governing Law and Disputes</h2>
                  <p className="text-muted-foreground mb-4">
                    These Terms are governed by the laws of the State of Florida, without regard to conflict of law principles. 
                    Any disputes arising from these Terms or the Services shall be resolved through binding arbitration 
                    in accordance with the American Arbitration Association rules.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We may modify these Terms from time to time. We will notify you of material changes via email or 
                    platform notification at least 30 days before they take effect. Continued use of the Services 
                    after such changes constitutes acceptance of the modified Terms.
                  </p>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-highlight-blue" />
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Email:</strong> legal@amplifix.net</p>
                    <p><strong>Address:</strong> 9170 Glades Road, Boca Raton, FL 33434</p>
                    <p><strong>Support:</strong> support@amplifix.net</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;