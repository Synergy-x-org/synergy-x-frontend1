// src/services/paymentsAPI.ts
const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export type CheckoutSessionResponse = {
  status?: string; // "PENDING" etc
  sessionId: string;
  sessionUrl: string;
  reservationId?: string;
  quoteReference?: string;
  amount?: number;
};

export type PaymentStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "REJECTED"
  | "EXPIRED";

export type PaymentStatusResponse = {
  sessionId: string;
  status: PaymentStatus;
  message?: string;
  reservationId?: string;
  quoteReference?: string;
};

export const paymentsAPI = {
  // ✅ Create Stripe checkout session using reservationId
  createCheckoutSession: async (
    reservationId: string
  ): Promise<CheckoutSessionResponse> => {
    if (!reservationId) throw new Error("reservationId is required");

    const res = await fetch(
      `${BASE_URL}/payments/checkout?reservationId=${encodeURIComponent(
        reservationId
      )}`,
      { method: "GET" }
    );

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || "Failed to create payment session");

    // backend shape: { success, message, data: {...} }
    return data?.data as CheckoutSessionResponse;
  },

  // ✅ Poll Stripe session status using sessionId
  getPaymentStatus: async (sessionId: string): Promise<PaymentStatusResponse> => {
    if (!sessionId) throw new Error("sessionId is required");

    const res = await fetch(
      `${BASE_URL}/payments/status?sessionId=${encodeURIComponent(sessionId)}`,
      { method: "GET" }
    );

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || "Failed to fetch payment status");

    return data?.data as PaymentStatusResponse;
  },
};
