import { useEffect, useState } from "react";
import { getDirections } from "@/services/mapService";

const MapView = ({ initialOrigin, initialDestination, onDistanceChange }: any) => {
  const [directions, setDirections] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const data = await getDirections(initialOrigin, initialDestination);
        setDirections(data);
        if (data?.distance) onDistanceChange(data.distance);
      } catch (err: any) {
        setError(err.message);
      }
    };
    if (initialOrigin && initialDestination) fetchDirections();
  }, [initialOrigin, initialDestination]);

  return (
    <div className="w-full h-[400px] relative">
      {error && <p className="absolute top-2 left-2 bg-red-100 text-red-500 p-2 rounded">{error}</p>}
      {directions ? (
        <iframe
          title="Map"
          width="100%"
          height="100%"
          src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_KEY&origin=${encodeURIComponent(
            initialOrigin
          )}&destination=${encodeURIComponent(initialDestination)}`}
          allowFullScreen
        ></iframe>
      ) : (
        <p className="absolute inset-0 flex items-center justify-center text-gray-500">
          Loading map...
        </p>
      )}
    </div>
  );
};

export default MapView;
