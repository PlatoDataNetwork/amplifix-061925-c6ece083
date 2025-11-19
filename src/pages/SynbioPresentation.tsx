import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ChevronLeft, ChevronRight, Home, FileDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";

const slides = [
  { id: 1, title: "Synbio International Inc - Investor Presentation", image: "/lovable-uploads/synbio-slides/slide-1.jpg" },
  { id: 2, title: "Forward Looking Statements", image: "/lovable-uploads/synbio-slides/slide-2.jpg" },
  { id: 3, title: "Corporate Structure", image: "/lovable-uploads/synbio-slides/slide-3.jpg" },
  { id: 4, title: "Our Mission", image: "/lovable-uploads/synbio-slides/slide-4.jpg" },
  { id: 5, title: "Mental Health Screening", image: "/lovable-uploads/synbio-slides/slide-5.jpg" },
  { id: 6, title: "The Problem", image: "/lovable-uploads/synbio-slides/slide-6.jpg" },
  { id: 7, title: "The Solution - NIMS", image: "/lovable-uploads/synbio-slides/slide-7.jpg" },
  { id: 8, title: "How NIMS Works", image: "/lovable-uploads/synbio-slides/slide-8.jpg" },
  { id: 9, title: "The Benefits", image: "/lovable-uploads/synbio-slides/slide-9.jpg" },
  { id: 10, title: "Market Size", image: "/lovable-uploads/synbio-slides/slide-10.jpg" },
  { id: 11, title: "Competitive Landscape", image: "/lovable-uploads/synbio-slides/slide-11.jpg" },
  { id: 12, title: "IP Strategy", image: "/lovable-uploads/synbio-slides/slide-12.jpg" },
  { id: 13, title: "Path to FDA", image: "/lovable-uploads/synbio-slides/slide-13.jpg" },
  { id: 14, title: "Potential Partners", image: "/lovable-uploads/synbio-slides/slide-14.jpg" },
  { id: 15, title: "Nutraceutical Division", image: "/lovable-uploads/synbio-slides/slide-15.jpg" },
  { id: 16, title: "Nature's Recipe", image: "/lovable-uploads/synbio-slides/slide-16.jpg" },
  { id: 17, title: "Manufacturing Strategy", image: "/lovable-uploads/synbio-slides/slide-17.jpg" },
  { id: 18, title: "Go-To-Market", image: "/lovable-uploads/synbio-slides/slide-18.jpg" },
  { id: 19, title: "Milestones 2025/26", image: "/lovable-uploads/synbio-slides/slide-19.jpg" },
  { id: 20, title: "Thank You", image: "/lovable-uploads/synbio-slides/slide-20.jpg" }
];

const SynbioPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <Helmet>
        <title>Synbio International - Investor Presentation | AmplifiX</title>
        <meta name="description" content="Interactive investor presentation for Synbio International Inc (OTC: SYIN)." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <LanguageAwareLink to="/showcase/synbio">
              <Button variant="outline" size="sm"><Home className="mr-2 h-4 w-4" />Back</Button>
            </LanguageAwareLink>
            <h1 className="text-2xl font-bold">Synbio Presentation</h1>
            <a href="/documents/synbio-presentation.pdf" download>
              <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />PDF</Button>
            </a>
          </div>
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">{slides[currentSlide].title}</h2>
            <p className="text-sm text-muted-foreground">Slide {currentSlide + 1} of {slides.length}</p>
          </div>
          <div className="relative bg-muted/30 rounded-lg overflow-hidden shadow-2xl mb-6">
            <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-auto" />
            <Button onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} disabled={currentSlide === 0} variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)} disabled={currentSlide === slides.length - 1} variant="outline" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {slides.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-highlight-blue w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} />
            ))}
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {slides.map((slide, index) => (
              <button key={slide.id} onClick={() => setCurrentSlide(index)} className={`relative aspect-video rounded overflow-hidden border-2 transition-all ${index === currentSlide ? 'border-highlight-blue ring-2 ring-highlight-blue/50' : 'border-border hover:border-highlight-blue/50'}`}>
                <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-xs py-0.5 text-center">{index + 1}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SynbioPresentation;
