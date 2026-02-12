// // import { useEffect, useState } from "react";
// // import { getDirections } from "@/services/mapService";
// // import type { DirectionsResponse } from "@/services/mapService";

// // interface Props {
// //   initialOrigin: string;
// //   initialDestination: string;
// //   onDistanceChange?: (distance: string) => void;
// // }

// // const MapView = ({
// //   initialOrigin,
// //   initialDestination,
// //   onDistanceChange,
// // }: Props) => {
// //   const [mapUrl, setMapUrl] = useState<string | null>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchDirections = async () => {
// //       try {
// //         const data = await getDirections(initialOrigin, initialDestination);

// //         if (data.distance && onDistanceChange) {
// //           onDistanceChange(data.distance);
// //         }

// //         // 👇 IMPORTANT: backend must return a usable map url
// //         setMapUrl(data.mapUrl);
// //       } catch (err: any) {
// //         setError(err.message);
// //       }
// //     };

// //     if (initialOrigin && initialDestination) {
// //       fetchDirections();
// //     }
// //   }, [initialOrigin, initialDestination]);

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center h-full text-red-500">
// //         {error}
// //       </div>
// //     );
// //   }

// //   if (!mapUrl) {
// //     return (
// //       <div className="flex items-center justify-center h-full text-muted-foreground">
// //         Loading map...
// //       </div>
// //     );
// //   }

// //   return (
// //     <iframe
// //       src={mapUrl}
// //       className="w-full h-full rounded-2xl"
// //       loading="lazy"
// //       referrerPolicy="no-referrer-when-downgrade"
// //     />
// //   );
// // };

// // export default MapView;


// // import React, { useEffect, useState } from "react";
// // import { getDirections } from "@/services/mapService";


// // interface Props {
// //   initialOrigin: string;
// //   initialDestination: string;
// //   onDistanceChange?: (distance: string) => void;
// // }

// // const MapView = ({ initialOrigin, initialDestination, onDistanceChange }: Props) => {
// //   const [mapSrc, setMapSrc] = useState<string>("");
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     let cancelled = false;

// //     const load = async () => {
// //       try {
// //         setError(null);
// //         setMapSrc("");

// //         if (!initialOrigin || !initialDestination) return;

// //         const data = await getDirections(initialOrigin, initialDestination);
// //         // data = { distance, duration, mapUrl }

// //         if (cancelled) return;

// //         setMapSrc(data.mapUrl);
// //         onDistanceChange?.(data.distance);
// //       } catch (e: any) {
// //         if (cancelled) return;
// //         setError(e?.message ?? "Failed to load map");
// //       }
// //     };

// //     load();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [initialOrigin, initialDestination, onDistanceChange]);

// //   if (error) {
// //     return (
// //       <div className="w-full h-full flex items-center justify-center text-sm text-red-600 p-4">
// //         {error}
// //       </div>
// //     );
// //   }

// //   if (!mapSrc) {
// //     return (
// //       <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
// //         Loading map...
// //       </div>
// //     );
// //   }

// //   return (
// //     <iframe
// //       title="Route map"
// //       src={mapSrc}
// //       className="w-full h-full rounded-2xl border-none"
// //       loading="lazy"
// //       allowFullScreen
// //       referrerPolicy="no-referrer-when-downgrade"
// //     />
// //   );
// // };

// // export default MapView;



// import React, { useEffect, useState } from "react";
// import { getDirections } from "@/services/mapService";

// interface Props {
//   initialOrigin: string;
//   initialDestination: string;
//   onDistanceChange?: (distance: string) => void;
// }

// const MapView = ({
//   initialOrigin,
//   initialDestination,
//   onDistanceChange,
// }: Props) => {
//   const [mapUrl, setMapUrl] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     const load = async () => {
//       try {
//         setError(null);
//         setLoading(true);

//         if (!initialOrigin || !initialDestination) return;

//         const data = await getDirections(initialOrigin, initialDestination);

//         if (cancelled) return;

//         setMapUrl(data.mapUrl);
//         onDistanceChange?.(data.distance);
//       } catch (e: any) {
//         if (cancelled) return;
//         setError(e?.message ?? "Failed to load map data");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, [initialOrigin, initialDestination, onDistanceChange]);

//   if (loading) {
//     return (
//       <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
//         Loading map...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full h-full flex items-center justify-center text-sm text-red-600 p-4">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
//       {/* <div className="text-sm text-muted-foreground text-center">
//         Google Maps does not allow embedding this route directly.
//       </div> */}

//       <a
//         href={mapUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
//       >
//         View Route on Google Maps
//       </a>
//     </div>
//   );
// };

// export default MapView;

import React, { useEffect, useMemo, useState } from "react";
import { getDirections } from "@/services/mapService";

interface Props {
  initialOrigin: string;
  initialDestination: string;
  onDistanceChange?: (distance: string) => void;
  onDurationChange?: (duration: string) => void;
}

function buildGoogleMapsUrl(origin: string, destination: string) {
  const o = encodeURIComponent(origin || "");
  const d = encodeURIComponent(destination || "");
  return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}`;
}

export default function MapView({
  initialOrigin,
  initialDestination,
  onDistanceChange,
  onDurationChange,
}: Props) {
  const [mapUrl, setMapUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fallbackUrl = useMemo(() => {
    // fallback always works even if backend fails
    return buildGoogleMapsUrl(initialOrigin, initialDestination);
  }, [initialOrigin, initialDestination]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // If missing values, don’t call API
      if (!initialOrigin?.trim() || !initialDestination?.trim()) {
        setMapUrl("");
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getDirections(initialOrigin, initialDestination);

        if (cancelled) return;

        // If API didn’t return mapUrl, use fallback
        const safeUrl = data.mapUrl?.trim() ? data.mapUrl : fallbackUrl;
        setMapUrl(safeUrl);

        // ✅ Ensure distance updates when available
        if (data.distance?.trim()) onDistanceChange?.(data.distance);

        // Optional duration callback
        if (data.duration?.trim()) onDurationChange?.(data.duration);
      } catch (e: any) {
        if (cancelled) return;

        // ✅ Better error message extraction
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Failed to load map route. Try a more specific pickup/delivery location.";

        setError(msg);

        // Still give the user a working map link
        setMapUrl(fallbackUrl);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [
    initialOrigin,
    initialDestination,
    fallbackUrl,
    onDistanceChange,
    onDurationChange,
  ]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
        Loading route...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
      {error ? (
        <div className="text-sm text-red-600 text-center max-w-md">
          {error}
          <div className="text-xs text-muted-foreground mt-2">
            Tip: Use suggestions from autocomplete (e.g. “Benin City, Edo,
            Nigeria”) instead of only a state name.
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center max-w-md">
          Click below to view the route on Google Maps.
        </div>
      )}

      <a
        href={mapUrl || fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
      >
        View Route on Google Maps
      </a>
    </div>
  );
}