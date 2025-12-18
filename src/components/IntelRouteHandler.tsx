import { useParams } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load the components to avoid circular dependencies
const ExternalArticle = lazy(() => import("@/pages/ExternalArticle"));
const VerticalPage = lazy(() => import("@/pages/VerticalPage"));

/**
 * Route handler that determines whether a /intel/:param URL should
 * render an article (slug ending with -ID) or a vertical page
 */
const IntelRouteHandler = () => {
  const { param } = useParams<{ param: string }>();
  
  // Check if the param ends with a numeric ID pattern (e.g., "some-title-123456")
  const isArticleSlug = param && /-\d+$/.test(param);
  
  const LoadingFallback = (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
  
  if (isArticleSlug) {
    return (
      <Suspense fallback={LoadingFallback}>
        <ExternalArticle />
      </Suspense>
    );
  }
  
  return (
    <Suspense fallback={LoadingFallback}>
      <VerticalPage />
    </Suspense>
  );
};

export default IntelRouteHandler;
