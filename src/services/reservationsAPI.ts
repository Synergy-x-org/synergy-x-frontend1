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
};
