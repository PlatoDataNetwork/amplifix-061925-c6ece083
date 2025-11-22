import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Info, ArrowLeft, RefreshCw } from 'lucide-react';

interface SecurityFinding {
  id: string;
  internal_id: string;
  name: string;
  description: string;
  level: 'error' | 'warn' | 'info';
  details: string;
  remediation_difficulty: string;
  scanner_name: string;
  created_at: string;
}

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScan, setLastScan] = useState<string>('');

  useEffect(() => {
    // Mock security findings from the audit
    const mockFindings: SecurityFinding[] = [
      {
        id: 'INPUT_VALIDATION',
        internal_id: 'contact_form_xss',
        name: 'XSS Vulnerability in Contact Email Function',
        description: 'User inputs are directly embedded into HTML email templates without sanitization, enabling XSS attacks in email clients.',
        level: 'error',
        details: 'The send-contact-email edge function inserts user-controlled data directly into HTML email templates without validation or encoding at lines 43-50. An attacker could inject XSS payloads that execute in email clients. Remediation: Add zod validation schema, HTML-encode all user inputs before inserting into templates, and validate field lengths.',
        remediation_difficulty: 'easy',
        scanner_name: 'agent_security',
        created_at: new Date().toISOString()
      },
      {
        id: 'PUBLIC_DATA_EXPOSURE',
        internal_id: 'translations_any_auth',
        name: 'Translation Data Modifiable by Any User',
        description: 'The translations table allows ANY authenticated user to modify all translations, not just admins, enabling data corruption and defacement.',
        level: 'error',
        details: 'The translations table has policy: USING (auth.role() = \'authenticated\') which grants full write access to any logged-in user. A malicious user could change critical UI text, pricing, legal terms, or inject phishing URLs. Remediation: Drop the permissive policy and create admin-only policy.',
        remediation_difficulty: 'easy',
        scanner_name: 'agent_security',
        created_at: new Date().toISOString()
      },
      {
        id: 'INPUT_VALIDATION',
        internal_id: 'contact_form_no_validation',
        name: 'Contact Form Lacks Input Validation',
        description: 'The contact form accepts unlimited-length inputs without validation, enabling DoS attacks and amplifying XSS risks.',
        level: 'error',
        details: 'The Contact.tsx form has NO client-side input validation. Missing: length limits, character restrictions, format validation, rate limiting. Attack scenarios: DoS via large payloads, email bombing, data amplification. Remediation: Add zod validation schema with max lengths, validate before submission, implement same validation in edge function, consider rate limiting.',
        remediation_difficulty: 'easy',
        scanner_name: 'agent_security',
        created_at: new Date().toISOString()
      },
      {
        id: 'MISSING_RLS',
        internal_id: 'articles_write_protection',
        name: 'Articles Table Missing Write Protection',
        description: 'The articles table has SELECT and UPDATE policies but lacks INSERT and DELETE policies, violating defense-in-depth principles.',
        level: 'error',
        details: 'The articles table has SELECT and UPDATE policies but lacks INSERT and DELETE policies. Without these policies, defense-in-depth is violated. An attacker with the public anon key could attempt direct database insertions/deletions. Remediation: Add admin-only INSERT and DELETE policies using has_role function.',
        remediation_difficulty: 'medium',
        scanner_name: 'agent_security',
        created_at: new Date().toISOString()
      },
      {
        id: 'MISSING_RLS',
        internal_id: 'tags_article_tags_policies',
        name: 'Tags Tables Missing Write Protection',
        description: 'The tags and article_tags tables lack INSERT/UPDATE/DELETE policies, allowing potential unauthorized data manipulation.',
        level: 'error',
        details: 'Both tags and article_tags tables have RLS enabled but only define SELECT policies. No write policies exist. This allows anyone with the anon key to create spam tags, delete legitimate tags, or break article associations. Remediation: Add admin-only INSERT/UPDATE/DELETE policies for both tables using has_role function.',
        remediation_difficulty: 'medium',
        scanner_name: 'agent_security',
        created_at: new Date().toISOString()
      }
    ];

    setFindings(mockFindings);
    setLastScan(new Date().toLocaleString());
    setLoading(false);
  }, []);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warn':
        return 'secondary';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const stats = {
    critical: findings.filter(f => f.level === 'error').length,
    warnings: findings.filter(f => f.level === 'warn').length,
    info: findings.filter(f => f.level === 'info').length,
    total: findings.length
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Security Dashboard</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            Real-time security audit and vulnerability tracking
          </p>
          <div className="flex items-center gap-2 ml-14 mt-2">
            <span className="text-sm text-muted-foreground">Last scan:</span>
            <span className="text-sm font-medium">{lastScan}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-destructive/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-yellow-500">{stats.warnings}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Informational</CardTitle>
              <Info className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-blue-500">{stats.info}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stats.total}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Status Alert */}
        {stats.critical > 0 && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Security Issues Detected</AlertTitle>
            <AlertDescription>
              {stats.critical} critical security {stats.critical === 1 ? 'issue' : 'issues'} found that require immediate attention.
              Please review and remediate these vulnerabilities as soon as possible.
            </AlertDescription>
          </Alert>
        )}

        {/* Security Audit */}
        <Card>
          <CardHeader>
            <CardTitle>Security Audit</CardTitle>
            <CardDescription>
              Detailed vulnerability report and remediation guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : findings.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {findings.map((finding) => (
                  <AccordionItem key={finding.internal_id} value={finding.internal_id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 w-full text-left">
                        {getLevelIcon(finding.level)}
                        <div className="flex-1">
                          <div className="font-semibold">{finding.name}</div>
                          <div className="text-sm text-muted-foreground">{finding.description}</div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getLevelColor(finding.level)}>
                            {finding.level.toUpperCase()}
                          </Badge>
                          <Badge className={getDifficultyColor(finding.remediation_difficulty)}>
                            {finding.remediation_difficulty}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-4 pt-4">
                        <div>
                          <h4 className="font-semibold mb-2">Details</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {finding.details}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">ID: {finding.id}</Badge>
                          <Badge variant="outline">Scanner: {finding.scanner_name}</Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Security Issues Found</h3>
                <p className="text-muted-foreground">
                  Your application passed all security checks!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SecurityDashboard;
