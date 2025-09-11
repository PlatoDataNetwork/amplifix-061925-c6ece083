import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PrivacyPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted privacy policy
    const hasAccepted = localStorage.getItem('privacy-accepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacy-accepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // For now, just hide the popup but don't store acceptance
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              We use cookies and similar technologies to provide the best experience on our website. 
              By continuing to browse, you consent to our use of cookies. 
              <a 
                href="/privacy-policy" 
                className="text-primary hover:underline ml-1"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Learn more about our Privacy Policy
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              className="text-xs"
            >
              Decline
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccept}
              className="text-xs"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPopup;