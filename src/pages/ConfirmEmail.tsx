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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.otpConfirmation(code); // Call new OTP confirmation API
      toast({
        title: "Success!",
        description: response.message, // Use message from API response
      });
      
      if (fromForgotPassword) {
        navigate("/password-changed", { state: { email: email } }); // Redirect to password changed page
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "OTP verification failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await authAPI.resendCode(); // Call resendCode without email parameter
      toast({
        title: "Success!",
        description: "An OTP has been sent to your email address.", // Use message from API docs
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
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
              />
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Didn't receive any mail?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
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
