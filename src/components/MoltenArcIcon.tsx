
import React from 'react';

interface MoltenArcIconProps {
  className?: string;
}

const MoltenArcIcon: React.FC<MoltenArcIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Outer Arc/Ring */}
      <path 
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
        stroke="url(#gradient1)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Inner Molten Core */}
      <circle 
        cx="12" 
        cy="12" 
        r="5" 
        fill="url(#gradient2)" 
      />
      
      {/* Lightning/Energy Bolt */}
      <path 
        d="M12 7L14 11H10L12 17" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Define Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9b87f5" />
          <stop offset="1" stopColor="#61dafb" />
        </linearGradient>
        
        <radialGradient id="gradient2" cx="12" cy="12" r="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#9b87f5" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default MoltenArcIcon;
