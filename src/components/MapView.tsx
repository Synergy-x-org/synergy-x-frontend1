// import { useEffect, useState } from "react";
// import { getDirections } from "@/services/mapService";
// import type { DirectionsResponse } from "@/services/mapService";

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
//   const [mapUrl, setMapUrl] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDirections = async () => {
//       try {
//         const data = await getDirections(initialOrigin, initialDestination);

//         if (data.distance && onDistanceChange) {
//           onDistanceChange(data.distance);
//         }

//         // 👇 IMPORTANT: backend must return a usable map url
//         setMapUrl(data.mapUrl);
//       } catch (err: any) {
//         setError(err.message);
//       }
//     };

//     if (initialOrigin && initialDestination) {
//       fetchDirections();
//     }
//   }, [initialOrigin, initialDestination]);

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-full text-red-500">
//         {error}
//       </div>
//     );
//   }

//   if (!mapUrl) {
//     return (
//       <div className="flex items-center justify-center h-full text-muted-foreground">
//         Loading map...
//       </div>
//     );
//   }

//   return (
//     <iframe
//       src={mapUrl}
//       className="w-full h-full rounded-2xl"
//       loading="lazy"
//       referrerPolicy="no-referrer-when-downgrade"
//     />
//   );
// };

// export default MapView;


import React, { useEffect, useState } from "react";
import { getDirections } from "@/services/mapService";


interface Props {
  initialOrigin: string;
  initialDestination: string;
  onDistanceChange?: (distance: string) => void;
}

const MapView = ({ initialOrigin, initialDestination, onDistanceChange }: Props) => {
  const [mapSrc, setMapSrc] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError(null);
        setMapSrc("");

        if (!initialOrigin || !initialDestination) return;

        const data = await getDirections(initialOrigin, initialDestination);
        // data = { distance, duration, mapUrl }

        if (cancelled) return;

        setMapSrc(data.mapUrl);
        onDistanceChange?.(data.distance);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load map");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [initialOrigin, initialDestination, onDistanceChange]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (!mapSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
        Loading map...
      </div>
    );
  }

  return (
    <iframe
      title="Route map"
      src={mapSrc}
      className="w-full h-full rounded-2xl border-none"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default MapView;
