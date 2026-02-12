import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type TrackingApiSuccess = {
  success: true;
  message: string;
  data: {
    quoteReference: string;
    pickupAddress: string;
    deliveryAddress: string;
    pickupDate: string; // yyyy-mm-dd
    shipmentStatus: string;
    deliveryStatus: string;
    transitProgress: string;
    createdAt: string; // yyyy-mm-dd
    updatedAt: string; // yyyy-mm-dd
  };
  timestamp: string;
};

type TrackingApiNotFound = {
  success: false;
  message: string;
  data: null;
  timestamp: string;
};

type TrackingApiResponse = TrackingApiSuccess | TrackingApiNotFound;

const TrackShipmentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ get token from auth context
  const { token } = useAuth() as any;

  const rawQuoteReference: string | undefined = (location.state as any)?.quoteReference;
  const quoteReference = (rawQuoteReference || "").trim();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiData, setApiData] = useState<TrackingApiSuccess["data"] | null>(null);
  const [apiMessage, setApiMessage] = useState<string>("");
  const [apiTimestamp, setApiTimestamp] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      if (!quoteReference) {
        setErrorMsg("Quote reference is missing.");
        setIsLoading(false);
        return;
      }

      if (!token) {
        setErrorMsg("You must be logged in to track a shipment.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMsg(null);
      setApiMessage("");
      setApiTimestamp("");
      setApiData(null);

      try {
        const url = `https://synergy-x-transportation-backend.onrender.com/api/v1/tracking/status?quoteReference=${encodeURIComponent(
          quoteReference
        )}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        // ✅ always try to read response body (success OR error)
        const json = await res.json().catch(() => null);

        // Helpful debug: open console and you’ll see exactly what backend returned
        console.log("TRACKING RESPONSE:", res.status, json);

        const messageFromServer =
          (json && (json.message || json.error)) ||
          (res.ok ? "Tracking information retrieved successfully" : `Request failed (${res.status})`);

        setApiMessage(messageFromServer);
        setApiTimestamp((json && json.timestamp) || "");

        if (res.ok && json?.success && json?.data) {
          setApiData(json.data);
        } else {
          // for 400/401/403/404 etc
          setApiData(null);
          if (!res.ok) setErrorMsg(messageFromServer);
        }
      } catch (err) {
        setErrorMsg("Unable to retrieve tracking information. Please try again.");
        setApiData(null);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [quoteReference, token]);

  const display = useMemo(() => {
    const formatDate = (yyyyMmDd?: string) => {
      if (!yyyyMmDd) return "—";
      const parts = yyyyMmDd.split("-");
      if (parts.length !== 3) return yyyyMmDd;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const formatTimestamp = (iso?: string) => {
      if (!iso) return "—";
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleString();
    };

    return {
      quoteReference: apiData?.quoteReference || quoteReference || "—",
      pickupAddress: apiData?.pickupAddress || "—",
      deliveryAddress: apiData?.deliveryAddress || "—",
      pickupDate: formatDate(apiData?.pickupDate),
      shipmentStatus: apiData?.shipmentStatus || "—",
      deliveryStatus: apiData?.deliveryStatus || "—",
      transitProgress: apiData?.transitProgress || "—",
      createdAt: formatDate(apiData?.createdAt),
      updatedAt: formatDate(apiData?.updatedAt),
      message: errorMsg || apiMessage || "—",
      timestamp: formatTimestamp(apiTimestamp),
    };
  }, [apiData, quoteReference, apiMessage, errorMsg, apiTimestamp]);

  const handleClose = () => {
    navigate("/track-shipment");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

<div className="flex-1 px-4 pt-27 pb-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm font-medium text-gray-700 mb-4">
            Shipment tracking info
          </div>

          <Card className="w-full bg-white shadow-xl border-0 relative">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Pickup Address
                    </p>
                    <p className="text-sm text-gray-900">
                      {isLoading ? "Loading..." : display.pickupAddress}
                    </p>
                  </div>

                  <div className="bg-[#E3F2FD] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Delivery Address
                    </p>
                    <p className="text-sm text-gray-900">
                      {isLoading ? "Loading..." : display.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote Reference + Pickup Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Quote Reference
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : display.quoteReference}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Pickup Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : display.pickupDate}
                  </p>
                </div>
              </div>

              {/* Shipment Status + Delivery Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Shipment Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : display.shipmentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Delivery Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : display.deliveryStatus}
                  </p>
                </div>
              </div>

              {/* Transit Progress */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Transit Progress
                </p>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-900">
                    {isLoading ? "Loading..." : display.transitProgress}
                  </p>
                </div>
              </div>

              {/* Created At + Updated At */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Created At
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : display.createdAt}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Updated At
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : display.updatedAt}
                  </p>
                </div>
              </div>

              {/* Message + Timestamp */}
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p className="text-sm text-gray-700">
                    {isLoading ? "Loading..." : display.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isLoading ? "" : `Timestamp: ${display.timestamp}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackShipmentResult;
