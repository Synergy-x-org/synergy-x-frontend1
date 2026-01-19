// // ✅ Updated File: src/services/reservationsAPI.ts
// const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

// export type UserProfileReservation = {
//   reservationId: string;
//   quoteReference?: string;
//   status?: string; // "SUCCESSFUL" | "PENDING" | "FAILED" | etc
//   amount?: number;
//   createdAt?: string;
// };

// export type UserProfileQuoteReservation = {
//   reservationId: string;
//   quoteReference?: string;
//   status?: string;
//   amount?: number;
// };

// const resolveToken = (token?: string | null) => token || localStorage.getItem("synergyx_token");

// const safeJson = async (res: Response) => {
//   const text = await res.text();
//   try {
//     return JSON.parse(text);
//   } catch {
//     return { message: text };
//   }
// };

// export const reservationsAPI = {
//   // ✅ WORKING: list for authenticated user
//   getUserProfileReservations: async (tokenArg?: string | null): Promise<UserProfileReservation[]> => {
//     const token = resolveToken(tokenArg);
//     if (!token) throw new Error("You must be logged in.");

//     const res = await fetch(`${BASE_URL}/user-profile/reservations`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await safeJson(res);
//     if (!res.ok) throw new Error(data.message || "Failed to fetch reservations");
//     return Array.isArray(data.data) ? data.data : [];
//   },

//   // ✅ WORKING: quote search under user-profile
//   getUserProfileByQuoteReference: async (
//     quoteReference: string,
//     tokenArg?: string | null
//   ): Promise<UserProfileQuoteReservation | null> => {
//     const token = resolveToken(tokenArg);
//     if (!token) throw new Error("You must be logged in.");

//     const res = await fetch(`${BASE_URL}/user-profile/quote/${quoteReference}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await safeJson(res);
//     if (!res.ok) throw new Error(data.message || "Failed to fetch reservation");
//     return data?.data ?? null;
//   },
// };


// ✅ Add to src/services/reservationsAPI.ts

// src/services/reservationsAPI.ts
// const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

// export type ReservationDetails = {
//   reservationId: string;
//   pickupAddress?: string;
//   deliveryAddress?: string;
//   reservationDate?: string;
//   pickupDate?: string;
//   deliveryDate?: string;
//   vehicle?: string;
//   price?: number;
//   quoteReference?: string;
//   status?: string;
// };

// export type UserProfileReservation = {
//   reservationId: string;
//   quoteReference?: string;
//   status?: string; // "SUCCESSFUL" | "PENDING" | "FAILED" | etc
//   amount?: number;
//   createdAt?: string;
// };

// export type UserProfileQuoteReservation = {
//   reservationId: string;
//   quoteReference?: string;
//   status?: string;
//   amount?: number;
// };

// // ✅ helpers MUST live OUTSIDE the object
// const resolveToken = (token?: string | null) =>
//   token || localStorage.getItem("synergyx_token");

// const safeJson = async (res: Response) => {
//   const text = await res.text();
//   try {
//     return JSON.parse(text);
//   } catch {
//     return { message: text };
//   }
// };

// export const reservationsAPI = {
//   // ✅ USER PROFILE: list reservations (works even when /reservations/me is 500)
//   getUserProfileReservations: async (
//     tokenArg?: string | null
//   ): Promise<UserProfileReservation[]> => {
//     const token = resolveToken(tokenArg);
//     if (!token) throw new Error("You must be logged in.");

//     const res = await fetch(`${BASE_URL}/user-profile/reservations`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await safeJson(res);
//     if (!res.ok) throw new Error(data.message || "Failed to fetch reservations");
//     return Array.isArray(data.data) ? data.data : [];
//   },

//   // ✅ USER PROFILE: get by quote reference
//   getUserProfileByQuoteReference: async (
//     quoteReference: string,
//     tokenArg?: string | null
//   ): Promise<UserProfileQuoteReservation | null> => {
//     const token = resolveToken(tokenArg);
//     if (!token) throw new Error("You must be logged in.");

//     const res = await fetch(`${BASE_URL}/user-profile/quote/${quoteReference}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await safeJson(res);

//     // if not found, backend returns success:false sometimes
//     if (!res.ok) {
//       // If backend uses 404 or similar, return null (don’t crash UI)
//       return null;
//     }

//     return data?.data ?? null;
//   },

//   // 🟡 5) Get Reservations by Date Range
//   getByDateRange: async (
//     startDate: string,
//     endDate: string,
//     tokenArg?: string | null
//   ): Promise<ReservationDetails[]> => {
//     const token = resolveToken(tokenArg);
//     if (!token) throw new Error("You must be logged in.");

//     const url = `${BASE_URL}/reservations/date-range?startDate=${encodeURIComponent(
//       startDate
//     )}&endDate=${encodeURIComponent(endDate)}`;

//     const res = await fetch(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await safeJson(res);
//     if (!res.ok) throw new Error(data.message || "Failed to fetch reservations");
//     return Array.isArray(data.data) ? data.data : [];
//   },

//   // 🔵 6) Get Location Suggestions
//   getLocationSuggestions: async (
//     keyword: string,
//     tokenArg?: string | null
//   ): Promise<string[]> => {
//     const token = resolveToken(tokenArg);
//     if (!token) throw new Error("You must be logged in.");

//     const url = `${BASE_URL}/reservations/location/suggest?keyword=${encodeURIComponent(
//       keyword
//     )}`;

//     const res = await fetch(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await safeJson(res);
//     if (!res.ok) throw new Error(data.message || "Failed to fetch suggestions");
//     return Array.isArray(data.data) ? data.data : [];
//   },

  
// };


// reservationsApi.ts (or wherever your reservationsAPI object lives)
// ✅ FULL UPDATED FILE (keeps your existing methods, only adds secureReservation)

const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

export type ReservationDetails = {
  reservationId: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  reservationDate?: string;
  pickupDate?: string;
  deliveryDate?: string;
  vehicle?: string;
  price?: number;
  downPayment?: number;
  balanceOnDelivery?: number;
  quoteReference?: string;
  status?: string;
};

export type UserProfileReservation = {
  reservationId: string;
  quoteReference?: string;
  status?: string; // "SUCCESSFUL" | "PENDING" | "FAILED" | etc
  amount?: number;
  createdAt?: string;
};

export type UserProfileQuoteReservation = {
  reservationId: string;
  quoteReference?: string;
  status?: string;
  amount?: number;
};

export type SecureReservationRequest = {
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

// ✅ helpers MUST live OUTSIDE the object
const resolveToken = (token?: string | null) =>
  token || localStorage.getItem("synergyx_token");

const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const reservationsAPI = {
  // ✅ NEW: Secure Reservation (POST /secure)
  secureReservation: async (
    body: SecureReservationRequest,
    tokenArg?: string | null
  ): Promise<ReservationDetails> => {
    const token = resolveToken(tokenArg);
    if (!token) throw new Error("You must be logged in.");

    const res = await fetch(`${BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || "Failed to secure reservation");

    // backend shape: { success, message, data: {...} }
    return data?.data as ReservationDetails;
  },

  // ✅ USER PROFILE: list reservations (works even when /reservations/me is 500)
  getUserProfileReservations: async (
    tokenArg?: string | null
  ): Promise<UserProfileReservation[]> => {
    const token = resolveToken(tokenArg);
    if (!token) throw new Error("You must be logged in.");

    const res = await fetch(`${BASE_URL}/user-profile/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to fetch reservations");
    return Array.isArray(data.data) ? data.data : [];
  },

  // ✅ USER PROFILE: get by quote reference
  getUserProfileByQuoteReference: async (
    quoteReference: string,
    tokenArg?: string | null
  ): Promise<UserProfileQuoteReservation | null> => {
    const token = resolveToken(tokenArg);
    if (!token) throw new Error("You must be logged in.");

    const res = await fetch(`${BASE_URL}/user-profile/quote/${quoteReference}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await safeJson(res);

    // if not found, backend returns success:false sometimes
    if (!res.ok) {
      // If backend uses 404 or similar, return null (don’t crash UI)
      return null;
    }

    return data?.data ?? null;
  },

  // 🟡 5) Get Reservations by Date Range
  getByDateRange: async (
    startDate: string,
    endDate: string,
    tokenArg?: string | null
  ): Promise<ReservationDetails[]> => {
    const token = resolveToken(tokenArg);
    if (!token) throw new Error("You must be logged in.");

    const url = `${BASE_URL}/reservations/date-range?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to fetch reservations");
    return Array.isArray(data.data) ? data.data : [];
  },

  // 🔵 6) Get Location Suggestions
  getLocationSuggestions: async (
    keyword: string,
    tokenArg?: string | null
  ): Promise<string[]> => {
    const token = resolveToken(tokenArg);
    if (!token) throw new Error("You must be logged in.");

    const url = `${BASE_URL}/reservations/location/suggest?keyword=${encodeURIComponent(
      keyword
    )}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to fetch suggestions");
    return Array.isArray(data.data) ? data.data : [];
  },
};
