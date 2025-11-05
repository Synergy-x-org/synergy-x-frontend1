const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

export const getAutocomplete = async (input: string) => {
  const res = await fetch(`${BASE_URL}/maps/autocomplete?input=${input}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch location suggestions: ${res.status} ${res.statusText}. Response: ${errorText}`);
  }
  return res.json();
};

export const getDirections = async (origin: string, destination: string) => {
  const url = `${BASE_URL}/maps/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  const response = await fetch(url);

  const text = await response.text(); // get raw text
  console.log("Directions API raw response:", text);

  return text; // temporary
};


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

