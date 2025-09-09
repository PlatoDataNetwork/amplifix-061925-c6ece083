import { Helmet } from "react-helmet-async";
import { Shield, CheckCircle, FileText, Users, Lock, Globe, AlertTriangle, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";

const Compliance = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Helmet>
        <title>Compliance - AmplifiX</title>
        <meta 
          name="description" 
          content="AmplifiX compliance framework including regulatory standards, data protection, security measures, and industry best practices for PR and communications services." 
        />
        <meta name="keywords" content="compliance, regulatory, data protection, security, PR standards, GDPR, CCPA, SOC2" />
        <link rel="canonical" href="/compliance" />
      </Helmet>

      <MainHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-highlight-blue/10 text-highlight-blue rounded-full px-4 py-2 border border-highlight-blue/20 mb-8">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Regulatory Excellence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Compliance Framework</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AmplifiX maintains the highest standards of compliance across regulatory, security, and industry best practices to ensure your communications are handled with complete integrity and legal adherence.
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Shield className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Security First</h3>
                <p className="text-muted-foreground text-sm">Enterprise-grade security protocols and certifications</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <FileText className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Regulatory Standards</h3>
                <p className="text-muted-foreground text-sm">Full compliance with SEC, FTC, and industry regulations</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Users className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Data Privacy</h3>
                <p className="text-muted-foreground text-sm">GDPR, CCPA, and global privacy law compliance</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Globe className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Industry Standards</h3>
                <p className="text-muted-foreground text-sm">PRSA Code of Ethics and professional standards</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Protection Section */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Data Protection & Privacy</h2>
              <div className="space-y-8">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <Lock className="h-6 w-6 text-highlight-blue mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">GDPR Compliance</h3>
                      <p className="text-muted-foreground mb-4">
                        Full compliance with the General Data Protection Regulation (GDPR) for all European clients and data subjects.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Right to access, rectification, and erasure
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Data portability and processing transparency
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Breach notification within 72 hours
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 text-highlight-blue mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">CCPA Compliance</h3>
                      <p className="text-muted-foreground mb-4">
                        California Consumer Privacy Act compliance ensuring California residents' privacy rights are protected.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Right to know and delete personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Opt-out of sale of personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Non-discrimination for exercising privacy rights
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Certifications */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Security & Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-highlight-blue" />
                  SOC 2 Type II
                </h3>
                <p className="text-muted-foreground mb-4">
                  Independently audited and certified for security, availability, processing integrity, confidentiality, and privacy.
                </p>
                <div className="text-sm text-highlight-blue">Annual third-party audit completed</div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-highlight-blue" />
                  ISO 27001
                </h3>
                <p className="text-muted-foreground mb-4">
                  Information security management system certified to international standards for protecting sensitive information.
                </p>
                <div className="text-sm text-highlight-blue">Certification maintained annually</div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-highlight-blue" />
                  Encryption Standards
                </h3>
                <p className="text-muted-foreground mb-4">
                  AES-256 encryption for data at rest and TLS 1.3 for data in transit, ensuring maximum security for all communications.
                </p>
                <div className="text-sm text-highlight-blue">Military-grade encryption</div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-highlight-blue" />
                  Access Controls
                </h3>
                <p className="text-muted-foreground mb-4">
                  Multi-factor authentication, role-based access controls, and regular access reviews ensure only authorized personnel can access data.
                </p>
                <div className="text-sm text-highlight-blue">Zero-trust architecture</div>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Compliance */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Regulatory Compliance</h2>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-highlight-blue" />
                    SEC Disclosure Requirements
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Full compliance with Securities and Exchange Commission regulations for public company communications, including Regulation FD (Fair Disclosure) and material information handling.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Material information disclosure protocols
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Regulation FD compliance monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Insider trading prevention measures
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-highlight-blue" />
                    FTC Advertising Standards
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Adherence to Federal Trade Commission guidelines for truthful advertising, endorsement disclosures, and consumer protection in all PR materials.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Truth-in-advertising compliance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Proper endorsement disclosures
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Substantiation of claims
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-highlight-blue" />
                    PRSA Code of Ethics
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Strict adherence to the Public Relations Society of America Code of Ethics, ensuring professional integrity and accountability in all communications.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Advocacy, honesty, expertise, independence
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Loyalty, fairness, and respect
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Professional development and integrity
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audit & Monitoring */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Continuous Monitoring & Auditing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-xl border border-border">
                <Clock className="h-8 w-8 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold mb-4">Real-Time Monitoring</h3>
                <p className="text-muted-foreground mb-4">
                  24/7 monitoring of all systems and processes to ensure continuous compliance and immediate response to any issues.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Automated compliance checks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Security incident detection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Performance and availability monitoring
                  </li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <FileText className="h-8 w-8 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold mb-4">Regular Audits</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive internal and external audits to verify compliance with all applicable standards and regulations.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quarterly internal compliance reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Annual third-party security audits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Penetration testing and vulnerability assessments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Compliance Questions?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our compliance team is available to address any questions about our regulatory standards, security measures, or industry certifications.
              </p>
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Compliance Officer:</strong>{" "}
                  <a href="mailto:compliance@amplifix.net" className="text-highlight-blue hover:underline">
                    compliance@amplifix.net
                  </a>
                </p>
                <p className="text-muted-foreground">
                  For immediate compliance concerns, please contact our 24/7 hotline or submit a compliance inquiry through our secure portal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Compliance;