import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import App from './App.tsx'
import './index.css'
import './i18n/config'

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <img 
      src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
      alt="AmplifiX" 
      className="w-16 h-16 animate-pulse"
    />
  </div>
);

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingSpinner />}>
    <App />
  </Suspense>
);
