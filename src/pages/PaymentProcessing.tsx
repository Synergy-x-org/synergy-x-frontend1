import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { paymentsAPI, PaymentStatus } from "@/services/paymentsAPI";
import { toast } from "@/hooks/use-toast";

const PaymentProcessing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sessionId = useMemo(() => {
    // 1) query param: ?sessionId=... OR ?session_id=...
    const qs = new URLSearchParams(window.location.search);
    const fromQuery = qs.get("sessionId") || qs.get("session_id");
    if (fromQuery) return fromQuery;

    // 2) navigation state
    const fromState = (location.state as any)?.sessionId as string | undefined;
    if (fromState) return fromState;

    // 3) sessionStorage
    try {
      const saved = sessionStorage.getItem("pendingReservationPayment");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.sessionId as string | undefined;
      }
    } catch {
      // ignore
    }

    return undefined;
  }, [location.state]);

  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [message, setMessage] = useState(
    "Please be patient — we are confirming your payment..."
  );

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: "Missing session",
        description: "Payment sessionId not found. Please try again.",
        variant: "destructive",
      });
      navigate("/payment-declined", { replace: true });
      return;
    }

    let alive = true;
    let tries = 0;
    const MAX_TRIES = 40;
    const INTERVAL_MS = 3000;

    const tick = async () => {
      tries += 1;

      try {
        const res = await paymentsAPI.getPaymentStatus(sessionId);
        if (!alive) return;

        // const token = resolveToken(tokenArg);
        // if (!token) throw new Error("You must be logged in.");


        setStatus(res.status);
        setMessage(res.message || "");

        if (res.status === "SUCCEEDED") {
          navigate("/payment-successful", { replace: true });
          return;
        }

        if (
          res.status === "FAILED" ||
          res.status === "CANCELED" ||
          res.status === "REJECTED" ||
          res.status === "EXPIRED"
        ) {
          navigate("/payment-declined", { replace: true });
          return;
        }

        if (tries >= MAX_TRIES) {
          setMessage(
            "Still confirming payment. If this takes too long, please refresh or contact support."
          );
        }
      } catch (err: any) {
        if (!alive) return;
        setMessage(err?.message || "Error checking payment status...");
      }
    };

    tick();
    const id = window.setInterval(() => {
      if (tries < MAX_TRIES) tick();
    }, INTERVAL_MS);

    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full mx-4 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Confirming Payment
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="text-sm text-gray-500">
            Current Status: <span className="font-medium">{status}</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentProcessing;
