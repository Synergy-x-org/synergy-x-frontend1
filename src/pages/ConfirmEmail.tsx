import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import logo from "@/assets/logo.png";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const fromForgotPassword = location.state?.fromForgotPassword || false;
  
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.verifyCode({ email, code });
      toast({
        title: "Success!",
        description: "Code verified successfully.",
      });
      
      if (fromForgotPassword) {
        navigate("/reset-password", { state: { email, code } });
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await authAPI.resendCode(email);
      toast({
        title: "Success!",
        description: "Verification code resent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Replace logo image here: /src/assets/logo.png */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Synergy-X Logo" className="h-12" />
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Check Your Email
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            We've sent you a confirmation code
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
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Haven't received any code?{" "}
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="text-primary hover:underline font-medium"
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
