// Replace with your real Java backend endpoint
const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // Changed from 'phone' to 'phoneNumber'
  password: string;
  role: "USER" | "ADMIN"; // Allow selecting role
}

export interface ForgotPasswordData {
  email: string;
}

export interface OtpConfirmationData {
  // email: string;
  otp: string;
}

export interface ResetPasswordData {
  token: string; // Changed from email and code to token
  newPassword: string;
  confirmPassword: string;
}

export interface QuoteVisitorData {
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  brand: string;
  model: string;
  year: number; // Changed from string to number
  email: string;
  phoneNumber: string;
}

export interface QuoteVisitorResponse {
  pickupLocation: string;
  deliveryLocation: string;
  price: number;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
  };
  quoteReference: string;
  downPayment: number;
  balanceOnDelivery: number;
  deliveryDate: string;
  pickupdate: string;
}

export interface GetInTouchData {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Always read the raw text first
    const responseText = await response.text();

    // Try to parse JSON if possible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = null; // not JSON, fallback to text
    }

    if (response.ok) {
      // Prefer message from backend, or raw text if no message
      return responseData || { message: responseText || "Login successful" };
    } else {
      // Extract message from JSON or fallback to raw text
      const errorMessage =
        (responseData && (responseData.message || responseData.error)) ||
        responseText ||
        "Login failed";

      throw new Error(errorMessage.trim());
    }
  },


  otpConfirmation: async (otp: string) => {
    const response = await fetch(`${BASE_URL}/auth/otp/confirmation?otp=${otp}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (response.ok) {
      // ✅ Success: show backend message (e.g., "Registration Successful, proceed to login")
      return { message: responseData.message || "OTP verified successfully" };
    } else {
      // ✅ Handle backend-defined error messages precisely
      let errorMessage = responseData.message || responseData.error || "OTP verification failed";

      if (response.status === 400) {
        errorMessage = responseData.message || "Validation failed. Please request a new OTP.";
      } else if (response.status === 410) {
        errorMessage = responseData.message || "Your OTP has expired. A new OTP has been sent to your email.";
      } else if (response.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      throw new Error(errorMessage);
    }
  },


  register: async (data: SignupData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Always read as plain text first (backend may send text or JSON)
    const responseText = await response.text();
    const trimmedText = responseText.trim();

    let responseData: any = null;
    try {
      responseData = JSON.parse(trimmedText);
    } catch {
      responseData = null; // Not JSON, fallback to plain text
    }

    // Normalize backend messages
    const backendMessage =
      (responseData && (responseData.message || responseData.error)) ||
      trimmedText ||
      "Unknown server response";

    // Handle success
    if (response.ok) {
      return { message: backendMessage };
    }

    // Handle non-OK responses (4xx, 5xx)
    throw new Error(backendMessage);  
  },


  forgetPassword: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const responseText = await response.text();

    console.error("Forgot Password RAW:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Forgot password failed");
      }

      return data;
  },



  resetPassword: async (data: ResetPasswordData) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // { message: "Password reset successfully" }
    } else {
      throw new Error(responseData.message || responseData.error || "Password reset failed");
    }
  },

resendCode: async (resetRequestId: string) => {
  const response = await fetch(`${BASE_URL}/auth/resend-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resetRequestId, // ✅ MUST match backend
    }),
  });

  const responseText = await response.text();

  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to resend OTP");
  }

  return responseData;
},
};

export const carBrandsAPI = {
  getAllCarBrands: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/car-brands/carBrand`, {
      method: "GET",
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // ["Toyota", "Honda", "Ford", "Nissan"]
    } else {
      throw new Error(responseData.message || responseData.error || "Failed to fetch car brands");
    }
  },

  getModelsByBrand: async (brand: string): Promise<Record<string, number[]>> => {
    const response = await fetch(`${BASE_URL}/car-brands/${brand}/models`, {
      method: "GET",
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // { "Camry": [2025, 2024, ...], ... }
    } else {
      throw new Error(responseData.message || responseData.error || `Failed to fetch models for brand ${brand}`);
    }
  },
};

export const quotesAPI = {
  calculateVisitorQuote: async (data: QuoteVisitorData): Promise<QuoteVisitorResponse> => {
    const response = await fetch(`${BASE_URL}/quotes/visitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // QuoteVisitorResponse
    } else {
      throw new Error(responseData.message || responseData.error || "Failed to calculate quote");
    }
  },
};

export const contactAPI = {
  getInTouch: async (data: GetInTouchData) => {
    const response = await fetch(`${BASE_URL}/contact/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData;
    } else {
      throw new Error(
        responseData.message || responseData.error || "Failed to send message"
      );
    }
  },
};