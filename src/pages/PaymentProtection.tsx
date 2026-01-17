import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type QuoteLike = {
  quoteReference: string;
  pickupLocation: string;
  deliveryLocation: string;
  vehicle?: { brand: string; model: string; year: number; id?: string };
  shipmentDate?: string;
  pickupDate?: string;
  pickupdate?: string;
  deliveryDate?: string;

  price?: number;
  downPayment?: number;
  balanceOnDelivery?: number;
};

type ReservationDraft = {
  quoteReference: string;

  pickupAddress: string;
  pickupLocation: string;
  pickupContactName: string;
  pickupContactPrimaryPhoneNumber: string;
  pickupContactSecondaryPhoneNumber?: string;
  pickUpResidenceType: "RESIDENTIAL" | "BUSINESS";

  deliveryAddress: string;
  deliveryLocation: string;
  deliveryContactName: string;
  deliveryContactPrimaryPhoneNumber: string;
  deliveryContactSecondaryPhoneNumber?: string;
  deliveryResidentialType: "RESIDENTIAL" | "BUSINESS";

  carrierType?: "open" | "enclosed";
  vehicle?: string;
  condition?: string;
  shipmentDate?: string;
};

type ProtectionState = {
  quoteReference?: string;
  quote?: QuoteLike;
  reservationDraft?: ReservationDraft;
};

const PRIMARY = "#E85C2B";

const PaymentProtection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Pull from navigation state FIRST, fallback to sessionStorage
  const state = useMemo<ProtectionState>(() => {
    return (location.state as ProtectionState) || {};
  }, [location.state]);

  const payload = useMemo(() => {
    const fromState = {
      quote: state.quote,
      reservationDraft: state.reservationDraft,
      quoteReference: state.quoteReference || state.quote?.quoteReference,
    };

    if (fromState.quoteReference && fromState.reservationDraft) return fromState;

    try {
      const saved = sessionStorage.getItem("pendingPaymentProtection");
      if (saved) return JSON.parse(saved) as typeof fromState;
    } catch {
      // ignore
    }

    return fromState;
  }, [state]);

  const quote = payload.quote;
  const reservationDraft = payload.reservationDraft;
  const quoteReference = payload.quoteReference;

  // ✅ compute ship date from whatever your quote provides
  const shipDate =
    reservationDraft?.shipmentDate ||
    quote?.shipmentDate ||
    quote?.pickupdate ||
    quote?.pickupDate ||
    quote?.deliveryDate ||
    "N/A";

  // ✅ vehicle detail from quote (or reservationDraft vehicle string)
  const vehicleText =
    quote?.vehicle
      ? `${quote.vehicle.brand} ${quote.vehicle.model} ${quote.vehicle.year}`
      : reservationDraft?.vehicle || "N/A";

  // ✅ Quote computed totals (use whatever your backend sends)
  const shippingRate = typeof quote?.price === "number" ? quote.price : undefined;

  // Coverage selection state
  const [coverageAmount, setCoverageAmount] = useState<
    "none" | "partial" | "full" | ""
  >("");

  // ✅ Coverage cost should be computed from quote (not hardcoded)
  // If you later get real coverage pricing from backend, replace this logic.
  const coverageCost = useMemo(() => {
    // If you want coverage cost derived from quote price:
    // - none = 0
    // - partial = 5% of quote price
    // - full = 10% of quote price
    // Feel free to adjust.
    const base = shippingRate ?? 0;
    if (coverageAmount === "partial") return Math.round(base * 0.05);
    if (coverageAmount === "full") return Math.round(base * 0.1);
    return 0;
  }, [coverageAmount, shippingRate]);

  // ✅ Total due now / quote computed (you can also show downPayment etc if needed)
  const totalToPayNow = useMemo(() => {
    // If your flow charges downPayment at this stage, use quote.downPayment.
    // Otherwise, use shippingRate + coverageCost.
    const base = shippingRate ?? 0;
    return base + coverageCost;
  }, [shippingRate, coverageCost]);

  useEffect(() => {
    // Must have reservationDraft and quoteReference at minimum
    if (!quoteReference || !reservationDraft) {
      toast({
        title: "Missing reservation data",
        description: "Please complete the reservation form again.",
        variant: "destructive",
      });
      navigate("/online-reservation");
      return;
    }

    // ✅ persist so refresh doesn't lose it
    sessionStorage.setItem(
      "pendingPaymentProtection",
      JSON.stringify({
        quoteReference,
        quote,
        reservationDraft,
      })
    );
  }, [quoteReference, reservationDraft, quote, navigate]);

  const handleEdit = () => {
    if (!reservationDraft) return;

    // ✅ Save draft so OnlineReservationForm can re-hydrate
    sessionStorage.setItem("reservationDraft", JSON.stringify(reservationDraft));

    // ✅ Go back to reservation page with same data intact
    navigate("/online-reservation", {
      state: {
        // keep quote if available so the top quote card still shows right
        quote,
        reservationDraft,
        from: "payment-protection",
      },
    });
  };

  const handleProceedToPayment = () => {
    if (!quoteReference || !reservationDraft) return;

    // TODO: Save coverage selection to backend if you have endpoint
    // await api.saveCoverageSelection({ quoteReference, coverageAmount, coverageCost });

    // ✅ Keep everything for the next step
    sessionStorage.setItem(
      "pendingReservationPayment",
      JSON.stringify({
        quoteReference,
        quote,
        reservationDraft,
        coverageAmount,
        coverageCost,
        totalToPayNow,
      })
    );

    navigate("/reservation-payment", {
      state: {
        quoteReference,
        quote,
        reservationDraft,
        coverageAmount,
        coverageCost,
        totalToPayNow,
      },
    });
  };

  if (!quoteReference || !reservationDraft) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                {/* Step 1 - Completed */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#E85C2B] text-white flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    Calculate shipping
                  </span>
                </div>
                <div className="w-16 md:w-24 h-1 bg-[#E85C2B] mx-2" />

                {/* Step 2 - Completed */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#E85C2B] text-white flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Pricing</span>
                </div>
                <div className="w-16 md:w-24 h-1 bg-[#E85C2B] mx-2" />

                {/* Step 3 - Active */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#E85C2B] text-white flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    Confirmation
                  </span>
                </div>
                <div className="w-16 md:w-24 h-1 bg-gray-300 mx-2" />

                {/* Step 4 - Pending */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Finish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-center mb-2">
              Protection Payment
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Select a coverage level & payment preference to complete your
              reservation
            </p>

            {/* Shipment Summary */}
            <div className="bg-[#E85C2B] text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <span className="font-medium">Shipment Summary</span>
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-1 text-white text-sm hover:underline"
              >
                Edit <Edit2 className="w-3 h-3" />
              </button>
            </div>

            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Shipper Details</p>
                  <p className="font-medium">{reservationDraft.pickupContactName}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Pickup Location</p>
                  <p className="font-medium text-sm">
                    {reservationDraft.pickupAddress}
                    <br />
                    {reservationDraft.pickupLocation}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Delivery Location</p>
                  <p className="font-medium text-sm">
                    {reservationDraft.deliveryAddress}
                    <br />
                    {reservationDraft.deliveryLocation}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Contact Details</p>
                  <p className="font-medium text-sm">
                    {reservationDraft.pickupContactPrimaryPhoneNumber}
                  </p>
                  {reservationDraft.pickupContactSecondaryPhoneNumber ? (
                    <p className="font-medium text-sm">
                      {reservationDraft.pickupContactSecondaryPhoneNumber}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Ship Date</p>
                    <p className="font-medium">{shipDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Vehicle Details</p>
                    <p className="font-medium">{vehicleText}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Shipping Rate</p>
                    <p className="font-medium">
                      {typeof shippingRate === "number"
                        ? `$${shippingRate}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Type */}
            <div className="bg-[#E85C2B] text-white px-4 py-3 rounded-t-lg">
              <span className="font-medium">Coverage Type</span>
            </div>

            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-700 text-sm">
                    Standard protection provides basic liability and covers
                    carriers negligence and equipment failure
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Additional coverage (full or partial) is available for a
                    higher level of protection during transit
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Vehicle</p>
                    <p className="font-medium">{vehicleText}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm mb-1">Coverage Amount</p>
                    <p className="font-large">
                      
                      {typeof shippingRate === "number"
                        ? `$${shippingRate}`
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm mb-1">Coverage Cost</p>
                    <p className="font-medium">
                      {typeof shippingRate === "number" ? `$${totalToPayNow}` : "N/A"}
                    </p>

                    
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              onClick={handleProceedToPayment}
              className="w-full bg-[#E85C2B] hover:bg-[#d14e20] text-white py-6"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentProtection;
