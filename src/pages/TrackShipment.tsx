import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Hash } from "lucide-react";

const TrackShipment: React.FC = () => {
  const navigate = useNavigate();
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingId, setBookingId] = useState("");

  const handleSearch = () => {
    // TODO: API endpoint to search shipment
    // For now, navigate to result page with mock data
    navigate("/track-shipment-result", {
      state: {
        bookingEmail,
        bookingId,
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

        {/* Form Card Overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
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

              {/* Booking ID */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking ID
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g #1101342"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
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

      {/* Services We Offer Section */}
      <div className="py-16 px-4 bg-white">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-10">
          Services We Offer
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Open Auto Transport */}
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
              alt="Open Auto Transport"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Open Auto Transport
              </h3>
              <p className="text-sm text-gray-500">
                The most affordable option for standard cars, using open-air
                trailers to transport multiple vehicles.
              </p>
            </div>
          </div>

          {/* Door-to-Door Auto Transport */}
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80"
              alt="Door-to-Door Auto Transport"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Door-to-Door Auto Transport
              </h3>
              <p className="text-sm text-gray-500">
                Convenient pickup and delivery directly to your specified
                locations.
              </p>
            </div>
          </div>

          {/* Enclosed Auto Transport */}
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80"
              alt="Enclosed Auto Transport"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Enclosed Auto Transport
              </h3>
              <p className="text-sm text-gray-500">
                Premium protection for luxury, classic, or high-value vehicles
                in enclosed trailers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackShipment;
