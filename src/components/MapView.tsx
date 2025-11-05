import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAutocomplete, getDirections } from '../services/mapService';
import '../styles/map.css';

// Fix for default marker icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Location {
  name: string;
  coordinates: [number, number];
}

interface DirectionsData {
  distance: string;
  path: [number, number][];
  origin: [number, number];
  destination: [number, number];
}

interface MapViewProps {
  initialOrigin?: string;
  initialDestination?: string;
  onOriginChange?: (origin: string) => void;
  onDestinationChange?: (destination: string) => void;
  onDistanceChange?: (distance: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
  initialOrigin = '',
  initialDestination = '',
  onOriginChange,
  onDestinationChange,
  onDistanceChange,
}) => {
  const [originInput, setOriginInput] = useState(initialOrigin);
  const [destinationInput, setDestinationInput] = useState(initialDestination);
  const [originSuggestions, setOriginSuggestions] = useState<Location[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Location[]>([]);
  const [directions, setDirections] = useState<DirectionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (input: string, setSuggestions: React.Dispatch<React.SetStateAction<Location[]>>) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const data: string[] = await getAutocomplete(input); // Explicitly type data as string[]
      if (Array.isArray(data)) {
        const mappedSuggestions = data.map((s: string) => ({
          name: s,
          coordinates: [0, 0] as [number, number], // Placeholder coordinates, as the API only returns names
        }));
        setSuggestions(mappedSuggestions);
      } else {
        console.error("Autocomplete API did not return an array:", data);
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching autocomplete suggestions:", err);
      setSuggestions([]);
    }
  }, []);


  const handleOriginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOriginInput(value);
    onOriginChange?.(value);
    fetchSuggestions(value, setOriginSuggestions);
  };

  const handleDestinationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationInput(value);
    onDestinationChange?.(value);
    fetchSuggestions(value, setDestinationSuggestions);
  };

  const selectOrigin = (location: Location) => {
    setOriginInput(location.name);
    onOriginChange?.(location.name);
    setOriginSuggestions([]);
  };

  const selectDestination = (location: Location) => {
    setDestinationInput(location.name);
    onDestinationChange?.(location.name);
    setDestinationSuggestions([]);
  };

  const fetchDirections = useCallback(async () => {
    if (originInput && destinationInput) {
      setLoading(true);
      setError(null);
      try {
        const data = await getDirections(originInput, destinationInput);
        setDirections({
          distance: data.distance,
          path: data.path.map((p: any) => [p.latitude, p.longitude]),
          origin: [data.origin.latitude, data.origin.longitude],
          destination: [data.destination.latitude, data.destination.longitude],
        });
        onDistanceChange?.(data.distance);
      } catch (err) {
        console.error("Error fetching directions:", err);
        setError("Failed to fetch route. Please try again.");
        setDirections(null);
        onDistanceChange?.('');
      } finally {
        setLoading(false);
      }
    }
  }, [originInput, destinationInput, onDistanceChange]);

  useEffect(() => {
    fetchDirections();
  }, [fetchDirections]);

  function MapUpdater({ directions }: { directions: DirectionsData | null }) {
    const map = useMap();
    useEffect(() => {
      if (directions && directions.path.length > 0) {
        const bounds = L.latLngBounds(directions.path);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, directions]);
    return null;
  }

  return (
    <div className="map-view-container">
      <div className="map-display-card">
        <div className="input-fields-overlay"> {/* New container for inputs */}
          <div className="input-group">
            <label htmlFor="origin-input">Pickup Location</label>
            <input
              id="origin-input"
              type="text"
              value={originInput}
              onChange={handleOriginInputChange}
              placeholder="Enter pickup location"
              ref={originInputRef}
            />
            {originSuggestions.length > 0 && (
              <ul className="suggestions-dropdown" style={{ top: (originInputRef.current?.offsetHeight || 0) + 'px' }}>
                {originSuggestions.map((loc, index) => (
                  <li key={index} onClick={() => selectOrigin(loc)}>
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="destination-input">Delivery Location</label>
            <input
              id="destination-input"
              type="text"
              value={destinationInput}
              onChange={handleDestinationInputChange}
              placeholder="Enter delivery location"
              ref={destinationInputRef}
            />
            {destinationSuggestions.length > 0 && (
              <ul className="suggestions-dropdown" style={{ top: (destinationInputRef.current?.offsetHeight || 0) + 'px' }}>
                {destinationSuggestions.map((loc, index) => (
                  <li key={index} onClick={() => selectDestination(loc)}>
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {loading && <div className="loading-indicator">Loading route...</div>}
        {error && <div className="error-message">{error}</div>}
        {directions && (
          <div className="distance-label">
            {originInput} → {destinationInput} — {directions.distance}
          </div>
        )}
          <MapContainer center={[0, 0] as any} zoom={2} className="leaflet-container" attributionControl={false} >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' as any}
            />
            {directions && (
              <>
                <Polyline positions={directions.path} pathOptions={{ color: '#FF7F50', weight: 5 }} />
                <Marker position={directions.origin}>
                  <Popup>Origin: {originInput}</Popup>
                </Marker>
                <Marker position={directions.destination}>
                  <Popup>Destination: {destinationInput}</Popup>
                </Marker>
                <MapUpdater directions={directions} />
              </>
            )}
          </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
