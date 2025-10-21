import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "./ui/button";

import readyToShipBg from "@/assets/hero1.jpg"; // Using existing hero image as placeholder

const ReadyToShip = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetQuote = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${readyToShipBg})`, // Use imported image
        }}
      >
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ship Your Vehicle?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get your vehicle delivered safely, on time, and at the best price.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetQuote} // Use onClick for navigation
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
          >
            Get a free shipping quote now!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReadyToShip;
