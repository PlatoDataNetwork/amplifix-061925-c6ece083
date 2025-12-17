import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, BarChart3, Link2, Calendar, Building2 } from "lucide-react";
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

const ReportsDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="PR Reports Dashboard | AmplifiX"
        description="Access and download your PR campaign reports, analytics, and media placement data."
      />
      <MainHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              PR Reports Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Access and download comprehensive reports for your PR campaigns including media placements, distribution summaries, and analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="mb-8 border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="border-b border-border/50">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{campaign.client}</span>
                    </div>
                    <CardTitle className="text-2xl text-foreground">
                      {campaign.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {campaign.date}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit border-primary/50 text-primary">
                    {campaign.reports.length} Reports Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {campaign.reports.map((report) => (
                    <Card 
                      key={report.id} 
                      className="border-border/30 bg-background/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            {getReportIcon(report.icon)}
                          </div>
                          <Badge variant="outline" className={getTypeColor(report.type)}>
                            {report.type.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {report.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {report.fileSize && (
                            <span className="text-xs text-muted-foreground">
                              {report.fileSize}
                            </span>
                          )}
                          <Link to={`/reports/${campaign.id}/${report.id}`}>
                            <Button
                              size="sm"
                              className="ml-auto gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Placeholder for future campaigns */}
          <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Additional campaign reports will appear here as they become available.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReportsDashboard;
