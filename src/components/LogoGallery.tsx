import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Search } from "lucide-react";

interface LogoGalleryProps {
  onSelect: (logoPath: string) => void;
  selectedLogo?: string;
}

// Common logo files from lovable-uploads
const logoFiles = [
  // Company-specific logos
  "micropolis-logo.svg",
  "micropolis-icon.png",
  "micropolis-m-icon.png",
  "naoris-icon.png",
  "naoris-logo.png",
  "naoris-logo-hires.png",
  "naoris-logo-updated.png",
  "karbonx-icon.png",
  "abtu-coin.png",
  "facialdx-thumbnail.png",
  "synbio-social-thumbnail.png",
  
  // UUID-named files (likely company logos)
  "4fc4b91a-cd33-4009-ad3a-df4b3d33d179.png",
  "27fcb1ac-666f-4a63-a383-b63576970769.png",
  "1f9cf53e-b447-4ef9-b4f0-d40bcd1a4e62.png",
  "3f8875ae-807d-495a-a5aa-4f3758c25788.png",
  "81a540f7-53d1-4835-a86f-983e8a85e38c.png",
  "aa74295d-6cd4-4d0b-9a60-0904cd93a391.png",
  "cefeeb41-88d4-410c-bb83-323d0bf2c3e1.png",
  "e322d61f-bd41-4cd3-a72b-5067f513dfc5.png",
  "15d3e19c-10e7-417c-8702-ef2c13a858ed.png",
];

export const LogoGallery = ({ onSelect, selectedLogo }: LogoGalleryProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogos = logoFiles.filter(logo => 
    logo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Logo Gallery
          <div className="flex items-center gap-2 flex-1 max-w-xs ml-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
          {filteredLogos.map((logo) => {
            const logoPath = `/lovable-uploads/${logo}`;
            const isSelected = selectedLogo === logoPath;
            
            return (
              <Button
                key={logo}
                variant="outline"
                className={`relative h-24 w-full p-2 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all ${
                  isSelected ? "border-primary border-2 bg-primary/5" : ""
                }`}
                onClick={() => onSelect(logoPath)}
                type="button"
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <img
                  src={logoPath}
                  alt={logo}
                  className="max-h-12 max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                  }}
                />
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                  {logo.length > 15 ? logo.substring(0, 12) + "..." : logo}
                </span>
              </Button>
            );
          })}
        </div>
        {filteredLogos.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No logos found matching "{searchTerm}"
          </p>
        )}
      </CardContent>
    </Card>
  );
};
