import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentSuccessful: React.FC = () => {
  const navigate = useNavigate();

  const handleDone = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full mx-4 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" strokeWidth={2} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-semibold text-foreground mb-8">
            Payment Successful!
          </h1>

          {/* Done Button */}
          <Button 
            onClick={handleDone}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-lg text-base font-medium"
          >
            Done
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccessful;
