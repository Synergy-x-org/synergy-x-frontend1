import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import ResetPassword from "./pages/ResetPassword";
import SignupSuccess from "./pages/SignupSuccess"; // Import SignupSuccess
import PasswordChanged from "./pages/PasswordChanged"; // Import PasswordChanged
import Profile from "./pages/Profile"; // Import Profile
import ShippingQuote from "./pages/ShippingQuote";
import DoorToDoorShipping from "./pages/DoorToDoorShipping";
import MotorcycleShipping from "./pages/MotorcycleShipping";
import CarToAnotherState from "./pages/CarToAnotherState";
import CrossCountryCarShipping from "./pages/CrossCountryCarShipping";
import Contact from "./pages/Contact";
import QuoteResult from "./pages/QuoteResult";
import MovingCostCalculator from "./pages/MovingCostCalculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup-success" element={<SignupSuccess />} /> {/* Add new route */}
          <Route path="/password-changed" element={<PasswordChanged />} /> {/* Add new route */}
          <Route path="/profile" element={<Profile />} /> {/* Add new route */}
          <Route path="/shipping-quote" element={<ShippingQuote />} />
          <Route path="/door-to-door" element={<DoorToDoorShipping />} />
          <Route path="/motorcycle-shipping" element={<MotorcycleShipping />} />
          <Route path="/car-to-another-state" element={<CarToAnotherState />} />
age          <Route path="/cross-country-car-shipping" element={<CrossCountryCarShipping />} />
          <Route path="/quote-result" element={<QuoteResult />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/moving-cost-calculator" element={<MovingCostCalculator />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
