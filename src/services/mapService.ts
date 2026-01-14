// import axios from "axios";

// const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

// export const getAutocomplete = async (input: string) => {
//   const res = await fetch(`${BASE_URL}/maps/autocomplete?input=${input}`);
//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(`Failed to fetch location suggestions: ${res.status} ${res.statusText}. Response: ${errorText}`);
//   }
//   return res.json();
// };




import axios from "axios";

const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

/* ----------------------------------
   AUTOCOMPLETE
----------------------------------- */
export const getAutocomplete = async (input: string) => {
  const res = await fetch(
    `${BASE_URL}/maps/autocomplete?input=${encodeURIComponent(input)}`
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch location suggestions: ${res.status} ${res.statusText}. Response: ${errorText}`
    );
  }

  return res.json();
};

/* ----------------------------------
   DIRECTIONS
----------------------------------- */
export const getDirections = async (origin: string, destination: string) => {
  const response = await axios.get(`${BASE_URL}/maps/directions`, {
    params: { origin, destination },
  });

  const leg = response.data.routes?.[0]?.legs?.[0];

  if (!leg) throw new Error("No route found");

  return {
    distance: leg.distance.text,
    duration: leg.duration.text,
    mapUrl: response.data.routes?.[0]?.overview_polyline
      ? "" // (depends how you want mapUrl)
      : "",
  };
};





























// export interface DirectionsResponse {
//   distance: string;
//   duration: string;
// }

// export const getDirections = async (
//   origin: string,
//   destination: string
// ): Promise<DirectionsResponse> => {
//   const response = await fetch(
//     `${BASE_URL}/maps/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
//   );

//   const text = await response.text();

//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     console.error("Non-JSON response:", text);
//     throw new Error("Invalid directions response from server");
//   }

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to fetch directions");
//   }

//   return data;
// };



// export const getDirections = async (origin: string, destination: string) => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/maps/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
//     );


//     // Try to parse JSON safely
//     const text = await response.text();
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       // Not JSON — log backend HTML error
//       console.error("Backend returned non-JSON response:", text);
//       throw new Error(`Server error: ${response.status} ${response.statusText}`);
//     }

//     if (!response.ok) {
//       throw new Error(data?.message || `Error: ${response.status}`);
//     }

//     return data;
//   } catch (error) {
//     console.error("Map fetch failed:", error);
//     throw error;
//   }
// };

