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
import SignupSuccess from "./pages/SignupSuccess";
import PasswordChanged from "./pages/PasswordChanged";
import Profile from "./pages/Profile";
import ShippingQuote from "./pages/ShippingQuote";
import DoorToDoorShipping from "./pages/DoorToDoorShipping";
import MotorcycleShipping from "./pages/MotorcycleShipping";
import CarToAnotherState from "./pages/CarToAnotherState";
import CrossCountryCarShipping from "./pages/CrossCountryCarShipping";
import Contact from "./pages/Contact";
import QuoteResult from "./pages/QuoteResult";
import MovingCostCalculator from "./pages/MovingCostCalculator";
import QuoteStep1 from "./pages/QuoteStep1";
import NotFound from "./pages/NotFound";
import QuoteResultStepTwo from "./pages/QuoteResultStepTwo";
import OnlineReservationForm from "./pages/OnlineReservationForm";
import PaymentProtection from "./pages/PaymentProtection";
import ProfileReservation from "./pages/ProfileReservations";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccessful from "./pages/PaymentSuccessful";
import PaymentDeclined from "./pages/PaymentDeclined";


import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup-success" element={<SignupSuccess />} />
            <Route path="/password-changed" element={<PasswordChanged />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/shipping-quote" element={<ShippingQuote />} />
            <Route path="/door-to-door" element={<DoorToDoorShipping />} />
            <Route path="/motorcycle-shipping" element={<MotorcycleShipping />} />
            <Route path="/car-to-another-state" element={<CarToAnotherState />} />
            <Route
              path="/cross-country-car-shipping"
              element={<CrossCountryCarShipping />}
            />
            <Route path="/quote-result" element={<QuoteResult />} />
            <Route path="/quote-step-1" element={<QuoteStep1 />} />
            <Route path="/quote-result-step-two" element={<QuoteResultStepTwo />} />
            <Route path="/online-reservation" element={<OnlineReservationForm />} />
            <Route path="/payment-protection" element={<PaymentProtection />} />
            <Route path="/profile/reservations" element={<ProfileReservation />} />

            <Route path="/payment-successful" element={<PaymentSuccessful />} />
            <Route path="/payment-declined" element={<PaymentDeclined />} />




            <Route path="/contact" element={<Contact />} />
            <Route path="/moving-cost-calculator" element={<MovingCostCalculator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
