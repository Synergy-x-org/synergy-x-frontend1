import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PRIMARY = "#E85C2B";

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

type ReservationPaymentState = {
  quoteReference?: string;
  quote?: QuoteLike;
  reservationDraft?: ReservationDraft;

  // coming from PaymentProtection
  coverageAmount?: "none" | "partial" | "full" | "";
  coverageCost?: number;
  totalToPayNow?: number;
};

const money = (n?: number) =>
  typeof n === "number" && !Number.isNaN(n) ? `$${Math.round(n)}` : "N/A";

const ReservationPayment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- Load payload from location.state OR sessionStorage fallback (same key PaymentProtection uses)
  const payload = useMemo<ReservationPaymentState>(() => {
    const fromState = (location.state as ReservationPaymentState) || {};

    if (fromState?.quoteReference && fromState?.reservationDraft) return fromState;

    try {
      const saved = sessionStorage.getItem("pendingReservationPayment");
      if (saved) return JSON.parse(saved) as ReservationPaymentState;
    } catch {
      // ignore
    }

    return fromState;
  }, [location.state]);

  const quote = payload.quote;
  const reservationDraft = payload.reservationDraft;
  const quoteReference = payload.quoteReference || quote?.quoteReference;

  // --- derive summary values (must match PaymentProtection)
  const shippingRate = useMemo(() => {
    // in your PaymentProtection page, base = quote.price
    // OnlineReservationForm already overwrites quote.price with secureReservation.price
    return typeof quote?.price === "number" ? quote.price : undefined;
  }, [quote?.price]);

  const coverageCost = useMemo(() => {
    if (typeof payload.coverageCost === "number") return payload.coverageCost;
    // fallback if not provided
    const base = shippingRate ?? 0;
    if (payload.coverageAmount === "partial") return Math.round(base * 0.05);
    if (payload.coverageAmount === "full") return Math.round(base * 0.1);
    return 0;
  }, [payload.coverageCost, payload.coverageAmount, shippingRate]);

  const totalToPayNow = useMemo(() => {
    if (typeof payload.totalToPayNow === "number") return payload.totalToPayNow;
    const base = shippingRate ?? 0;
    return base + coverageCost;
  }, [payload.totalToPayNow, shippingRate, coverageCost]);

  // --- basic guard
  useEffect(() => {
    if (!quoteReference || !reservationDraft) {
      toast({
        title: "Missing payment data",
        description: "Please complete the protection step again.",
        variant: "destructive",
      });
      navigate("/payment-protection");
      return;
    }

    // keep it persisted for refresh
    sessionStorage.setItem(
      "pendingReservationPayment",
      JSON.stringify({
        quoteReference,
        quote,
        reservationDraft,
        coverageAmount: payload.coverageAmount,
        coverageCost,
        totalToPayNow,
      })
    );
  }, [quoteReference, reservationDraft, quote, payload.coverageAmount, coverageCost, totalToPayNow, navigate]);

  // --- form state
  const [selectedMethod, setSelectedMethod] = useState<"card" | "paypal">("card");
  const [cardData, setCardData] = useState({
    holderName: user?.firstName || "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    zipCode: "",
  });

  const shipDate =
    reservationDraft?.shipmentDate ||
    quote?.shipmentDate ||
    quote?.pickupdate ||
    quote?.pickupDate ||
    quote?.deliveryDate ||
    "N/A";

  const vehicleText =
    quote?.vehicle
      ? `${quote.vehicle.brand} ${quote.vehicle.model} ${quote.vehicle.year}`
      : reservationDraft?.vehicle || "N/A";

  const handleEdit = () => {
    if (!quoteReference || !reservationDraft) return;

    sessionStorage.setItem("reservationDraft", JSON.stringify(reservationDraft));

    navigate("/online-reservation", {
      state: {
        quote,
        reservationDraft,
        from: "reservation-payment",
        mode: "edit",
      },
    });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quoteReference || !reservationDraft) return;

    if (selectedMethod === "card") {
      if (
        !cardData.holderName ||
        !cardData.cardNumber ||
        !cardData.expiryDate ||
        !cardData.cvc ||
        !cardData.zipCode
      ) {
        toast({
          title: "Missing fields",
          description: "Please complete your card details.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // TODO: call your backend payment endpoint here (do not change UI).
      // Use quoteReference + totalToPayNow + selectedMethod + cardData (if card).
      // await paymentsAPI.payReservation(...)

      toast({
        title: "Payment successful",
        description: `Paid ${money(totalToPayNow)} successfully.`,
      });

      // OPTIONAL: clear checkout temp payload
      // sessionStorage.removeItem("pendingReservationPayment");

      // Navigate to your final success screen (based on your Figma "Account successful")
      navigate("/account-successful", { state: { quoteReference } });
    } catch (err: any) {
      toast({
        title: "Payment failed",
        description: err?.message || "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!quoteReference || !reservationDraft) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Stepper (matches your other pages) */}
          <div className="mb-8 pt-24">
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-5xl justify-between">
                {[
                  { n: 1, label: "Calculate shipping", isOn: true },
                  { n: 2, label: "Pricing", isOn: true },
                  { n: 3, label: "Confirmation", isOn: true },
                  { n: 4, label: "Finish", isOn: false },
                ].map((s, idx) => (
                  <React.Fragment key={s.n}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          s.isOn ? "text-white" : "bg-gray-300 text-gray-600"
                        }`}
                        style={{ backgroundColor: s.isOn ? PRIMARY : undefined }}
                      >
                        {s.n}
                      </div>
                      <span className="text-xs mt-2 text-gray-600 text-center">
                        {s.label}
                      </span>
                    </div>

                    {idx !== 3 && (
                      <div
                        className="h-[2px] flex-1 mx-2"
                        style={{
                          backgroundColor: idx < 3 ? PRIMARY : "#D1D5DB",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Page shell like Figma: centered title, two columns */}
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="text-2xl font-semibold text-center mb-2">
              Payment Details
            </h1>
            <p className="text-gray-500 text-center mb-8">
              We will set up payment that works for you.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* LEFT: Payment details card (2/3 width) */}
              <Card className="lg:col-span-2 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Payment method</CardTitle>
                </CardHeader>

                <CardContent>
                  {/* method selector like Figma (2 options row) */}
                  <div className="flex gap-4 mb-6">
                    {/* Card */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("card")}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${
                        selectedMethod === "card"
                          ? "border-[#E85C2B] bg-[#E85C2B]/5"
                          : "border-gray-200 hover:border-[#E85C2B]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border-2 border-[#E85C2B] flex items-center justify-center">
                            {selectedMethod === "card" ? (
                              <div className="w-2 h-2 rounded-full bg-[#E85C2B]" />
                            ) : null}
                          </div>
                          <span className="text-sm font-medium">•••• 8304</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">VISA</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Visa</span>
                        <span className="text-[#E85C2B] hover:underline">Edit</span>
                      </div>
                    </button>

                    {/* PayPal */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("paypal")}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${
                        selectedMethod === "paypal"
                          ? "border-[#E85C2B] bg-[#E85C2B]/5"
                          : "border-gray-200 hover:border-[#E85C2B]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border-2 border-[#E85C2B] flex items-center justify-center">
                            {selectedMethod === "paypal" ? (
                              <div className="w-2 h-2 rounded-full bg-[#E85C2B]" />
                            ) : null}
                          </div>
                          <span className="text-sm font-medium">PayPal</span>
                        </div>
                        <span className="text-base font-bold text-blue-700">PayPal</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Paypal</span>
                        <span className="text-[#E85C2B] hover:underline">Edit</span>
                      </div>
                    </button>
                  </div>

                  {/* Card form (Figma left) */}
                  <form onSubmit={handlePay} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="holderName">Card holder name</Label>
                      <Input
                        id="holderName"
                        placeholder="Ex. Cameron Williamson"
                        value={cardData.holderName}
                        onChange={(e) =>
                          setCardData({ ...cardData, holderName: e.target.value })
                        }
                        disabled={selectedMethod !== "card"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="••• ••• ••• •••"
                        value={cardData.cardNumber}
                        onChange={(e) =>
                          setCardData({ ...cardData, cardNumber: e.target.value })
                        }
                        disabled={selectedMethod !== "card"}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="11/09/25"
                          value={cardData.expiryDate}
                          onChange={(e) =>
                            setCardData({ ...cardData, expiryDate: e.target.value })
                          }
                          disabled={selectedMethod !== "card"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="323"
                          value={cardData.cvc}
                          onChange={(e) =>
                            setCardData({ ...cardData, cvc: e.target.value })
                          }
                          maxLength={4}
                          disabled={selectedMethod !== "card"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip code</Label>
                      <Input
                        id="zipCode"
                        placeholder="Ex. 78958"
                        value={cardData.zipCode}
                        onChange={(e) =>
                          setCardData({ ...cardData, zipCode: e.target.value })
                        }
                        disabled={selectedMethod !== "card"}
                      />
                    </div>

                    {/* Pay button (must carry same price) */}
                    <Button
                      type="submit"
                      className="w-full text-white py-6 rounded-lg"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      Pay {money(totalToPayNow)}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* RIGHT: Quote summary card (orange header like Figma) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div
                    className="px-4 py-3 text-white font-medium flex items-center justify-between"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    <span>Quote #{quoteReference}</span>
                    {/* <button
                      type="button"
                      onClick={handleEdit}
                      className="text-white text-sm hover:underline flex items-center gap-1"
                    >
                      Edit <Edit2 className="w-3 h-3" />
                    </button> */}
                  </div>

                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Pickup from</p>
                          <p className="font-medium">
                            {quote?.pickupLocation || reservationDraft.pickupLocation}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Deliver to</p>
                          <p className="font-medium">
                            {quote?.deliveryLocation || reservationDraft.deliveryLocation}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Ship date</p>
                          <p className="font-medium">{shipDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Car model</p>
                          <p className="font-medium">{vehicleText}</p>
                        </div>
                      </div>

                      {/* Totals like Figma */}
                      <div className="rounded-lg border overflow-hidden">
                        <div
                          className="px-4 py-2 text-white text-sm font-medium"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          Total Shipping Cost
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Shipping rate</span>
                            <span className="font-semibold">{money(shippingRate)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Protection</span>
                            <span className="font-semibold">{money(coverageCost)}</span>
                          </div>

                          <div className="h-px bg-gray-200" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-800">
                              Total
                            </span>
                            <span className="font-bold text-gray-900">
                              {money(totalToPayNow)}
                            </span>
                          </div>

                          <div className="text-xs text-gray-500">
                            Carrier:{" "}
                            <span className="font-medium text-gray-700">
                              {reservationDraft.carrierType === "enclosed"
                                ? "Enclosed Carrier"
                                : "Open Carrier"}
                            </span>
                          </div>

                          <ul className="text-xs text-gray-500 space-y-1">
                            <li>• Best price availability</li>
                            <li>• Door-to-door service</li>
                            <li>• Insurance included</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end right column */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationPayment;
