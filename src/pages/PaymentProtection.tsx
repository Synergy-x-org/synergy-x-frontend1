import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Shield } from "lucide-react";

const PaymentProtection: React.FC = () => {
  const navigate = useNavigate();
  const [coverageAmount, setCoverageAmount] = useState("");

  const handleProceedToPayment = () => {
    // TODO: Add your API endpoint here to save coverage selection
    // Example:
    // await api.saveCoverageSelection({
    //   coverageAmount,
    //   coverageCost: "$0" // Calculate based on selection
    // });
    
    navigate("/reservation-payment");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                {/* Step 1 - Completed */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#E85C2B] text-white flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Calculate shipping</span>
                </div>
                <div className="w-16 md:w-24 h-1 bg-[#E85C2B] mx-2" />
                
                {/* Step 2 - Completed */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#E85C2B] text-white flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Pricing</span>
                </div>
                <div className="w-16 md:w-24 h-1 bg-[#E85C2B] mx-2" />
                
                {/* Step 3 - Active */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#E85C2B] text-white flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Confirmation</span>
                </div>
                <div className="w-16 md:w-24 h-1 bg-gray-300 mx-2" />
                
                {/* Step 4 - Pending */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Finish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-center mb-2">Protection Payment</h1>
            <p className="text-gray-500 text-center mb-8">
              Select a coverage level & payment preference to complete your reservation
            </p>

            {/* Shipment Summary */}
            <div className="bg-[#E85C2B] text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <span className="font-medium">Shipment Summary</span>
              <button className="flex items-center gap-1 text-white text-sm hover:underline">
                Edit <Edit2 className="w-3 h-3" />
              </button>
            </div>
            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Shipper Details</p>
                  <p className="font-medium">Justinah Titilayo</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pickup Location</p>
                  <p className="font-medium text-sm">2715 Ash Dr. San Jose, South Dakota 83475</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Delivery Location</p>
                  <p className="font-medium text-sm">2464 Royal Ln. Mesa, New Jersey 45463</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Contact Details</p>
                  <p className="font-medium text-sm">(212) 555-1234</p>
                  <p className="font-medium text-sm">akinpelumijustinah@gmail.com</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Ship Date</p>
                    <p className="font-medium">11/04/2025</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Vehicle Details</p>
                    <p className="font-medium">Honda Ford</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Shipping Rate</p>
                    <p className="font-medium">$1200</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Type */}
            <div className="bg-[#E85C2B] text-white px-4 py-3 rounded-t-lg">
              <span className="font-medium">Coverage Type</span>
            </div>
            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-700 text-sm">
                    Standard protection provides basic liability and covers carriers negligence and equipment failure
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Additional coverage (full or partial) is available for a higher level of protection during transit
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Vehicle</p>
                    <p className="font-medium">Honda Ford</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Coverage Amount</p>
                    <Select value={coverageAmount} onValueChange={setCoverageAmount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Additional Coverage</SelectItem>
                        <SelectItem value="partial">Partial Coverage (+$50)</SelectItem>
                        <SelectItem value="full">Full Coverage (+$100)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Coverage Cost</p>
                    <p className="font-medium">$0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <Button 
              onClick={handleProceedToPayment}
              className="w-full bg-[#E85C2B] hover:bg-[#d14e20] text-white py-6"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentProtection;
