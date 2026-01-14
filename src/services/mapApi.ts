const MAP_API_BASE_URL = "https://synagyx.vercel.app";

export interface MapData {
  origin: string;
  destination: string;
}

export interface MapResponse {
  distance: string;
  duration: string;
  mapUrl: string;
}

export const mapAPI = {
  getRouteAndDistance: async (data: MapData): Promise<MapResponse> => {
    const { origin, destination } = data;
    const response = await fetch(`${MAP_API_BASE_URL}/api/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Map API Error Response:", errorData); // Log error response
      throw new Error(errorData.message || `Failed to fetch map data: ${response.statusText}`);
    }

    const responseData = await response.json(); // Renamed 'data' to 'responseData'
    console.log("Map API Success Response:", responseData); // Log success response
    return responseData;
  },
};
