import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Rss, Database, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FeedsManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/management")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">RSS Feed Syndicator</h1>
              <p className="text-muted-foreground">Manage RSS feeds and auto-sync articles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Setup Required</AlertTitle>
          <AlertDescription>
            The RSS Feed Syndicator requires additional database tables to be created. 
            Please run the database migration to enable this feature.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Rss className="h-5 w-5 text-primary" />
                <CardTitle>Feed Management</CardTitle>
              </div>
              <CardDescription>
                Add, configure, and manage RSS feeds for automatic article importing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <Rss className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Feeds Configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once the database is set up, you'll be able to add RSS feeds here
                  </p>
                  <Button disabled>
                    Add RSS Feed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Required Tables</CardTitle>
              </div>
              <CardDescription>
                Database tables needed for the Feed Syndicator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div>
                    <p className="font-medium text-sm">rss_feeds</p>
                    <p className="text-xs text-muted-foreground">Store feed configurations and settings</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div>
                    <p className="font-medium text-sm">feed_sync_logs</p>
                    <p className="text-xs text-muted-foreground">Track sync history and imported articles</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium text-sm mb-2">Features when enabled:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add multiple RSS/Atom feeds</li>
                  <li>• Configure auto-sync intervals</li>
                  <li>• Set default images and authors</li>
                  <li>• Duplicate detection by title/URL</li>
                  <li>• View sync history and logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedsManagement;
