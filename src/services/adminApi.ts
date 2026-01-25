// src/services/adminApi.ts
const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

export type AdminMetrics = {
  totalUsers: number;
  totalReservations: number;
  successfulShipments: number;
};

export type AdminReservation = {
  reservationId: string;
  pickupAddress: string;
  deliveryAddress: string;
  reservationDate: string;
  pickupDate: string;
  deliveryDate: string;
  vehicle: string;
  price: number;
  downPayment: number;
  balanceOnDelivery: number;
  quoteReference: string;
  status: string; // ACTIVE, SUCCESSFUL, etc
};

async function getJson(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || text || "Request failed";
    throw new Error(msg);
  }

  return data;
}

export const adminAPI = {
  getMetrics: async (token: string): Promise<AdminMetrics> => {
    const json = await getJson(`${BASE_URL}/admin/dashboard/metrics`, token);
    return json?.data;
  },

  getReservations: async (token: string): Promise<AdminReservation[]> => {
    const json = await getJson(`${BASE_URL}/admin/reservations`, token);
    return json?.data || [];
  },
};
