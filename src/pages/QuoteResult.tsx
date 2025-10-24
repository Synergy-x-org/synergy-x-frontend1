import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import { QuoteVisitorResponse } from "@/services/api"; // Import QuoteVisitorResponse
import { mapAPI, MapResponse } from "@/services/mapApi"; // Import mapAPI and MapResponse
import { toast } from "@/hooks/use-toast";

interface QuoteData extends QuoteVisitorResponse {
  distance: string;
  duration: string;
  mapImageUrl: string;
}

const QuoteResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchResults = async () => {
      setIsLoading(true);
      const quoteResponse: QuoteVisitorResponse | undefined = location.state?.quote;

      if (!quoteResponse) {
        toast({
          title: "Error",
          description: "No quote data found. Please calculate a new quote.",
          variant: "destructive",
        });
        navigate("/"); // Redirect to home or quote form
        setIsLoading(false);
        return;
      }

      try {
        const mapResponse: MapResponse = await mapAPI.getRouteAndDistance({
          origin: quoteResponse.pickupLocation,
          destination: quoteResponse.deliveryLocation,
        });

        const fullQuoteData: QuoteData = {
          ...quoteResponse,
          distance: mapResponse.distance,
          duration: mapResponse.duration,
          mapImageUrl: mapResponse.mapImageUrl,
        };
        
        setQuoteData(fullQuoteData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch map data",
          variant: "destructive",
        });
        console.error("Error fetching map data:", error);
        // Even if map fails, display quote data if available
        setQuoteData({
          ...quoteResponse,
          distance: "N/A",
          duration: "N/A",
          mapImageUrl: "https://via.placeholder.com/600x400?text=Map+Unavailable", // Placeholder image
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [location.state, navigate]);

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
                <h1 className="text-2xl font-bold">Quote {quoteData.quoteReference}</h1>
              </div>

              {/* Pickup and Delivery Info */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Pickup from</span>
                  <span className="font-semibold">{quoteData.pickupLocation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Delivered to</span>
                  <span className="font-semibold">{quoteData.deliveryLocation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Car Model</span>
                  <span className="font-semibold">{`${quoteData.vehicle.brand} ${quoteData.vehicle.model} ${quoteData.vehicle.year}`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Delivery Date</span>
                  <span className="font-semibold">{quoteData.deliveryDate}</span>
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
                      <p className="text-4xl font-bold text-primary">${quoteData.price}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Down Payment</p>
                          <p className="text-2xl font-bold text-primary">${quoteData.downPayment}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Balance on Delivery</p>
                          <p className="text-2xl font-bold text-primary">${quoteData.balanceOnDelivery}</p>
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
                  {quoteData.pickupLocation}
                </span>
                <div className="flex-1 border-t-2 border-dashed border-muted-foreground max-w-[200px]" />
                <MapPin className="text-primary" />
                <span className="text-muted-foreground">{quoteData.distance}</span> {/* Display distance from map API */}
                <MapPin className="text-primary" />
                <div className="flex-1 border-t-2 border-dashed border-muted-foreground max-w-[200px]" />
                <span className="bg-primary text-white px-4 py-2 rounded-lg">
                  {quoteData.deliveryLocation}
                </span>
              </div>

              {/* Map Container */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
                <div className="aspect-square w-full bg-muted flex items-center justify-center">
                  <img
                    src={quoteData.mapImageUrl}
                    alt="Route Map"
                    className="w-full h-full object-cover"
                    style={{ minHeight: "500px" }}
                  />
                </div>
                {/* Distance overlay */}
                <div className="absolute top-4 right-4 bg-white text-foreground px-3 py-1 rounded-md shadow-sm text-sm font-medium">
                  Distance: {quoteData.distance}
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
