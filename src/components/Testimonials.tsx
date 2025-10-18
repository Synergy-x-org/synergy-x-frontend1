import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "California to Texas",
    rating: 5,
    message:
      "AutoShip Pro made my cross-country move so much easier! They picked up my car on time and delivered it in perfect condition. The customer service was excellent throughout the entire process.",
  },
  {
    name: "Michael Chen",
    location: "New York to Florida",
    rating: 5,
    message:
      "I was nervous about shipping my classic car, but the enclosed transport option gave me peace of mind. The team was professional, and my car arrived without a scratch. Highly recommend!",
  },
  {
    name: "Emily Rodriguez",
    location: "Illinois to Oregon",
    rating: 5,
    message:
      "Affordable rates and reliable service! They kept me updated throughout the journey, and the driver was friendly and careful with my vehicle. Will definitely use again.",
  },
];

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Are Saying</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-lg relative">
            <div className="flex justify-center mb-4">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-primary text-primary" />
              ))}
            </div>

            <p className="text-lg md:text-xl text-center mb-6 italic">"{current.message}"</p>

            <div className="text-center">
              <p className="font-bold text-lg">{current.name}</p>
              <p className="text-muted-foreground">{current.location}</p>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={previous}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={next}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentTestimonial ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
