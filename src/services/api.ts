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

export type ResetPasswordData = {
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
      // If backend returned plain text, wrap it
      throw new Error("Invalid server response");
    }

    if (!response.ok) {
      throw new Error(data.message || "Forgot password failed");
    }

    // If backend returns a resetRequestId (request id) store it for later (resend)
    // Backend may return it in data.resetRequestId or data.data.resetRequestId depending on shape
    const resetRequestId =
      data.resetRequestId || (data.data && data.data.resetRequestId) || null;

    if (resetRequestId) {
      try {
        localStorage.setItem("resetRequestId", resetRequestId);
      } catch (e) {
        console.warn("Unable to persist resetRequestId to localStorage", e);
      }
    }

    return data;
  },

  resendCode: async (resetRequestId?: string) => {
    // Prefer provided id; otherwise read from storage
    const requestId = resetRequestId || localStorage.getItem("resetRequestId");

    if (!requestId) {
      throw new Error("No reset request found. Please request a new password reset.");
    }

    const response = await fetch(`${BASE_URL}/auth/resend-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ resetRequestId: requestId }),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (response.ok) {
      return responseData;
    } else {
      let errorMessage = responseData.message || "Failed to resend OTP";

      if (response.status === 400) {
        errorMessage = responseData.message || "Invalid reset request";
      } else if (response.status === 410) {
        errorMessage = responseData.message || "OTP expired. Please request a new password reset.";
      } else if (response.status === 429) {
        errorMessage = responseData.message || "Too many requests. Please try again later.";
      } else if (response.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      throw new Error(errorMessage);
    }
  },

  otpConfirmation: async (otp: string) => {
    // Use GET per API docs: GET /auth/otp/confirmation?otp=...
    const response = await fetch(`${BASE_URL}/auth/otp/confirmation?otp=${encodeURIComponent(otp)}`, {
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
      return { message: responseData.message || "OTP verified successfully" };
    } else {
      // Map statuses to clearer messages
      let errorMessage = responseData.message || "OTP verification failed";

      if (response.status === 400) {
        errorMessage = responseData.message || "Invalid OTP. Please request a new OTP.";
      } else if (response.status === 410) {
        // OTP expired: optionally a new OTP may have been sent
        errorMessage = responseData.message || "Your OTP has expired. Please request a new OTP.";
      } else if (response.status === 503) {
        errorMessage = responseData.message || "Email service temporarily unavailable. Try resending later.";
      } else if (response.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      throw new Error(errorMessage);
    }
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (response.ok) {
      // On successful reset we expect something like { success: true, message: "Password reset successful" }
      // Clear any stored resetRequestId here is optional for safety; caller already removes it on success
      return responseData;
    } else {
      // Map server errors
      let errorMessage = responseData.message || responseData.error || "Password reset failed";

      if (response.status === 400) {
        // Backend may return different reasons: invalid/expired token or mismatch
        if (responseData.message?.toLowerCase().includes("invalid") || responseData.message?.toLowerCase().includes("expired")) {
          errorMessage = responseData.message || "Invalid or expired token";
        } else if (responseData.message?.toLowerCase().includes("mismatch")) {
          errorMessage = responseData.message || "Passwords do not match";
        }
      } else if (response.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      throw new Error(errorMessage);
    }
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