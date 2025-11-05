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
  const res = await fetch(`${BASE_URL}/maps/directions1?origin=${origin}&destination=${destination}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch directions: ${res.status} ${res.statusText}. Response: ${errorText}`);
  }
  return res.json();
};
