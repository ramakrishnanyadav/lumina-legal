import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SectionSkeleton } from "@/components/PerformanceWrapper";
import { queryCacheConfig } from "@/lib/performance";
import { ErrorBoundary, ErrorFallback } from "@/components/ErrorBoundary";
import { I18nProvider } from "@/hooks/useI18n";
import { analytics } from "@/hooks/useAnalytics";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized query client with SWR-like caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...queryCacheConfig,
    },
  },
});

// Page loading skeleton
const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <SectionSkeleton className="pt-20" rows={5} />
  </div>
);

// Route preloader hook
const useRoutePreload = () => {
  useEffect(() => {
    // Preload pages on idle
    const preloadPages = () => {
      import("./pages/Index");
      import("./pages/NotFound");
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadPages);
    } else {
      setTimeout(preloadPages, 200);
    }
  }, []);
};

// Global error handler
const handleGlobalError = (error: Error) => {
  analytics.trackError(error, { location: 'global' });
};

const App = () => {
  useRoutePreload();

  // Initialize analytics
  useEffect(() => {
    analytics.init();
  }, []);

  return (
    <ErrorBoundary
      onError={handleGlobalError}
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <ErrorFallback
            error={null}
            title="Application Error"
            message="Something went wrong with the application. Please refresh the page."
            onRetry={() => window.location.reload()}
          />
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </I18nProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
