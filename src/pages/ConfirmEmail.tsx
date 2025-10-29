import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Import Link
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import logo from "@/assets/logo.png"; // Assuming logo is still used

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const fromForgotPassword = location.state?.fromForgotPassword || false;
  
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Clear previous messages

    try {
      const response = await authAPI.otpConfirmation(code);
      setMessage({ text: "Registration successful! Proceed to login.", type: "success" });
      toast({
        title: "Success!",
        description: "Registration successful! Proceed to login.",
      });

      setTimeout(() => {
        if (fromForgotPassword) {
          navigate("/password-changed", { state: { email: email } }); // Redirect to password changed page
        } else {
          navigate("/login");
        }
      }, 2000); // Redirect after 2 seconds
      
    } catch (error: any) {
      let errorMessage = "Server error occurred. Please try again later."; // Default 500 error
      if (error.message.includes("400")) {
        errorMessage = "Invalid OTP. Please request a new one.";
      } else if (error.message.includes("410")) {
        errorMessage = "Your OTP has expired. A new one has been sent to your email.";
      }
      setMessage({ text: errorMessage, type: "error" });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setMessage(null); // Clear previous messages
    try {
      const response = await authAPI.resendCode();
      setMessage({ text: response.message, type: "success" });
      toast({
        title: "Success!",
        description: response.message,
      });
    } catch (error: any) {
      let errorMessage = "Failed to resend OTP. Please try again.";
      if (error.message.includes("No email found in session")) {
        errorMessage = "No email found in session. Please request a new password reset.";
      }
      setMessage({ text: errorMessage, type: "error" });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-8">
            {/* Icon from Figma: Orange envelope */}
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" fill="#FF7A00" fillOpacity="0.1"/>
              <path d="M20 6L12 11L4 6" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Almost There!
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Check your email box to confirm
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Confirmation Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                disabled={loading}
              />
            </div>

            {message && (
              <div
                className={`text-sm mt-2 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Didn't receive any mail?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending || loading}
                className="text-primary hover:underline font-medium"
              >
                {resending ? "Resending..." : "Resend confirmation"}
              </button>
            </p>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Done"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
