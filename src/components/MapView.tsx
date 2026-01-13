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


import React from "react";

interface Props {
  initialOrigin: string;
  initialDestination: string;
}

const MapView = ({ initialOrigin, initialDestination }: Props) => {
  const mapUrl = `https://synergy-x-transportation-backend.onrender.com/api/v1/maps/directions?origin=${encodeURIComponent(
    initialOrigin
  )}&destination=${encodeURIComponent(initialDestination)}`;

  return (
    <iframe
      src={mapUrl}
      className="w-full h-full rounded-2xl border-none"
      loading="lazy"
    />
  );
};

export default MapView;
//