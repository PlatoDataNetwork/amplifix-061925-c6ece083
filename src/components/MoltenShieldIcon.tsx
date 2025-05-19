
import React, { useMemo } from 'react';

interface MoltenShieldIconProps {
  className?: string;
  letter?: string;
}

const MoltenShieldIcon: React.FC<MoltenShieldIconProps> = ({ 
  className = "h-5 w-5",
  letter
}) => {
  // Memoize gradient IDs to ensure they're unique per component instance
  const gradientIds = useMemo(() => ({
    shield: `shieldGradient-${Math.random().toString(36).substr(2, 9)}`,
    inner: `innerGradient-${Math.random().toString(36).substr(2, 9)}`
  }), []);

  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={!letter ? true : undefined}
      role={letter ? "img" : undefined}
      aria-label={letter ? `Shield with letter ${letter}` : undefined}
    >
      {/* Main shield shape with gradient fill */}
      <path 
        d="M12 2L3 6V13C3 17.9706 7.02944 22 12 22C16.9706 22 21 17.9706 21 13V6L12 2Z" 
        fill={`url(#${gradientIds.shield})`}
        stroke="#9b87f5"
        strokeWidth="1"
      />
      
      {/* Inner shield shape for depth */}
      <path 
        d="M12 4L5 7.5V12.5C5 16.0899 8.02944 19 12 19C15.9706 19 19 16.0899 19 12.5V7.5L12 4Z" 
        fill={`url(#${gradientIds.inner})`}
        stroke="#9b87f5"
        strokeWidth="0.5"
        strokeOpacity="0.5"
      />
      
      {/* Letter inside the shield */}
      {letter && (
        <text
          x="12"
          y="15"
          fill="white"
          fontFamily="Arial, sans-serif"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {letter}
        </text>
      )}
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id={gradientIds.shield} x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b9acf6" />
          <stop offset="100%" stopColor="#6E59A5" />
        </linearGradient>
        
        <linearGradient id={gradientIds.inner} x1="5" y1="4" x2="19" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d6cefa" />
          <stop offset="100%" stopColor="#9b87f5" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default React.memo(MoltenShieldIcon);
