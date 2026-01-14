import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import logo from "@/assets/logo.png";

const COOLDOWN_SECONDS = 60;

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const fromForgotPassword = location.state?.fromForgotPassword || false;

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // ✅ cooldown state
  const [cooldown, setCooldown] = useState(0);

  // countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await authAPI.otpConfirmation(code);

      const successMessage = response.message?.toLowerCase() || "";
      const isRegistrationSuccess =
        successMessage.includes("registration successful") ||
        successMessage.includes("proceed to login");
      const isForgotPasswordSuccess =
        successMessage.includes("verified") ||
        successMessage.includes("otp confirmed") ||
        successMessage.includes("password reset") ||
        successMessage.includes("success");

      const isSuccess = fromForgotPassword ? isForgotPasswordSuccess : isRegistrationSuccess;

      if (isSuccess) {
        setMessage({ text: response.message, type: "success" });
        toast({
          title: "Success!",
          description: response.message,
        });

        setTimeout(() => {
          if (fromForgotPassword) {
            navigate("/reset-password", { state: { token: code } });
          } else {
            navigate("/login");
          }
        }, 1500);
      } else {
        setMessage({ text: response.message || "OTP verification failed.", type: "error" });
        toast({
          title: "Failed",
          description: response.message || "Invalid or expired OTP.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Server error occurred. Please try again later.";
      setMessage({ text: errorMessage, type: "error" });
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;

    setResending(true);
    setMessage(null);

    try {
      const resetRequestId = localStorage.getItem("resetRequestId") || undefined;
      const response = await authAPI.resendCode(resetRequestId);

      setMessage({ text: response.message, type: "success" });
      toast({
        title: "Success!",
        description: response.message,
      });

      // ✅ start cooldown after success
      setCooldown(COOLDOWN_SECONDS);
    } catch (error: any) {
      let errorMessage = error.message || "Failed to resend OTP. Please try again.";
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
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" fill="#FF7A00" fillOpacity="0.1"/>
              <path d="M20 6L12 11L4 6" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Almost There!</h1>
          <p className="text-muted-foreground mb-8">Check your email box for OTP</p>

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
              <div className={`text-sm mt-2 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {message.text}
              </div>
            )}

            {message?.type === "error" && (
              <p className="text-sm text-red-600 text-center mt-2">
                Didn’t get the right OTP? Try resending or check your email again.
              </p>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Didn't receive any otp?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending || loading || cooldown > 0}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {resending
                  ? "Resending..."
                  : cooldown > 0
                  ? `Try again in ${cooldown}s`
                  : "Resend confirmation"}
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
