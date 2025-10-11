import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Header = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchHeaderImages();
  }, []);

  const fetchHeaderImages = async () => {
    const { data, error } = await supabase
      .from("header_images")
      .select("image_url")
      .order("position");
    
    if (data && !error) {
      setImages(data.map(img => img.image_url));
    }
  };

  useEffect(() => {
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <header className="relative">
      <div className="relative w-full aspect-square max-h-[500px] overflow-hidden bg-white">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-center text-white" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.3), 0 12px 24px rgba(0,0,0,0.2)' }}>
            Dapur Mama
          </h1>
        </div>
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};