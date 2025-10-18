import { Button } from "./ui/button";

const ReadyToShip = () => {
  const handleGetQuote = () => {
    // Scroll to quote form or open modal
    const quoteSection = document.getElementById('quote-form');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/placeholder-ready-to-ship.jpg)', // Replace with actual image
          filter: 'brightness(0.4)',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
      </div>

      {/* Placeholder background when no image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 -z-10"></div>

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
            onClick={handleGetQuote}
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
