import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - AmplifiX AI-Powered Corporate Communications</title>
        <meta name="description" content="Learn how AmplifiX protects your privacy and handles your personal information. Our comprehensive privacy policy explains data collection, usage, and your rights." />
        <meta name="keywords" content="privacy policy, data protection, personal information, AmplifiX privacy, data security, GDPR compliance" />
        <meta property="og:title" content="AmplifiX Privacy Policy" />
        <meta property="og:description" content="Comprehensive privacy policy detailing how AmplifiX handles and protects your personal information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/privacy-policy" />
        <link rel="canonical" href="https://amplifix.ai/privacy-policy" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        
        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-full mb-6">
                <Shield className="h-6 w-6 text-green-500" />
                <span className="text-green-500 font-semibold">Your Privacy Matters</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="prose prose-lg max-w-none">
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Eye className="h-6 w-6 text-highlight-blue" />
                    Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AmplifiX ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered 
                    corporate communications platform and related services.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-green-500" />
                    Information We Collect
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Name, email address, phone number, and job title</li>
                    <li>Company name and business contact information</li>
                    <li>Account credentials and authentication information</li>
                    <li>Payment and billing information</li>
                    <li>Communications preferences and settings</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Usage Information</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Platform usage data and feature interactions</li>
                    <li>Content created, edited, or shared through our services</li>
                    <li>Log data including IP addresses, browser type, and device information</li>
                    <li>Analytics data about platform performance and user engagement</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">AI Training Data</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Content inputs and AI-generated outputs for service improvement</li>
                    <li>User feedback and correction data to enhance AI accuracy</li>
                    <li>Aggregated usage patterns for model training (anonymized)</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-purple-500" />
                    How We Use Your Information
                  </h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our AI-powered communication services</li>
                    <li>Process transactions and manage your account</li>
                    <li>Communicate with you about updates, support, and promotional content</li>
                    <li>Personalize your experience and provide relevant content recommendations</li>
                    <li>Train and improve our AI models to enhance service quality</li>
                    <li>Ensure platform security and prevent fraudulent activities</li>
                    <li>Comply with legal obligations and enforce our terms of service</li>
                    <li>Analyze usage patterns to optimize platform performance</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-blue-500" />
                    Information Sharing and Disclosure
                  </h2>
                  
                  <p className="text-muted-foreground mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in platform operations, payment processing, and analytics</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales (with notice to users)</li>
                    <li><strong>With Consent:</strong> When you explicitly authorize us to share your information</li>
                    <li><strong>Aggregated Data:</strong> Non-identifiable, aggregated statistics for research and industry analysis</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Data Security and Protection</h2>
                  <p className="text-muted-foreground mb-4">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>End-to-end encryption for data transmission and storage</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication protocols</li>
                    <li>Secure cloud infrastructure with redundant backups</li>
                    <li>Employee training on data protection and privacy practices</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Your Rights and Choices</h2>
                  <p className="text-muted-foreground mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                    <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Restrict Processing:</strong> Limit how we use your information in certain circumstances</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
                  <p className="text-muted-foreground">
                    We retain your personal information for as long as necessary to provide our services, comply with legal obligations, 
                    resolve disputes, and enforce our agreements. Account data is retained for the duration of your account plus 
                    7 years for business records. Usage data and AI training data may be retained longer in anonymized form for 
                    service improvement purposes.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
                  <p className="text-muted-foreground">
                    Your information may be transferred to and processed in countries other than your own. We ensure adequate 
                    protection through appropriate safeguards, including standard contractual clauses and adequacy decisions 
                    recognized by relevant data protection authorities.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
                  <p className="text-muted-foreground">
                    Our services are not intended for individuals under the age of 16. We do not knowingly collect personal 
                    information from children under 16. If we become aware that a child under 16 has provided us with personal 
                    information, we will take steps to delete such information.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
                    the new policy on this page and updating the "Last updated" date. Continued use of our services after such 
                    changes constitutes acceptance of the updated policy.
                  </p>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-highlight-blue" />
                    Contact Us
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Email:</strong> privacy@amplifix.net</p>
                    <p><strong>Address:</strong> 9170 Glades Road, Boca Raton, FL 33434</p>
                    <p><strong>Data Protection Officer:</strong> dpo@amplifix.net</p>
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

export default PrivacyPolicy;