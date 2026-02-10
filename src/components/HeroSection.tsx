import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import QuoteForm from "./QuoteForm";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import { useAuth } from "@/contexts/AuthContext";

const heroImages = [hero1, hero2, hero3];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // ✅ Use AuthContext (so UI stays consistent everywhere)
  const { isAuthenticated, isLoading } = useAuth();
  const isLoggedIn = !isLoading && isAuthenticated;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Auto transport ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Reliable Auto Transport at Your Fingertips
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Get your car delivered safely, anywhere, anytime. Fast, secure, and affordable auto
              transport for individuals and businesses.
            </p>

            {/* ✅ Buttons side-by-side (same box) */}
            <div className="flex flex-wrap gap-4">
              <Link to="/moving-cost-calculator">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get A Free Quote
                </Button>
              </Link>


              {isLoggedIn && (
                <Link to="/profile/track-shipment">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-foreground"
                  >
                    Track My Shipment
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Quote Form */}
          <div className="animate-slide-in">
            <QuoteForm />
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentImage ? "w-8 bg-primary" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
