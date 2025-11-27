import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalImportStatus } from '@/components/admin/GlobalImportStatus';
import { VerticalImportControls } from '@/components/admin/VerticalImportControls';
import { GlobalFooterNormalization } from '@/components/admin/GlobalFooterNormalization';
import { GlobalAIProcessing } from '@/components/admin/GlobalAIProcessing';
import { GlobalAIProcessingDashboard } from '@/components/admin/GlobalAIProcessingDashboard';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { Loader2 } from 'lucide-react';

export default function ImportAdminRefactored() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [selectedVertical, setSelectedVertical] = useState<string>('');

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  // Set first vertical as default when loaded
  useEffect(() => {
    if (!verticalsLoading && verticals.length > 0 && !selectedVertical) {
      setSelectedVertical(verticals[0].slug);
    }
  }, [verticals, verticalsLoading, selectedVertical]);

  if (loading || verticalsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Import Administration</h1>
          <p className="text-muted-foreground">
            Manage article imports, AI processing, and maintenance across all verticals
          </p>
        </div>

        {/* Global Status */}
        <div className="mb-8">
          <GlobalImportStatus />
        </div>

        {/* Global Footer Normalization */}
        <div className="mb-8">
          <GlobalFooterNormalization />
        </div>

        {/* Global AI Processing */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlobalAIProcessing />
          <GlobalAIProcessingDashboard />
        </div>

        {/* Vertical Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Select Vertical</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedVertical} onValueChange={setSelectedVertical}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="Choose a vertical to manage..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {verticals.map((vertical) => (
                  <SelectItem 
                    key={vertical.slug} 
                    value={vertical.slug}
                    className="text-lg py-3"
                  >
                    {vertical.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Vertical Operations */}
        {selectedVertical && (
          <VerticalImportControls verticalSlug={selectedVertical} />
        )}
      </main>

      <Footer />
    </div>
  );
}
