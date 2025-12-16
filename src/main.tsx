import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import App from './App.tsx'
import './index.css'
import './i18n/config'

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
    <img 
      src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
      alt="AmplifiX" 
      className="w-12 h-12 animate-pulse"
    />
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-muted animate-pulse" />
      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
    </div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingSpinner />}>
    <App />
  </Suspense>
);
