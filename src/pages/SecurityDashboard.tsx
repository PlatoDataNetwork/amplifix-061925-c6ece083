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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScan, setLastScan] = useState<string>('');

  const fetchSecurityFindings = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view security findings.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('get-security-findings', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching security findings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch security findings. Please try again.",
          variant: "destructive",
        });
        setFindings([]);
        return;
      }

      if (data?.findings) {
        setFindings(data.findings);
        setLastScan(new Date(data.last_scan).toLocaleString());
      }
    } catch (error) {
      console.error('Error fetching security findings:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setFindings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityFindings();
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
              onClick={fetchSecurityFindings}
              className="ml-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
