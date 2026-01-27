import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentDeclined: React.FC = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/quote-step-4");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full mx-4 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
              <X className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-semibold text-foreground mb-8">
            Payment Declined
          </h1>

          {/* Try Again Button */}
          <Button 
            onClick={handleTryAgain}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-lg text-base font-medium"
          >
            Try again
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentDeclined;
