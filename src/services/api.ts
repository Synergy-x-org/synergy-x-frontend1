// Replace with your real Java backend endpoint
const BASE_URL = "https://api.synergyx-demo.com";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// Mock API calls - Replace these with real backend integration
export const authAPI = {
  login: async (data: LoginData) => {
    // POST ${BASE_URL}/auth/login
    console.log("Login attempt:", data);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email && data.password) {
          resolve({ success: true, token: "mock-jwt-token", user: { email: data.email } });
        } else {
          reject({ success: false, message: "Invalid credentials" });
        }
      }, 1000);
    });
  },

  register: async (data: SignupData) => {
    // POST ${BASE_URL}/auth/register
    console.log("Registration attempt:", data);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email && data.password) {
          resolve({ success: true, message: "Account created successfully" });
        } else {
          reject({ success: false, message: "Registration failed" });
        }
      }, 1000);
    });
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    // POST ${BASE_URL}/auth/forgot-password
    console.log("Forgot password attempt:", data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Verification code sent to your email" });
      }, 1000);
    });
  },

  verifyCode: async (data: VerifyCodeData) => {
    // POST ${BASE_URL}/auth/verify-code
    console.log("Verify code attempt:", data);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.code === "123456") {
          resolve({ success: true, message: "Code verified successfully" });
        } else {
          reject({ success: false, message: "Invalid verification code" });
        }
      }, 1000);
    });
  },

  resetPassword: async (data: ResetPasswordData) => {
    // POST ${BASE_URL}/auth/reset-password
    console.log("Reset password attempt:", data);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.newPassword === data.confirmPassword) {
          resolve({ success: true, message: "Password reset successfully" });
        } else {
          reject({ success: false, message: "Passwords do not match" });
        }
      }, 1000);
    });
  },

  resendCode: async (email: string) => {
    // POST ${BASE_URL}/auth/resend-code
    console.log("Resend code attempt:", email);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Verification code resent" });
      }, 1000);
    });
  }
};
