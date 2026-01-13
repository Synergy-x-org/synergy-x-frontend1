// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "@/hooks/use-toast";
// import { authAPI } from "@/services/api";
// import logo from "@/assets/logo.png";

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await authAPI.login(formData);
//       toast({
//         title: "Success!",
//         description: response.message, // Use message from API response
//       });
//       // Store token and role
//       localStorage.setItem("token", response.token);
//       localStorage.setItem("userRole", response.role);
//       localStorage.setItem("user", JSON.stringify(response.user));
//       // localStorage.setItem("userEmail", response.email); // Store email
//       localStorage.setItem("tokenExpiration", response.expirationTime); // Store expiration time
//       navigate("/"); // Redirect to home page
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

//   return (
//     <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           {/* Replace logo image here: /src/assets/logo.png */}
//           <div className="flex justify-center mb-8">
//             <img src={logo} alt="Synergy-X Logo" className="h-12" />
//           </div>

//           <h1 className="text-2xl font-bold text-center text-foreground mb-2">
//             Welcome Back
//           </h1>
//           <p className="text-center text-muted-foreground mb-8">
//             Sign in to your account
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             <div className="flex justify-end">
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-primary hover:underline"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground mt-6">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-primary hover:underline font-medium">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      // Your backend response structure:
      // {
      //   success: true,
      //   message: "Login successful",
      //   data: { token, email, role, expirationTime, userDetails: { firstName, lastName, phoneNumber } }
      // }
      const payload = response.data;
      const token = payload.token;

      const user = {
        id: payload.email, // using email as an id
        firstName: payload.userDetails?.firstName || "",
        lastName: payload.userDetails?.lastName || "",
        email: payload.email,
        phone: payload.userDetails?.phoneNumber || "",
      };

      // ✅ This is what makes profile + header work
      login(user, token);

      toast({
        title: "Success!",
        description: response.message || "Login successful",
      });

      navigate("/");
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
