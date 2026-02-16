// TrackShipmentResult.tsx
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
    shipmentStatus: string; // IN_PROGRESS | PICKED_UP | IN_TRANSIT | DELIVERED
    deliveryStatus: string; // PENDING | COMPLETED | etc
    transitProgress: string;
    createdAt: string; // yyyy-mm-dd OR yyyy-mm-dd hh:mm:ss
    updatedAt: string; // yyyy-mm-dd OR yyyy-mm-dd hh:mm:ss
  };
  timestamp: string; // ISO
};

type TrackingApiNotFound = {
  success: false;
  message: string;
  data: null;
  timestamp: string;
};

type TrackingApiResponse = TrackingApiSuccess | TrackingApiNotFound;

type StepKey = "created" | "picked_up" | "in_transit" | "delivered";
type Step = {
  key: StepKey;
  title: string;
  // shown ONLY when this step is active
  activeMessage?: string;
  time?: string;
  date?: string;
};

const TrackShipmentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth() as any;

  const rawQuoteReference: string | undefined = (location.state as any)?.quoteReference;
  const quoteReference = (rawQuoteReference || "").trim();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiData, setApiData] = useState<TrackingApiSuccess["data"] | null>(null);
  const [apiMessage, setApiMessage] = useState<string>("");
  const [apiTimestamp, setApiTimestamp] = useState<string>("");
  const [refreshTick, setRefreshTick] = useState(0);

  // ✅ Auto-refresh so admin updates reflect without user leaving the page
  useEffect(() => {
    // refresh every 6s; change if you want
    const id = window.setInterval(() => setRefreshTick((t) => t + 1), 6000);
    return () => window.clearInterval(id);
  }, []);

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
          cache: "no-store",
        });

        const json: TrackingApiResponse | any = await res.json().catch(() => null);

        const messageFromServer =
          (json && (json.message || json.error)) ||
          (res.ok
            ? "Tracking information retrieved successfully"
            : `Request failed (${res.status})`);

        setApiMessage(messageFromServer);
        setApiTimestamp((json && json.timestamp) || "");

        if (res.ok && json?.success && json?.data) {
          setApiData(json.data);
        } else {
          setApiData(null);
          if (!res.ok) setErrorMsg(messageFromServer);
        }
      } catch {
        setErrorMsg("Unable to retrieve tracking information. Please try again.");
        setApiData(null);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [quoteReference, token, refreshTick]);

  const ui = useMemo(() => {
    const normalizeStatus = (s?: string) => String(s || "").toUpperCase().trim();

    const toSafeDate = (value?: string) => {
      if (!value) return null;
      const safe = value.includes(" ") ? value.replace(" ", "T") : value;
      const d = new Date(safe);
      if (Number.isNaN(d.getTime())) return null;
      return d;
    };

    const formatDMY = (value?: string) => {
      if (!value) return "—";
      const d = toSafeDate(value);
      if (d) return d.toLocaleDateString("en-GB");
      const parts = value.split(" ")[0].split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return value;
    };

    const formatTime = (value?: string) => {
      const d = toSafeDate(value);
      if (!d) return "";
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    };

    const formatDateOnly = (value?: string) => {
      const d = toSafeDate(value);
      if (!d) return "";
      return d.toLocaleDateString("en-GB");
    };

    // ✅ VERY IMPORTANT:
    // Backend status enum: IN_PROGRESS, PICKED_UP, IN_TRANSIT, DELIVERED
    // We map to steps 1..4
    const stepIndex = (status?: string) => {
      const st = normalizeStatus(status);
      if (st === "DELIVERED") return 4;
      if (st === "IN_TRANSIT") return 3;
      if (st === "PICKED_UP") return 2;
      // IN_PROGRESS (and anything else) => created
      return 1;
    };

    const currentStep = stepIndex(apiData?.shipmentStatus);

    const pickup = apiData?.pickupAddress || "—";
    const delivery = apiData?.deliveryAddress || "—";
    const bookingIdLabel = apiData?.quoteReference || quoteReference || "—";
    const dueDateLabel = formatDMY(apiData?.pickupDate);

    const createdAt = apiData?.createdAt;
    const updatedAt = apiData?.updatedAt || apiTimestamp;

    // Best-effort date/time per step:
    // - Created: createdAt
    // - Picked up: use pickupDate if present, else updatedAt when status >= PICKED_UP
    // - In transit: updatedAt when status >= IN_TRANSIT
    // - Delivered: updatedAt when status === DELIVERED
    const createdDate = formatDateOnly(createdAt);
    const createdTime = formatTime(createdAt);

    const pickedUpDate =
      apiData?.pickupDate
        ? formatDMY(apiData.pickupDate)
        : currentStep >= 2
        ? formatDateOnly(updatedAt)
        : "";
    const pickedUpTime = currentStep >= 2 ? formatTime(updatedAt) : "";

    const inTransitDate = currentStep >= 3 ? formatDateOnly(updatedAt) : "";
    const inTransitTime = currentStep >= 3 ? formatTime(updatedAt) : "";

    const deliveredDate = currentStep >= 4 ? formatDateOnly(updatedAt) : "";
    const deliveredTime = currentStep >= 4 ? formatTime(updatedAt) : "";

    // ✅ transitProgress shown under CURRENT ACTIVE STEP only (as you asked)
    const transitProgressMsg =
      (apiData?.transitProgress && apiData.transitProgress.trim()) ||
      "Status updated.";

    const steps: Step[] = [
      {
        key: "created",
        title: "Shipment Created",
        activeMessage:
          currentStep === 1 ? transitProgressMsg : undefined,
        time: createdTime,
        date: createdDate,
      },
      {
        key: "picked_up",
        title: "Shipment Picked Up",
        activeMessage:
          currentStep === 2 ? transitProgressMsg : undefined,
        time: pickedUpTime,
        date: pickedUpDate,
      },
      {
        key: "in_transit",
        title: "Shipment In Transit",
        activeMessage:
          currentStep === 3 ? transitProgressMsg : undefined,
        time: inTransitTime,
        date: inTransitDate,
      },
      {
        key: "delivered",
        title: "Shipment Delivered",
        activeMessage:
          currentStep === 4 ? transitProgressMsg : undefined,
        time: deliveredTime,
        date: deliveredDate,
      },
    ];

    const statusLine = errorMsg || apiMessage || "—";

    return {
      pickup,
      delivery,
      bookingIdLabel,
      dueDateLabel,
      statusLine,
      steps,
      currentStep,
      rawStatus: normalizeStatus(apiData?.shipmentStatus),
    };
  }, [apiData, quoteReference, apiMessage, errorMsg, apiTimestamp]);

  const handleClose = () => navigate("/track-shipment");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Grey canvas like Figma */}
      <div className="flex-1 bg-[#9AA0A6]/30 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-medium text-gray-600 mb-3">
            Shipment tracking info
          </div>

          <Card className="w-full bg-white shadow-xl border-0 relative rounded-xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <CardContent className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-center text-gray-900 mb-6">
                Track shipment
              </h2>

              {/* Delivery Address */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Delivery Address
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-100 bg-[#FFF3EE]">
                    <div className="px-4 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
                      Pickup Location
                    </div>
                    <div className="px-4 py-3 text-sm text-gray-900">
                      {isLoading ? "Loading..." : ui.pickup}
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-[#FFF3EE]">
                    <div className="px-4 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
                      Delivery Location
                    </div>
                    <div className="px-4 py-3 text-sm text-gray-900">
                      {isLoading ? "Loading..." : ui.delivery}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking ID + Due Date */}
              <div className="flex items-start justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Booking ID
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : `#${ui.bookingIdLabel}`}
                  </p>
                </div>

                {/* <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : ui.dueDateLabel}
                  </p>
                </div> */}
              </div>

              {/* Tracking History (4 steps) */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Tracking History
                </p>

                <div className="relative">
                  {/* vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-200" />

                  <div className="space-y-5">
                    {isLoading ? (
                      <div className="text-sm text-gray-500 pl-8">Loading...</div>
                    ) : (
                      ui.steps.map((s, idx) => {
                        const stepNumber = idx + 1;
                        const isDone = stepNumber <= ui.currentStep;
                        const isActive = stepNumber === ui.currentStep;

                        return (
                          <div key={s.key} className="flex items-start gap-4">
                            {/* dot */}
                            <div
                              className={`relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 ${
                                isDone
                                  ? "bg-[#FF6B35] border-[#FF6B35]"
                                  : "bg-white border-gray-300"
                              }`}
                            />

                            {/* content */}
                            <div className="flex-1 flex justify-between items-start gap-6">
                              <div>
                                <p
                                  className={`text-sm ${
                                    isDone
                                      ? "font-medium text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {s.title}
                                </p>

                                {/* ✅ Only show transitProgress under ACTIVE step */}
                                {isActive && s.activeMessage && (
                                  <p className="text-xs text-gray-500 mt-1 max-w-[420px]">
                                    {s.activeMessage}
                                  </p>
                                )}
                              </div>

                              <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                                {s.time ? <p>{s.time}</p> : <p>&nbsp;</p>}
                                {s.date ? <p>{s.date}</p> : <p>&nbsp;</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Optional tiny debug line (remove if you don’t want) */}
                {!isLoading && (
                  <p className="text-[11px] text-gray-400 mt-3">
                    Current status: {ui.rawStatus || "—"} (auto-refreshing)
                  </p>
                )}
              </div>

              {/* Status message */}
              {!isLoading && ui.statusLine && (
                <p className="text-xs text-gray-500 mt-6">{ui.statusLine}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackShipmentResult;
