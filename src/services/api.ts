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
  role: "USER"; // Added role
}

export interface ForgotPasswordData {
  email: string;
}

export interface OtpConfirmationData {
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // { statusCode, message, token, role, email, expirationTime }
    } else {
      // Handle errors like "Invalid email or password"
      throw new Error(responseData.message || responseData.error || "Login failed");
    }
  },

  otpConfirmation: async (otp: string) => {
    const response = await fetch(`${BASE_URL}/auth/otp/confirmation?otp=${otp}`, {
      method: "GET",
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // { message: "Registration Successful, proceed to login" }
    } else {
      // Handle errors like "Invalid OTP", "OTP Expired"
      throw new Error(responseData.message || responseData.error || "OTP verification failed");
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

    const responseData = await response.json();

    // Explicitly check for the success message, as the backend might return a non-2xx status
    // even for a logically successful registration that requires OTP verification.
    if (responseData.message === "User registered successfully. Please check your email for OTP verification.") {
      return responseData; // Treat as success for redirection
    } else if (response.ok) {
      return responseData; // Other successful responses
    } else {
      // Handle actual errors like "User Already Exists"
      throw new Error(responseData.message || "Registration failed");
    }
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await fetch(`${BASE_URL}/auth/users/forget_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // { message: "An OTP has been sent to your email address" }
    } else {
      throw new Error(responseData.message || responseData.error || "Forgot password failed");
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

  resendCode: async () => { // No email parameter needed as per API docs
    const response = await fetch(`${BASE_URL}/auth/users/resend-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // API expects JSON header even with no body
      },
      // No body needed as per API docs
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // { message: "An OTP has been sent to your email address" }
    } else {
      throw new Error(responseData.message || responseData.error || "Resend OTP failed");
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
