import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface TrackingEvent {
  status: string;
  description: string;
  time: string;
  date: string;
  isHighlight?: boolean;
}

const TrackShipmentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // TODO: Fetch actual tracking data from API using location.state.bookingId
  // Mock data for demonstration
  const trackingData = {
    pickupLocation: "2715 Ash Dr. San Jose, South Dakota 83475",
    deliveryLocation: "2464 Royal Ln. Mesa, New Jersey 45463",
    bookingId: "#1034567",
    dueDate: "27/12/2025",
    trackingHistory: [
      {
        status: "Shipment Delivered",
        description: "",
        time: "2:45PM",
        date: "16/12/2025",
        isHighlight: true,
      },
      {
        status: "Delivered to Customer Location",
        description: "",
        time: "",
        date: "16/12/2025",
        isHighlight: false,
      },
      {
        status: "Shipment In Transit",
        description: "",
        time: "10:15AM",
        date: "16/12/2025",
        isHighlight: true,
      },
      {
        status: "Departed from Service Center South Dakota",
        description: "",
        time: "",
        date: "16/12/2025",
        isHighlight: false,
      },
      {
        status: "Shipment Created",
        description: "",
        time: "8:22AM",
        date: "16/12/2025",
        isHighlight: true,
      },
      {
        status: "Shipment Created At Service Center South Dakota",
        description: "",
        time: "",
        date: "16/12/2025",
        isHighlight: false,
      },
    ] as TrackingEvent[],
  };

  const handleClose = () => {
    navigate("/track-shipment");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section with Modal Overlay */}
      <div className="relative">
        {/* Background Image */}
        <div
          className="w-full h-[600px] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Shipment tracking info label */}
        <div className="absolute top-4 left-4 text-white text-sm font-medium">
          Shipment tracking info
        </div>

        {/* Result Modal Overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <Card className="w-full max-w-lg bg-white shadow-xl border-0 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
                Track shipment
              </h2>

              {/* Delivery Address Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Delivery Address
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Pickup Location */}
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Pickup Location
                    </p>
                    <p className="text-sm text-gray-900">
                      {trackingData.pickupLocation}
                    </p>
                  </div>
                  {/* Delivery Location */}
                  <div className="bg-[#E3F2FD] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Delivery Location
                    </p>
                    <p className="text-sm text-gray-900">
                      {trackingData.deliveryLocation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking ID and Due Date */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Booking ID
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {trackingData.bookingId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {trackingData.dueDate}
                  </p>
                </div>
              </div>

              {/* Tracking History */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Tracking History
                </h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-200" />

                  <div className="space-y-4">
                    {trackingData.trackingHistory.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        {/* Timeline dot */}
                        <div
                          className={`relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            event.isHighlight
                              ? "bg-[#FF6B35] border-[#FF6B35]"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {/* Event content */}
                        <div className="flex-1 flex justify-between items-start">
                          <p
                            className={`text-sm ${
                              event.isHighlight
                                ? "font-medium text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {event.status}
                          </p>
                          <div className="text-right text-xs text-gray-500 whitespace-nowrap ml-4">
                            {event.time && <p>{event.time}</p>}
                            <p>{event.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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

export default TrackShipmentResult;
