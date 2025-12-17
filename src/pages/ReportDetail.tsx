import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowLeft, Calendar, Building2, FileText, BarChart3, Link2, ExternalLink } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Report {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "txt" | "csv";
  icon: "chart" | "links" | "document";
  downloadUrl: string;
  fileSize?: string;
}

interface PRCampaign {
  id: string;
  client: string;
  title: string;
  date: string;
  reports: Report[];
}

const campaigns: PRCampaign[] = [
  {
    id: "1wo-ch-dec-2025",
    client: "1World Online",
    title: "1World Online and Culinary Heritage Announce Strategic Partnership and Joint Launches in Europe",
    date: "December 12, 2025",
    reports: [
      {
        id: "media-placements",
        title: "Media Placements Report",
        description: "Complete list of 487 media placement URLs across news outlets and platforms",
        type: "txt",
        icon: "links",
        downloadUrl: "/reports/1wo-ch-media-placements.txt",
        fileSize: "48 KB"
      },
      {
        id: "distribution-report",
        title: "Distribution Report",
        description: "Comprehensive PR distribution summary and reach metrics",
        type: "pdf",
        icon: "document",
        downloadUrl: "/reports/1wo-ch-report.pdf",
        fileSize: "PDF"
      },
      {
        id: "analytics-report",
        title: "Analytics Report",
        description: "Detailed analytics and performance metrics for the campaign",
        type: "pdf",
        icon: "chart",
        downloadUrl: "/reports/1wo-ch-analytics-report.pdf",
        fileSize: "PDF"
      }
    ]
  }
];

const getReportIcon = (icon: string) => {
  switch (icon) {
    case "chart":
      return <BarChart3 className="h-6 w-6" />;
    case "links":
      return <Link2 className="h-6 w-6" />;
    default:
      return <FileText className="h-6 w-6" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "pdf":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "txt":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "csv":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ReportDetail = () => {
  const { campaignId, reportId } = useParams();
  const [textContent, setTextContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const campaign = campaigns.find(c => c.id === campaignId);
  const report = campaign?.reports.find(r => r.id === reportId);

  useEffect(() => {
    if (report?.type === "txt") {
      setIsLoading(true);
      fetch(report.downloadUrl)
        .then(res => res.text())
        .then(text => {
          const lines = text.split("\n").filter(line => line.trim());
          setTextContent(lines);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [report]);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!campaign || !report) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Report Not Found</h1>
          <Link to="/reports">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${report.title} | ${campaign.client} | AmplifiX`}
        description={report.description}
      />
      <MainHeader />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/reports" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  {getReportIcon(report.icon)}
                </div>
                <Badge variant="outline" className={getTypeColor(report.type)}>
                  {report.type.toUpperCase()}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {report.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {report.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{campaign.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{campaign.date}</span>
                </div>
              </div>
            </div>
            
            <Button
              size="lg"
              onClick={() => handleDownload(report.downloadUrl, `${report.id}.${report.type}`)}
              className="gap-2 shrink-0"
            >
              <Download className="h-5 w-5" />
              Download Report
            </Button>
          </div>
        </div>
      </section>

      {/* Report Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Client</p>
                    <p className="font-semibold text-foreground">{campaign.client}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Campaign Date</p>
                    <p className="font-semibold text-foreground">{campaign.date}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Campaign Title</p>
                  <p className="font-semibold text-foreground">{campaign.title}</p>
                </div>

                {/* Embed PDF or show text content */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Report Preview</h3>
                  {report.type === "pdf" ? (
                    <div className="rounded-lg overflow-hidden border border-border/50 bg-muted/10">
                      <embed
                        src={`${report.downloadUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                        type="application/pdf"
                        className="w-full h-[800px]"
                        title={report.title}
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-4">
                        This report contains {textContent.length > 0 ? textContent.length : "a list of"} media placement URLs. Click any link to visit the placement.
                      </p>
                      {isLoading ? (
                        <p className="text-muted-foreground">Loading links...</p>
                      ) : (
                        <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
                          {textContent.map((line, index) => {
                            const isUrl = line.startsWith("http://") || line.startsWith("https://");
                            return isUrl ? (
                              <a
                                key={index}
                                href={line}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline break-all p-2 rounded hover:bg-muted/30 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 shrink-0" />
                                {line}
                              </a>
                            ) : (
                              <p key={index} className="text-sm text-foreground p-2">{line}</p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReportDetail;
