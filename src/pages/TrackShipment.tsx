import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Hash } from "lucide-react";
import ServicesWeOffer from "@/components/ServicesWeOffer";

const TrackShipment: React.FC = () => {
  const navigate = useNavigate();
  const [bookingEmail, setBookingEmail] = useState("");
  const [quoteReference, setQuoteReference] = useState("");

  const handleSearch = () => {
    navigate("/track-shipment-result", {
      state: {
        bookingEmail,
        quoteReference,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section with Form Overlay */}
      <div className="relative">
        {/* Background Image */}
        <div
          className="w-full h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Form Card Overlay (moved down) */}
        <div className="absolute inset-0 flex items-start justify-center px-4 pt-20 md:pt-28">
          <Card className="w-full max-w-md bg-white shadow-xl border-0">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Track a shipment
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Enter the details of your booking below to access the Synergy X
                Auto Transport tracking portal.
              </p>

              {/* Booking Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="akinpelumijustnah@gmail.com"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200"
                  />
                </div>
              </div>

              {/* Quote Reference */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote Reference
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g 24041b03"
                    value={quoteReference}
                    onChange={(e) => setQuoteReference(e.target.value)}
                    className="pl-10 h-12 border-gray-200"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full h-12 bg-[#FF6B35] hover:bg-[#e55a2a] text-white font-medium"
              >
                Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ServicesWeOffer />

      <Footer />
    </div>
  );
};

export default TrackShipment;
