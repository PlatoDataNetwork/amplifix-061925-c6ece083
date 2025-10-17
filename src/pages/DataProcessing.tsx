import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Database, Server, Lock, Shield, Globe, Cpu, BarChart3, RefreshCw } from "lucide-react";

const DataProcessing = () => {
  return (
    <>
      <Helmet>
        <title>Data Processing Agreement - AmplifiX AI-Powered Corporate Communications</title>
        <meta name="description" content="Learn about AmplifiX's data processing practices, security measures, and compliance with international data protection regulations including GDPR." />
        <meta name="keywords" content="data processing, GDPR compliance, data security, AI data processing, data protection agreement, international data transfers" />
        <meta property="og:title" content="AmplifiX Data Processing Agreement" />
        <meta property="og:description" content="Comprehensive data processing agreement detailing how AmplifiX handles, secures, and processes your data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/data-processing" />
        <link rel="canonical" href="https://amplifix.ai/data-processing" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        
        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-purple-500/10 px-6 py-3 rounded-full mb-6">
                <Database className="h-6 w-6 text-purple-500" />
                <span className="text-purple-500 font-semibold">Data Protection & Security</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Data Processing Agreement</h1>
              <p className="text-xl text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Data Processing Content */}
        <section className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="prose prose-lg max-w-none">
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-highlight-blue" />
                    Overview and Scope
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This Data Processing Agreement ("DPA") forms part of AmplifiX's Terms of Service and Privacy Policy, 
                    governing how we process personal data in connection with our AI-powered corporate communications 
                    platform. This agreement ensures compliance with applicable data protection laws, including the 
                    General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA).
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    AmplifiX acts as both a data controller (for account and billing information) and data processor 
                    (for content and communications data processed on behalf of our customers).
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-green-500" />
                    Categories of Personal Data Processed
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Customer Account Data</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Contact information (name, email, phone, business address)</li>
                    <li>Account credentials and authentication data</li>
                    <li>Subscription and billing information</li>
                    <li>Communication preferences and settings</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Platform Usage Data</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Content created, edited, or shared through the platform</li>
                    <li>User interactions and feature usage patterns</li>
                    <li>Device and browser information, IP addresses</li>
                    <li>Session logs and activity timestamps</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">AI Processing Data</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Text inputs provided for AI content generation</li>
                    <li>AI-generated outputs and recommendations</li>
                    <li>User feedback and correction data</li>
                    <li>Model performance and optimization metrics</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Corporate Communications Data</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Press releases and investor relations materials</li>
                    <li>Stakeholder contact information and interaction history</li>
                    <li>Regulatory filings and compliance documentation</li>
                    <li>Analytics and performance reporting data</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Cpu className="h-6 w-6 text-purple-500" />
                    Processing Purposes and Legal Basis
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="border border-border p-3 text-left font-semibold">Processing Purpose</th>
                          <th className="border border-border p-3 text-left font-semibold">Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr>
                          <td className="border border-border p-3">Service provision and platform functionality</td>
                          <td className="border border-border p-3">Contract performance</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Account management and customer support</td>
                          <td className="border border-border p-3">Contract performance</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Payment processing and billing</td>
                          <td className="border border-border p-3">Contract performance</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">AI model training and improvement</td>
                          <td className="border border-border p-3">Legitimate interest</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Security monitoring and fraud prevention</td>
                          <td className="border border-border p-3">Legitimate interest</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Legal compliance and regulatory requirements</td>
                          <td className="border border-border p-3">Legal obligation</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Marketing communications (with consent)</td>
                          <td className="border border-border p-3">Consent</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Server className="h-6 w-6 text-blue-500" />
                    Technical and Organizational Security Measures
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Technical Safeguards</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li><strong>Encryption:</strong> AES-256 encryption for data at rest and TLS 1.3 for data in transit</li>
                    <li><strong>Access Controls:</strong> Multi-factor authentication and role-based access permissions</li>
                    <li><strong>Network Security:</strong> Firewalls, intrusion detection, and DDoS protection</li>
                    <li><strong>Data Backup:</strong> Automated, encrypted backups with geographic redundancy</li>
                    <li><strong>Monitoring:</strong> Real-time security monitoring and incident response systems</li>
                    <li><strong>Vulnerability Management:</strong> Regular security assessments and patch management</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Organizational Measures</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li><strong>Staff Training:</strong> Regular privacy and security training for all employees</li>
                    <li><strong>Background Checks:</strong> Security screening for personnel with data access</li>
                    <li><strong>Confidentiality:</strong> Binding confidentiality agreements for all staff</li>
                    <li><strong>Incident Response:</strong> Documented procedures for security breach response</li>
                    <li><strong>Data Minimization:</strong> Processing only necessary data for specified purposes</li>
                    <li><strong>Regular Audits:</strong> Internal and external security audits and assessments</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-green-500" />
                    International Data Transfers
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Transfer Mechanisms</h3>
                  <p className="text-muted-foreground mb-4">
                    We may transfer personal data to countries outside the European Economic Area (EEA) for processing. 
                    All such transfers are protected by appropriate safeguards:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li><strong>Adequacy Decisions:</strong> Transfers to countries with European Commission adequacy decisions</li>
                    <li><strong>Standard Contractual Clauses:</strong> EU-approved standard contractual clauses for other transfers</li>
                    <li><strong>Binding Corporate Rules:</strong> Internal data protection standards for intra-group transfers</li>
                    <li><strong>Certification Programs:</strong> Participation in approved certification schemes</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Data Processing Locations</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li><strong>Primary:</strong> United States (SOC 2 Type II certified data centers)</li>
                    <li><strong>Backup:</strong> European Union (GDPR-compliant facilities)</li>
                    <li><strong>AI Training:</strong> Secure cloud infrastructure with data residency controls</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <RefreshCw className="h-6 w-6 text-yellow-500" />
                    Data Retention and Deletion
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="border border-border p-3 text-left font-semibold">Data Category</th>
                          <th className="border border-border p-3 text-left font-semibold">Retention Period</th>
                          <th className="border border-border p-3 text-left font-semibold">Deletion Process</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr>
                          <td className="border border-border p-3">Account information</td>
                          <td className="border border-border p-3">Duration of account + 7 years</td>
                          <td className="border border-border p-3">Automated secure deletion</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Platform content</td>
                          <td className="border border-border p-3">Duration of account + 90 days</td>
                          <td className="border border-border p-3">User-initiated or automated</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Usage analytics</td>
                          <td className="border border-border p-3">3 years (anonymized after 1 year)</td>
                          <td className="border border-border p-3">Automated anonymization</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">AI training data</td>
                          <td className="border border-border p-3">5 years (anonymized)</td>
                          <td className="border border-border p-3">Automated anonymization</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Audit logs</td>
                          <td className="border border-border p-3">7 years</td>
                          <td className="border border-border p-3">Automated secure deletion</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Data Subject Rights</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Individual Rights Under GDPR</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li><strong>Right of Access:</strong> Request confirmation and copies of personal data processing</li>
                    <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of personal data under specific circumstances</li>
                    <li><strong>Right to Restrict Processing:</strong> Limit processing in certain situations</li>
                    <li><strong>Right to Data Portability:</strong> Receive data in structured, machine-readable format</li>
                    <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                    <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Exercising Your Rights</h3>
                  <p className="text-muted-foreground mb-4">
                    To exercise your data protection rights, contact our Data Protection Officer at 
                    <a href="mailto:dpo@amplifix.net" className="text-highlight-blue hover:underline"> dpo@amplifix.net</a>. 
                    We will respond to your request within 30 days and may require identity verification for security purposes.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                    AI and Machine Learning Processing
                  </h2>
                  
                  <h3 className="text-xl font-semibold mb-3">AI Model Training</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>We use aggregated, anonymized data to train and improve our AI models</li>
                    <li>Personal identifiers are removed before data is used for training purposes</li>
                    <li>You can opt out of AI training data usage by contacting our support team</li>
                    <li>Our AI models are designed to prevent memorization of individual data points</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Automated Decision Making</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Our platform includes AI-powered content recommendations and optimizations</li>
                    <li>All AI-generated content should be reviewed before publication</li>
                    <li>You have the right to request human review of automated decisions</li>
                    <li>We provide transparency about AI decision-making processes</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Subprocessors and Third Parties</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Approved Subprocessors</h3>
                  <p className="text-muted-foreground mb-4">
                    We engage carefully vetted subprocessors to assist with service delivery. All subprocessors 
                    are bound by data protection agreements equivalent to this DPA:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li><strong>Cloud Infrastructure:</strong> AWS, Google Cloud Platform (SOC 2 Type II certified)</li>
                    <li><strong>Payment Processing:</strong> Stripe, PayPal (PCI DSS compliant)</li>
                    <li><strong>Communication Services:</strong> SendGrid, Twilio (privacy-certified)</li>
                    <li><strong>Analytics:</strong> Google Analytics, Mixpanel (data processing agreements in place)</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Subprocessor Changes</h3>
                  <p className="text-muted-foreground">
                    We will notify customers at least 30 days before adding or changing subprocessors. 
                    If you object to a new subprocessor, you may terminate your subscription without penalty.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Data Breach Notification</h2>
                  <p className="text-muted-foreground mb-4">
                    In the event of a personal data breach, we will:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li>Notify supervisory authorities within 72 hours when required by law</li>
                    <li>Inform affected customers without undue delay</li>
                    <li>Provide details about the nature, scope, and impact of the breach</li>
                    <li>Describe measures taken to address the breach and prevent recurrence</li>
                    <li>Offer assistance with any required notifications to data subjects</li>
                  </ul>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-highlight-blue" />
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    For questions about data processing or to exercise your data protection rights:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Data Protection Officer:</strong> dpo@amplifix.net</p>
                    <p><strong>Privacy Team:</strong> privacy@amplifix.net</p>
                    <p><strong>Security Team:</strong> security@amplifix.net</p>
                    <p><strong>Address:</strong> 144 E 44th St, New York, NY 10017</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    You also have the right to lodge a complaint with your local data protection authority 
                    if you believe your data protection rights have been violated.
                  </p>
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

export default DataProcessing;