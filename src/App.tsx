
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import API from "./pages/API";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import SiloPharmaShowcase from "./pages/SiloPharmaShowcase";
import Features from "./pages/Features";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/api" element={<API />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/support" element={<Support />} />
              <Route path="/features" element={<Features />} />
              <Route path="/showcase/silo-pharma" element={<SiloPharmaShowcase />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
