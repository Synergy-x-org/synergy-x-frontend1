import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { getReservationRedirect, clearReservationRedirect } from "@/utils/reservationRedirect";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ✅ Read redirect info (only for this special flow)
  const flow = (location.state as any)?.flow as string | undefined;
  const redirectTo = (location.state as any)?.redirectTo as string | undefined;

  const pendingQuote = useMemo(() => {
    const fromState = (location.state as any)?.quote;
    if (fromState) return fromState;

    try {
      const s = sessionStorage.getItem("pendingReservationQuote");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }, [location.state]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res: any = await authAPI.login(formData);

//       // Backend shape you described:
//       // res.data.token
//       // res.data.email
//       // res.data.userDetails.firstName/lastName/phoneNumber
//       const token = res?.data?.token;
//       const email = res?.data?.email;
//       const details = res?.data?.userDetails;

//       if (!token || !email || !details?.firstName) {
//         throw new Error("Login response missing token or user details.");
//       }

//       const user = {
//         firstName: details.firstName,
//         lastName: details.lastName || "",
//         phoneNumber: details.phoneNumber,
//         email,
//       };

//       login({ user, token });
//       const redirect = getReservationRedirect();

// if (redirect?.flow === "quote_to_reservation" && redirect.redirectTo) {
//   // ✅ Clear so it doesn't keep redirecting forever
//   clearReservationRedirect();

//   // ✅ send user to reservation form
//   navigate(redirect.redirectTo, {
//     state: {
//       quote: (() => {
//         try {
//           const s = sessionStorage.getItem("pendingReservationQuote");
//           return s ? JSON.parse(s) : null;
//         } catch {
//           return null;
//         }
//       })(),
//     },
//   });
//   return;
// }

// // ✅ normal auth behavior remains unchanged
// navigate("/");

//       toast({
//         title: "Success!",
//         description: res?.message || "Login successful",
//       });
//       // Login.tsx


// // inside success area after login({ user, token }) and toast:



//       // ✅ SPECIAL FLOW REDIRECT (ONLY when user came from quote->reservation flow)
//       if (flow === "quote_to_reservation" && redirectTo) {
//         navigate(redirectTo, { state: { quote: pendingQuote } });
//       } else {
//         // ✅ Your existing behavior stays the same
//         navigate("/");
//       }
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Login failed",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  // Login.tsx (only the handleSubmit success area needs this change)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res: any = await authAPI.login(formData);

    // ✅ Support your backend doc shape:
    // { success, message, data: { token, email, role, ... } }
    // Also keeps compatibility if backend returns userDetails in other shape.
    const root = res; // authAPI.login returns parsed JSON already

    const token =
      root?.data?.token ?? root?.data?.data?.token ?? root?.token;

    const email =
      root?.data?.email ?? root?.data?.data?.email ?? root?.email;

    const role =
      root?.data?.role ?? root?.data?.data?.role ?? root?.role;

    const details =
      root?.data?.userDetails ?? root?.data?.data?.userDetails ?? root?.userDetails;

    if (!token || !email) {
      throw new Error("Login response missing token or email.");
    }

    const user = {
      firstName: details?.firstName || "",
      lastName: details?.lastName || "",
      phoneNumber: details?.phoneNumber || "",
      email,
      role, // ✅ keep role on user (optional but useful)
    };

    login({ user, token });

    // ✅ KEEP your existing special redirect logic FIRST (quote -> reservation)
    const redirect = getReservationRedirect();

    if (redirect?.flow === "quote_to_reservation" && redirect.redirectTo) {
      clearReservationRedirect();

      navigate(redirect.redirectTo, {
        state: {
          quote: (() => {
            try {
              const s = sessionStorage.getItem("pendingReservationQuote");
              return s ? JSON.parse(s) : null;
            } catch {
              return null;
            }
          })(),
        },
      });
      return;
    }

    toast({
      title: "Success!",
      description: root?.message || "Login successful",
    });

    // ✅ If user came from quote_to_reservation via location.state (keep your existing behavior)
    if (flow === "quote_to_reservation" && redirectTo) {
      navigate(redirectTo, { state: { quote: pendingQuote } });
      return;
    }

    // ✅ NEW: role-based routing (only when not in special flow)
    const normalizedRole = String(role || "").toUpperCase();

    if (normalizedRole === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      // USER (or anything else defaults to user dashboard)
      navigate("/");
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Login failed",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Synergy-X Logo" className="h-12" />
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              // ✅ OPTIONAL: pass flow info to signup too (so signup can also redirect)
              state={
                flow === "quote_to_reservation" && redirectTo
                  ? { flow, redirectTo, quote: pendingQuote }
                  : undefined
              }
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
