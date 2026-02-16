// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Card, CardContent } from "@/components/ui/card";
// import { X } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";

// type TrackingApiSuccess = {
//   success: true;
//   message: string;
//   data: {
//     quoteReference: string;
//     pickupAddress: string;
//     deliveryAddress: string;
//     pickupDate: string; // yyyy-mm-dd
//     shipmentStatus: string;
//     deliveryStatus: string;
//     transitProgress: string;
//     createdAt: string; // yyyy-mm-dd
//     updatedAt: string; // yyyy-mm-dd
//   };
//   timestamp: string;
// };

// type TrackingApiNotFound = {
//   success: false;
//   message: string;
//   data: null;
//   timestamp: string;
// };

// type TrackingApiResponse = TrackingApiSuccess | TrackingApiNotFound;

// const TrackShipmentResult: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ get token from auth context
//   const { token } = useAuth() as any;

//   const rawQuoteReference: string | undefined = (location.state as any)?.quoteReference;
//   const quoteReference = (rawQuoteReference || "").trim();

//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [apiData, setApiData] = useState<TrackingApiSuccess["data"] | null>(null);
//   const [apiMessage, setApiMessage] = useState<string>("");
//   const [apiTimestamp, setApiTimestamp] = useState<string>("");

//   useEffect(() => {
//     const run = async () => {
//       if (!quoteReference) {
//         setErrorMsg("Quote reference is missing.");
//         setIsLoading(false);
//         return;
//       }

//       if (!token) {
//         setErrorMsg("You must be logged in to track a shipment.");
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       setErrorMsg(null);
//       setApiMessage("");
//       setApiTimestamp("");
//       setApiData(null);

//       try {
//         const url = `https://synergy-x-transportation-backend.onrender.com/api/v1/tracking/status?quoteReference=${encodeURIComponent(
//           quoteReference
//         )}`;

//         const res = await fetch(url, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         });

//         // ✅ always try to read response body (success OR error)
//         const json = await res.json().catch(() => null);

//         // Helpful debug: open console and you’ll see exactly what backend returned
//         console.log("TRACKING RESPONSE:", res.status, json);

//         const messageFromServer =
//           (json && (json.message || json.error)) ||
//           (res.ok ? "Tracking information retrieved successfully" : `Request failed (${res.status})`);

//         setApiMessage(messageFromServer);
//         setApiTimestamp((json && json.timestamp) || "");

//         if (res.ok && json?.success && json?.data) {
//           setApiData(json.data);
//         } else {
//           // for 400/401/403/404 etc
//           setApiData(null);
//           if (!res.ok) setErrorMsg(messageFromServer);
//         }
//       } catch (err) {
//         setErrorMsg("Unable to retrieve tracking information. Please try again.");
//         setApiData(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     run();
//   }, [quoteReference, token]);

//   const display = useMemo(() => {
//     const formatDate = (yyyyMmDd?: string) => {
//       if (!yyyyMmDd) return "—";
//       const parts = yyyyMmDd.split("-");
//       if (parts.length !== 3) return yyyyMmDd;
//       return `${parts[2]}/${parts[1]}/${parts[0]}`;
//     };

//     const formatTimestamp = (iso?: string) => {
//       if (!iso) return "—";
//       const d = new Date(iso);
//       if (Number.isNaN(d.getTime())) return iso;
//       return d.toLocaleString();
//     };

//     return {
//       quoteReference: apiData?.quoteReference || quoteReference || "—",
//       pickupAddress: apiData?.pickupAddress || "—",
//       deliveryAddress: apiData?.deliveryAddress || "—",
//       pickupDate: formatDate(apiData?.pickupDate),
//       shipmentStatus: apiData?.shipmentStatus || "—",
//       deliveryStatus: apiData?.deliveryStatus || "—",
//       transitProgress: apiData?.transitProgress || "—",
//       createdAt: formatDate(apiData?.createdAt),
//       updatedAt: formatDate(apiData?.updatedAt),
//       message: errorMsg || apiMessage || "—",
//       timestamp: formatTimestamp(apiTimestamp),
//     };
//   }, [apiData, quoteReference, apiMessage, errorMsg, apiTimestamp]);

//   const handleClose = () => {
//     navigate("/track-shipment");
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <Header />

// <div className="flex-1 px-4 mt-28 pb-10 bg-white">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-sm font-medium text-gray-700 mb-4">
//             Shipment tracking info
//           </div>

//           <Card className="w-full bg-white shadow-xl border-0 relative">
//             <button
//               onClick={handleClose}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <CardContent className="p-6">
//               <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
//                 Track shipment
//               </h2>

//               {/* Delivery Address Section */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">
//                   Delivery Address
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-[#E8F5E9] rounded-lg p-4">
//                     <p className="text-xs font-medium text-gray-600 mb-2">
//                       Pickup Address
//                     </p>
//                     <p className="text-sm text-gray-900">
//                       {isLoading ? "Loading..." : display.pickupAddress}
//                     </p>
//                   </div>

//                   <div className="bg-[#E3F2FD] rounded-lg p-4">
//                     <p className="text-xs font-medium text-gray-600 mb-2">
//                       Delivery Address
//                     </p>
//                     <p className="text-sm text-gray-900">
//                       {isLoading ? "Loading..." : display.deliveryAddress}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Quote Reference + Pickup Date */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">
//                     Quote Reference
//                   </p>
//                   <p className="text-sm font-semibold text-gray-900">
//                     {isLoading ? "Loading..." : display.quoteReference}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">
//                     Pickup Date
//                   </p>
//                   <p className="text-sm font-semibold text-gray-900">
//                     {isLoading ? "Loading..." : display.pickupDate}
//                   </p>
//                 </div>
//               </div>

//               {/* Shipment Status + Delivery Status */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">
//                     Shipment Status
//                   </p>
//                   <p className="text-sm font-semibold text-gray-900">
//                     {isLoading ? "Loading..." : display.shipmentStatus}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">
//                     Delivery Status
//                   </p>
//                   <p className="text-sm font-semibold text-gray-900">
//                     {isLoading ? "Loading..." : display.deliveryStatus}
//                   </p>
//                 </div>
//               </div>

//               {/* Transit Progress */}
//               <div className="mb-6">
//                 <p className="text-xs font-medium text-gray-500 mb-1">
//                   Transit Progress
//                 </p>
//                 <div className="rounded-lg border border-gray-200 p-4">
//                   <p className="text-sm text-gray-900">
//                     {isLoading ? "Loading..." : display.transitProgress}
//                   </p>
//                 </div>
//               </div>

//               {/* Created At + Updated At */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">
//                     Created At
//                   </p>
//                   <p className="text-sm font-semibold text-gray-900">
//                     {isLoading ? "Loading..." : display.createdAt}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">
//                     Updated At
//                   </p>
//                   <p className="text-sm font-semibold text-gray-900">
//                     {isLoading ? "Loading..." : display.updatedAt}
//                   </p>
//                 </div>
//               </div>

//               {/* Message + Timestamp */}
//               <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//                   <p className="text-sm text-gray-700">
//                     {isLoading ? "Loading..." : display.message}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {isLoading ? "" : `Timestamp: ${display.timestamp}`}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default TrackShipmentResult;


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
    createdAt: string; // yyyy-mm-dd OR yyyy-mm-dd hh:mm:ss (depending on endpoint)
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

type TrackingEvent = {
  title: string;
  sub?: string;
  time?: string;
  date?: string;
  highlight?: boolean;
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

        const json = await res.json().catch(() => null);

        const messageFromServer =
          (json && (json.message || json.error)) ||
          (res.ok ? "Tracking information retrieved successfully" : `Request failed (${res.status})`);

        setApiMessage(messageFromServer);
        setApiTimestamp((json && json.timestamp) || "");

        if (res.ok && json?.success && json?.data) {
          setApiData(json.data);
        } else {
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

  const ui = useMemo(() => {
    const formatDMY = (value?: string) => {
      if (!value) return "—";

      // supports "yyyy-mm-dd" and "yyyy-mm-dd hh:mm:ss"
      const safe = value.includes(" ") ? value.replace(" ", "T") : value;
      const d = new Date(safe);

      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB");
      }

      // fallback for plain yyyy-mm-dd without Date parsing issues
      const parts = value.split(" ")[0].split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;

      return value;
    };

    const formatTime = (isoOrDate?: string) => {
      if (!isoOrDate) return "";
      const safe = isoOrDate.includes(" ") ? isoOrDate.replace(" ", "T") : isoOrDate;
      const d = new Date(safe);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    };

    const formatDateOnly = (isoOrDate?: string) => {
      if (!isoOrDate) return "";
      const safe = isoOrDate.includes(" ") ? isoOrDate.replace(" ", "T") : isoOrDate;
      const d = new Date(safe);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-GB");
    };

    const pickup = apiData?.pickupAddress || "—";
    const delivery = apiData?.deliveryAddress || "—";

    // Figma says "Booking ID" — but API uses Quote Reference, so we map it
    const bookingIdLabel = apiData?.quoteReference || quoteReference || "—";

    // Figma says "Due Date" — backend has pickupDate only, so we map to that
    const dueDateLabel = formatDMY(apiData?.pickupDate);

    // Build timeline from backend (no new endpoints)
    const events: TrackingEvent[] = [];

    if (apiData) {
      // Top highlight: shipment status (closest to "Shipment Delivered / In Transit")
      const shipmentTitle =
        apiData.shipmentStatus?.toUpperCase() === "DELIVERED"
          ? "Shipment Delivered"
          : apiData.shipmentStatus?.toUpperCase() === "IN_TRANSIT"
          ? "Shipment In Transit"
          : apiData.shipmentStatus?.toUpperCase() === "PICKED_UP"
          ? "Shipment Picked Up"
          : "Shipment Created";

      events.push({
        title: shipmentTitle,
        time: formatTime(apiData.updatedAt || apiTimestamp),
        date: formatDateOnly(apiData.updatedAt || apiTimestamp),
        highlight: true,
      });

      // Transit progress message
      if (apiData.transitProgress) {
        events.push({
          title: apiData.transitProgress,
          time: "",
          date: formatDateOnly(apiData.updatedAt || apiTimestamp),
          highlight: false,
        });
      }

      // Delivery status line
      if (apiData.deliveryStatus) {
        const dTitle =
          apiData.deliveryStatus?.toUpperCase() === "COMPLETED"
            ? "Delivered to Customer Location"
            : `Delivery Status: ${apiData.deliveryStatus}`;
        events.push({
          title: dTitle,
          time: "",
          date: formatDateOnly(apiData.updatedAt || apiTimestamp),
          highlight: false,
        });
      }

      // Created event
      events.push({
        title: "Shipment Created",
        time: formatTime(apiData.createdAt),
        date: formatDateOnly(apiData.createdAt),
        highlight: true,
      });
    }

    const statusLine = errorMsg || apiMessage || "—";

    return {
      pickup,
      delivery,
      bookingIdLabel,
      dueDateLabel,
      statusLine,
      events,
    };
  }, [apiData, quoteReference, apiMessage, errorMsg, apiTimestamp]);

  const handleClose = () => navigate("/track-shipment");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Grey canvas like Figma */}
      <div className="flex-1 bg-[#9AA0A6]/30 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Top-left label */}
          <div className="text-xs font-medium text-gray-600 mb-3">
            Shipment tracking info
          </div>

          {/* Modal card */}
          <Card className="w-full bg-white shadow-xl border-0 relative rounded-xl">
            {/* Close */}
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

                {/* Header strip like figma */}
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

              {/* Booking ID + Due date */}
              <div className="flex items-start justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Booking ID</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : `#${ui.bookingIdLabel}`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? "Loading..." : ui.dueDateLabel}
                  </p>
                </div>
              </div>

              {/* Tracking History */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Tracking History
                </p>

                <div className="relative">
                  {/* line */}
                  <div className="absolute left-[7px] top-1 bottom-1 w-[2px] bg-gray-200" />

                  <div className="space-y-4">
                    {!isLoading &&
                      ui.events.map((ev, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          {/* dot */}
                          <div
                            className={`relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                              ev.highlight
                                ? "bg-[#FF6B35] border-[#FF6B35]"
                                : "bg-white border-gray-300"
                            }`}
                          />

                          <div className="flex-1 flex justify-between items-start gap-4">
                            <p
                              className={`text-sm ${
                                ev.highlight ? "font-medium text-gray-900" : "text-gray-600"
                              }`}
                            >
                              {ev.title}
                            </p>

                            <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                              {ev.time ? <p>{ev.time}</p> : null}
                              {ev.date ? <p>{ev.date}</p> : null}
                            </div>
                          </div>
                        </div>
                      ))}

                    {isLoading && (
                      <div className="text-sm text-gray-500 pl-8">Loading...</div>
                    )}

                    {!isLoading && ui.events.length === 0 && (
                      <div className="text-sm text-gray-500 pl-8">
                        {ui.statusLine || "No tracking updates available."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status message (small, like system note) */}
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
