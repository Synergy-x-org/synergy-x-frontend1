import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";

// ✅ New File: src/pages/QuoteResult.tsx - Quote result page with pricing and map

interface QuoteData {
  quoteId: string;
  pickupFrom: string;
  deliverTo: string;
  carModel: string;
  finalPrice: number;
  downPayment: number;
  codDelivery: number;
  distanceInMiles: number;
}

const QuoteResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!userData);

    // Simulate API call to fetch quote data
    const fetchQuoteData = async () => {
      setIsLoading(true);
      
      // Get data from navigation state or create mock data
      const formData = location.state?.formData;
      
      try {
        // TODO: Replace with real Java backend endpoint
        // const response = await fetch("https://api.synergyx.com/calculate-quote", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(formData)
        // });
        // const data = await response.json();
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        
        const mockData: QuoteData = {
          quoteId: `#${Math.floor(1000000 + Math.random() * 9000000)}`,
          pickupFrom: formData?.location || "Texas",
          deliverTo: formData?.destination || "New York",
          carModel: formData?.carModel && formData?.maker 
            ? `${formData.maker} ${formData.carModel} ${formData.year || ""}`
            : "Honda Ford 2021",
          finalPrice: 1200,
          downPayment: 600,
          codDelivery: 600,
          distanceInMiles: 1845
        };
        
        setQuoteData(mockData);
      } catch (error) {
        console.error("Error fetching quote:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuoteData();
  }, [location.state]);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      // TODO: Add logged-in user flow
      console.log("User is logged in, proceed with booking");
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  if (isLoading) {
    return <LoadingState message="Calculating your quote, please wait..." />;
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Unable to load quote data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-32 right-8 p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Quote Details */}
            <div className="space-y-6">
              {/* Quote Header */}
              <div className="bg-primary text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold">Quote {quoteData.quoteId}</h1>
              </div>

              {/* Pickup and Delivery Info */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Pickup from</span>
                  <span className="font-semibold">{quoteData.pickupFrom}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Deliver to</span>
                  <span className="font-semibold">{quoteData.deliverTo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Car Model</span>
                  <span className="font-semibold">{quoteData.carModel}</span>
                </div>
              </div>

              {/* Total Shipping Cost */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-primary text-white p-4">
                  <h2 className="text-xl font-bold">Total Shipping Cost</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Final price</p>
                      <p className="text-4xl font-bold text-primary">${quoteData.finalPrice}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Down Payment</p>
                          <p className="text-2xl font-bold text-primary">${quoteData.downPayment}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">COD on Delivery</p>
                          <p className="text-2xl font-bold text-primary">${quoteData.codDelivery}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <h3 className="text-xl font-bold mb-3">Open Carrier</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Best price availability</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Door-to-Door Service</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Insurance included</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Started Button */}
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6"
              >
                Get Started
              </Button>

              {/* Privacy Text */}
              <p className="text-center text-sm text-muted-foreground">
                We respect your privacy and do not distribute your data.
              </p>
            </div>

            {/* Right Column - Map and Contact */}
            <div className="space-y-6">
              {/* Route Header */}
              <div className="flex items-center justify-center gap-4 text-lg font-semibold">
                <span className="bg-primary text-white px-4 py-2 rounded-lg">
                  {quoteData.pickupFrom}
                </span>
                <div className="flex-1 border-t-2 border-dashed border-muted-foreground max-w-[200px]" />
                <MapPin className="text-primary" />
                <span className="text-muted-foreground">{quoteData.distanceInMiles} Mi</span>
                <MapPin className="text-primary" />
                <div className="flex-1 border-t-2 border-dashed border-muted-foreground max-w-[200px]" />
                <span className="bg-primary text-white px-4 py-2 rounded-lg">
                  {quoteData.deliverTo}
                </span>
              </div>

              {/* Map Container */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square w-full bg-muted flex items-center justify-center">
                  {/* TODO: Integrate with map service https://synagyx.vercel.app/ */}
                  {/* Replace with actual map image from backend */}
                  <iframe
                    src={`https://synagyx.vercel.app/?origin=${encodeURIComponent(quoteData.pickupFrom)}&destination=${encodeURIComponent(quoteData.deliverTo)}`}
                    className="w-full h-full"
                    title="Route Map"
                    style={{ minHeight: "500px" }}
                  />
                </div>
              </div>

              {/* Contact Box */}
              <div className="bg-primary text-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                <div className="flex-shrink-0">
                  {/* Replace this profile image if needed */}
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=expert" 
                      alt="Synergy X Expert"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-2">
                    Speak to Synergy X experts to discuss your vehicle shipping and let us answer any questions you may have.
                  </p>
                  <a 
                    href="mailto:admin@synergyxtransportation.com"
                    className="font-semibold hover:underline"
                  >
                    admin@synergyxtransportation.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteResult;
