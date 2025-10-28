import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MicropolisPresentation = () => {
  return (
    <>
      <Helmet>
        <title>Micropolis Investor Presentation | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="View the official Micropolis Holding investor presentation featuring company overview, management team, and investment opportunities." 
        />
        <meta 
          name="keywords" 
          content="Micropolis presentation, investor relations, NYSE MCRP, robotics investment, AI investment" 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <MainHeader />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/showcase/micropolis">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Showcase
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Micropolis Investor Presentation</h1>
                  <p className="text-muted-foreground">NYSE-AMEX: MCRP | September 2025</p>
                </div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <a href="/documents/micropolis-presentation.pdf" download>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            </div>

            <div className="bg-card rounded-lg shadow-lg overflow-hidden border">
              <iframe
                src="/documents/micropolis-presentation.pdf"
                className="w-full h-[calc(100vh-200px)] min-h-[600px]"
                title="Micropolis Investor Presentation"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MicropolisPresentation;
