import { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SectionSkeleton } from "@/components/PerformanceWrapper";
import { queryCacheConfig } from "@/lib/performance";

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

const App = () => {
  useRoutePreload();

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
