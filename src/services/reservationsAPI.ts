// ✅ Updated File: reservationapi.ts
const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

export type SecureReservationPayload = {
  quoteReference: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupContactName: string;
  pickupContactPrimaryPhoneNumber: string;
  deliveryContactName: string;
  deliveryContactPrimaryPhoneNumber: string;
  pickUpResidenceType: "RESIDENTIAL" | "BUSINESS";
  deliveryResidentialType: "RESIDENTIAL" | "BUSINESS";
};

export type MyReservation = {
  reservationId: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  reservationDate?: string;
  pickupDate?: string;
  deliveryDate?: string;
  vehicle?: string;
  price?: number;
  status?: string; // "ACTIVE", "PENDING", ...
  quoteReference?: string;
};

export const reservationsAPI = {
  secure: async (payload: SecureReservationPayload) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in.");

    const res = await fetch(`${BASE_URL}/reservations/secure`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!res.ok) throw new Error(data.message || "Failed to secure reservation");
    return data;
  },

  // ✅ NEW: Get authenticated user's reservations
  getMyReservations: async (): Promise<MyReservation[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in.");

    const res = await fetch(`${BASE_URL}/reservations/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!res.ok) throw new Error(data.message || "Failed to fetch reservations");
    return Array.isArray(data.data) ? data.data : [];
  },
};
