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
    const response = await fetch(`${BASE_URL}/auth/users/forget_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (response.ok) {
      // ✅ Backend success message: "An OTP has been sent to your email address"
      return { message: responseData.message || "An OTP has been sent to your email address" };
    } else {
      // ✅ Handle known errors gracefully
      let errorMessage = responseData.message || responseData.error || "Failed to process password reset";

      if (response.status === 404) {
        errorMessage = "Email not found. Please check and try again.";
      } else if (response.status === 400) {
        errorMessage = "Invalid email format.";
      } else if (response.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      throw new Error(errorMessage);
    }
  },



  resetPassword: async (data: ResetPasswordData) => {
    const response = await fetch(`${BASE_URL}/auth/users/reset_password`, {
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

  resendCode: async (token: string) => {
    const headers: HeadersInit = {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const response = await fetch(`${BASE_URL}/auth/users/resend-token`, {
      method: "POST",
      headers: headers,
    });

    const responseText = await response.text(); // Read as text first to check specific messages

    const successMessage = "Found user email in session: An OTP has been sent to your email address";
    const noEmailMessage = "No email found in session. Please request a new password reset (session is out after 15 minutes)";

    if (responseText.includes(successMessage)) {
      return { message: successMessage };
    } else if (responseText.includes(noEmailMessage)) {
      throw new Error(noEmailMessage);
    } else if (response.status === 500) {
      // Explicitly handle 500 Internal Server Error
      throw new Error("Server error occurred. Please try again later.");
    } else if (response.ok) {
      // If response is OK but not the specific success message, try to parse as JSON
      try {
        const responseData = JSON.parse(responseText);
        return responseData;
      } catch (jsonError) {
        throw new Error(`Server responded with unexpected non-JSON success: ${responseText}`);
      }
    } else {
      // Handle other errors (e.g., 4xx), try to parse as JSON if possible
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || errorData.error || "Failed to resend OTP");
      } catch (jsonError) {
        throw new Error(responseText || "Failed to resend OTP");
      }
    }
  }
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
