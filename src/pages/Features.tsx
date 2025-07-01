import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, MessageSquare, Users, Lightbulb, Shield, Zap, Brain, TrendingUp, Target, Globe, Award, CheckCircle, Star, Clock, Database, FileText, Settings, Smartphone, Mail } from "lucide-react";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";

const Features = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />

      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-16 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Powerful <span className="text-highlight-blue">AI Features</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Discover the comprehensive suite of AI-powered tools that transform corporate communications, 
            investor relations, and stakeholder engagement.
          </p>
        </div>
      </div>

      {/* Smart Analytics Dashboard */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6 w-16 h-16 rounded-xl bg-highlight-blue/20 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-highlight-blue" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Smart Analytics Dashboard</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get real-time insights into market sentiment, media coverage, and investor engagement 
              with our AI-powered predictive analytics platform.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Real-time Market Sentiment</h4>
                  <p className="text-muted-foreground">Track how your company is perceived across news, social media, and financial platforms</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Predictive Analytics</h4>
                  <p className="text-muted-foreground">AI algorithms predict market reactions and optimal communication timing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Custom KPI Tracking</h4>
                  <p className="text-muted-foreground">Monitor metrics that matter most to your stakeholders and industry</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Market Sentiment</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600">Positive</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-highlight-blue">87%</div>
                  <div className="text-sm text-muted-foreground">Sentiment Score</div>
                </div>
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-highlight-blue">156</div>
                  <div className="text-sm text-muted-foreground">Media Mentions</div>
                </div>
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-highlight-blue">23%</div>
                  <div className="text-sm text-muted-foreground">Engagement Up</div>
                </div>
              </div>
              <div className="h-32 bg-background rounded-lg flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-highlight-blue" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Content Generation */}
      <section className="container mx-auto py-16 px-4 bg-muted/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-highlight-blue" />
                  <h3 className="text-lg font-semibold">AI Content Generator</h3>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Generated Press Release</div>
                  <div className="text-sm">
                    "AmplifiX Corp announces Q3 2024 results showing 40% revenue growth, driven by increased adoption of AI-powered communication solutions across Fortune 500 companies..."
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-highlight-blue text-white">Generate</Button>
                  <Button size="sm" variant="outline">Refine</Button>
                  <Button size="sm" variant="outline">Export</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mb-6 w-16 h-16 rounded-xl bg-highlight-blue/20 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-highlight-blue" />
            </div>
            <h2 className="text-4xl font-bold mb-6">AI Content Generation</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Generate compelling press releases, investor updates, and corporate communications 
              tailored to your brand voice and target audience.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Brand Voice Consistency</h4>
                  <p className="text-muted-foreground">AI learns your company's tone and messaging style for consistent communications</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Multi-Format Content</h4>
                  <p className="text-muted-foreground">Generate press releases, social posts, investor letters, and more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Compliance Ready</h4>
                  <p className="text-muted-foreground">Built-in compliance checks for regulatory requirements and industry standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Management */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6 w-16 h-16 rounded-xl bg-highlight-blue/20 flex items-center justify-center">
              <Users className="h-8 w-8 text-highlight-blue" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Stakeholder Management</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Intelligent CRM for investors, analysts, media contacts, and other key stakeholders 
              with automated engagement tracking and personalized outreach.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Automated Contact Management</h4>
                  <p className="text-muted-foreground">AI categorizes and prioritizes stakeholders based on influence and engagement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Engagement Tracking</h4>
                  <p className="text-muted-foreground">Monitor interaction history and optimize communication frequency</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Personalized Outreach</h4>
                  <p className="text-muted-foreground">AI customizes messages based on stakeholder preferences and history</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Stakeholder Overview</h3>
              <div className="space-y-4">
                {[
                  { name: "John Smith", role: "Lead Analyst", company: "Goldman Sachs", engagement: "High", status: "Active" },
                  { name: "Sarah Johnson", role: "Portfolio Manager", company: "BlackRock", engagement: "Medium", status: "Active" },
                  { name: "Mike Chen", role: "Journalist", company: "Wall Street Journal", engagement: "High", status: "Recent" }
                ].map((stakeholder, index) => (
                  <div key={index} className="bg-background rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{stakeholder.name}</div>
                        <div className="text-sm text-muted-foreground">{stakeholder.role} • {stakeholder.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-highlight-blue">{stakeholder.engagement}</div>
                        <div className="text-xs text-muted-foreground">{stakeholder.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Insights */}
      <section className="container mx-auto py-16 px-4 bg-muted/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">AI Recommendations</h3>
                <div className="space-y-4">
                  <div className="bg-background rounded-lg p-4 border-l-4 border-highlight-blue">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-highlight-blue" />
                      <span className="font-semibold text-sm">Optimal Timing</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Best time to announce Q3 results: Tuesday, 9:30 AM EST</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-sm">Channel Strategy</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Focus on financial media and analyst calls for maximum impact</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold text-sm">Message Optimization</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Emphasize growth metrics and future guidance for best reception</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mb-6 w-16 h-16 rounded-xl bg-highlight-blue/20 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-highlight-blue" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Strategic Insights</h2>
            <p className="text-xl text-muted-foreground mb-8">
              AI-driven recommendations for timing, messaging, and channel optimization 
              to maximize impact and reach across all your communications.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Timing Optimization</h4>
                  <p className="text-muted-foreground">AI analyzes market patterns to recommend optimal announcement timing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Channel Selection</h4>
                  <p className="text-muted-foreground">Identify the most effective communication channels for your audience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                <div>
                  <h4 className="font-semibold">Message Testing</h4>
                  <p className="text-muted-foreground">A/B test different messaging approaches before full deployment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">More Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore additional AI-powered capabilities that make AmplifiX the complete solution for corporate communications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <Shield className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Compliance Monitoring</h3>
            <p className="text-muted-foreground">
              Automated compliance checks ensure all communications meet regulatory requirements and industry standards.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Database className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Data Integration</h3>
            <p className="text-muted-foreground">
              Seamlessly connect with your existing CRM, financial systems, and communication platforms.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <FileText className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Document Management</h3>
            <p className="text-muted-foreground">
              Organize, version control, and collaborate on all your corporate communications in one place.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Settings className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Workflow Automation</h3>
            <p className="text-muted-foreground">
              Automate approval processes, distribution workflows, and follow-up communications.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Smartphone className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Mobile Access</h3>
            <p className="text-muted-foreground">
              Full-featured mobile app for managing communications and monitoring sentiment on the go.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Mail className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Email Integration</h3>
            <p className="text-muted-foreground">
              Smart email templates, automated follow-ups, and engagement tracking for all stakeholder communications.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="bg-highlight-blue rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Amplifi Your Communications?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of companies already using AmplifiX to transform their corporate communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-white text-highlight-blue hover:bg-gray-100">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
