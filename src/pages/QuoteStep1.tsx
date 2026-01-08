import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Pencil, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { quotesAPI } from "@/services/api";
import Testimonials from "@/components/Testimonials";

const ContactEmail = "admin@synergyxtransportation.com";

const steps = [
  { number: 1, label: "Calculate shipping" },
  { number: 2, label: "Price" },
  { number: 3, label: "Confirmation" },
  { number: 4, label: "Finish" },
];

const QuoteStep1: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Read initialData and optional source from route state so this page can be pre-filled
  const initialData = (location.state as any)?.initialData || {};
  const source = (location.state as any)?.source || null;

  // Contact form state (prefill from initialData if available)
  const [formData, setFormData] = useState({
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    callConsent: initialData.callConsent ?? false,
    smsConsent: initialData.smsConsent ?? false,
  });

  // Summary data (shown on the right) and raw values used to build the API payload
  const [summaryData, setSummaryData] = useState({
    pickupFrom: initialData.pickupLocation || initialData.pickupFrom || "—",
    deliverTo: initialData.deliveryLocation || initialData.deliverTo || "—",
    carModel:
      (initialData.brand ? `${initialData.brand} ${initialData.model || ""}` : initialData.carModel) ||
      "—",
    date: initialData.pickupDate || initialData.date || "—",
    raw: {
      pickupLocation: initialData.pickupLocation || initialData.pickupFrom || "",
      deliveryLocation: initialData.deliveryLocation || initialData.deliverTo || "",
      brand: initialData.brand || initialData.vehicle?.brand || "",
      model: initialData.model || initialData.vehicle?.model || "",
      year: initialData.year || initialData.vehicle?.year || "",
      pickupDate: initialData.pickupDate || initialData.date || "",
    },
  });

  // track whether there's a saved failed attempt (for a small dev QA retry button)
  const [hasSavedAttempt, setHasSavedAttempt] = useState(false);

  useEffect(() => {
    try {
      setHasSavedAttempt(!!sessionStorage.getItem("lastQuoteAttempt"));
    } catch {
      setHasSavedAttempt(false);
    }
  }, []);

  // Keep local state in-sync if initialData changes (e.g., when returning from edit)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: initialData.email || prev.email || "",
      phoneNumber: initialData.phoneNumber || prev.phoneNumber || "",
      callConsent: initialData.callConsent ?? prev.callConsent,
      smsConsent: initialData.smsConsent ?? prev.smsConsent,
    }));

    setSummaryData((prev) => ({
      ...prev,
      pickupFrom: initialData.pickupLocation || prev.pickupFrom || "—",
      deliverTo: initialData.deliveryLocation || prev.deliverTo || "—",
      carModel:
        (initialData.brand ? `${initialData.brand} ${initialData.model || ""}` : prev.carModel) || "—",
      date: initialData.pickupDate || prev.date || "—",
      raw: {
        pickupLocation: initialData.pickupLocation || prev.raw.pickupLocation || "",
        deliveryLocation: initialData.deliveryLocation || prev.raw.deliveryLocation || "",
        brand: initialData.brand || prev.raw.brand || "",
        model: initialData.model || prev.raw.model || "",
        year: initialData.year || prev.raw.year || "",
        pickupDate: initialData.pickupDate || prev.raw.pickupDate || "",
      },
    }));
  }, [initialData]);

  // Edit: send the current data back to the main quote form so it can prefill and the user won't lose inputs
  const handleEditClick = useCallback(() => {
    const payloadForPrefill = {
      ...summaryData.raw,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      callConsent: formData.callConsent,
      smsConsent: formData.smsConsent,
    };

    // Always navigate back to the main quote form and hand off initialData so it pre-fills.
    // This prevents losing the form state even when components unmount.
    navigate("/moving-cost-calculator", { state: { initialData: payloadForPrefill, source: "quote-step-1" } });
  }, [navigate, summaryData, formData]);

  // Validate required fields before calling the backend
  const validatePayload = (payload: any) => {
    const missing: string[] = [];
    if (!payload.pickupLocation) missing.push("Pickup location");
    if (!payload.deliveryLocation) missing.push("Delivery location");
    if (!payload.brand) missing.push("Car brand");
    if (!payload.model) missing.push("Car model");
    if (!payload.year && payload.year !== 0) missing.push("Car year");
    if (!payload.pickupDate) missing.push("Date");
    if (!payload.email) missing.push("Email");
    if (!payload.phoneNumber) missing.push("Phone number");
    return missing;
  };

  // -- Payload sanitization helpers (non-visual) --
  const sanitizePayload = (p: any) => {
    const sanitizeStr = (s: any) =>
      typeof s === "string" ? s.trim().replace(/\s+/g, " ") : s;

    const sanitized: any = {
      pickupLocation: sanitizeStr(p.pickupLocation),
      deliveryLocation: sanitizeStr(p.deliveryLocation),
      pickupDate: sanitizeStr(p.pickupDate),
      brand: sanitizeStr(p.brand),
      model: sanitizeStr(p.model),
      year:
        typeof p.year === "string"
          ? p.year.trim()
            ? Number.parseInt(p.year, 10)
            : undefined
          : p.year,
      email: sanitizeStr(p.email),
      phoneNumber:
        typeof p.phoneNumber === "string"
          ? p.phoneNumber.replace(/[^\d\+]/g, "") // remove spaces, parentheses, dashes but keep +
          : p.phoneNumber,
      callConsent: !!p.callConsent,
      smsConsent: !!p.smsConsent,
    };

    // Ensure date is YYYY-MM-DD (attempt to convert)
    if (sanitized.pickupDate && !/^\d{4}-\d{2}-\d{2}$/.test(sanitized.pickupDate)) {
      const dt = new Date(sanitized.pickupDate);
      if (!Number.isNaN(dt.getTime())) {
        sanitized.pickupDate = dt.toISOString().slice(0, 10);
      }
    }

    return sanitized;
  };

  // Heuristic to detect suspicious location strings that mix country/state names etc.
  const looksSuspiciousLocation = (loc: string) => {
    if (!loc || typeof loc !== "string") return false;
    const lower = loc.toLowerCase();
    const hasAustralia = lower.includes("australia");
    const hasUsa = lower.includes("usa") || lower.includes("united states") || /\b(usa|us|u\.s\.a)\b/.test(lower);
    if (hasAustralia && hasUsa) return true;
    if (lower.includes("city") && /\b(colorado|queensland|nsw|victoria|california|new york)\b/.test(lower)) return true;
    return false;
  };

  // retry helper (reads lastQuoteAttempt from sessionStorage)
  const retryLastAttempt = useCallback(async () => {
    const raw = sessionStorage.getItem("lastQuoteAttempt");
    if (!raw) {
      toast({ title: "No saved attempt", description: "No previous attempt found.", variant: "destructive" });
      return;
    }

    let saved: any;
    try {
      saved = JSON.parse(raw);
    } catch {
      toast({ title: "Invalid saved attempt", description: "Saved data is corrupted.", variant: "destructive" });
      return;
    }

    const attemptPayload = saved.sanitized || saved.payload;
    try {
      const resp = await quotesAPI.calculateVisitorQuote(attemptPayload);
      // clear saved attempt on success
      try { sessionStorage.removeItem("lastQuoteAttempt"); setHasSavedAttempt(false); } catch {}
      navigate("/quote-result-step-two", { state: { quote: resp } });
    } catch (err: any) {
      toast({
        title: "Retry failed",
        description: err?.message || "Server error on retry",
        variant: "destructive",
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawPayload = {
      pickupLocation: summaryData.raw.pickupLocation,
      deliveryLocation: summaryData.raw.deliveryLocation,
      pickupDate: summaryData.raw.pickupDate,
      brand: summaryData.raw.brand,
      model: summaryData.raw.model,
      year:
        typeof summaryData.raw.year === "string"
          ? summaryData.raw.year
            ? parseInt(summaryData.raw.year, 10)
            : undefined
          : summaryData.raw.year,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      callConsent: formData.callConsent,
      smsConsent: formData.smsConsent,
    };

    const missing = validatePayload(rawPayload);
    if (missing.length > 0) {
      toast({
        title: "Missing information",
        description: `Please complete the following fields before calculating a quote: ${missing.join(", ")}`,
        variant: "destructive",
      });
      if (formContainerRef.current) formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    let sanitizedPayload: any = null;

    try {
      // Sanitize and normalize
      sanitizedPayload = sanitizePayload(rawPayload);

      // Heuristic check: warn user if location looks suspicious (e.g., mixes countries)
      if (
        looksSuspiciousLocation(sanitizedPayload.deliveryLocation) ||
        looksSuspiciousLocation(sanitizedPayload.pickupLocation)
      ) {
        toast({
          title: "Check locations",
          description:
            "One of your locations looks unusual (for example includes multiple country/state names). Please confirm the pickup/delivery addresses before continuing.",
          variant: "destructive",
        });
        if (formContainerRef.current) formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Debug: print sanitized payload
      console.debug("Sanitized quote payload ->", sanitizedPayload);

      // Call the backend with sanitized payload
      const resp = await quotesAPI.calculateVisitorQuote({
        pickupLocation: sanitizedPayload.pickupLocation,
        deliveryLocation: sanitizedPayload.deliveryLocation,
        pickupDate: sanitizedPayload.pickupDate,
        brand: sanitizedPayload.brand,
        model: sanitizedPayload.model,
        year: sanitizedPayload.year,
        email: sanitizedPayload.email,
        phoneNumber: sanitizedPayload.phoneNumber,
      });

      // Success -> clear any saved attempt and navigate to result
      try {
        sessionStorage.removeItem("lastQuoteAttempt");
        setHasSavedAttempt(false);
      } catch {}

      navigate("/quote-result-step-two", { state: { quote: resp } });
    } catch (err: any) {
      // Persist the payload and server info to sessionStorage for later retry / debugging
      try {
        const saved = {
          payload: rawPayload,
          sanitized: sanitizedPayload,
          timestamp: new Date().toISOString(),
          traceId: err?.traceId || null,
          serverMessage: err?.message || null,
        };
        sessionStorage.setItem("lastQuoteAttempt", JSON.stringify(saved));
        setHasSavedAttempt(true);
      } catch (e) {
        console.warn("Could not persist last quote attempt:", e);
      }

      // Show clearer toast and print details to console for debugging
      const serverMsg = err?.message || "Failed to calculate quote. Please try again later.";
      console.error("Quote API error:", { payload: rawPayload, sanitized: sanitizedPayload, error: err });
      toast({
        title: "Server error",
        description:
          serverMsg +
          (err?.traceId ? ` (trace: ${err.traceId})` : "") +
          " — your input was saved; try again or contact support.",
        variant: "destructive",
      });
    }
  }; // end handleSubmit

  // We use a constant currentStep = 1 for display
  const currentStep = 1;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Progress Stepper */}
          <div className="w-full max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-border mx-8" />
              {/* Progress Line Active */}
              <div
                className="absolute top-4 left-0 h-0.5 bg-primary mx-8 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, maxWidth: "calc(100% - 4rem)" }}
              />

              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      step.number < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.number === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span
                    className={`mt-2 text-xs md:text-sm font-medium whitespace-nowrap ${
                      step.number <= currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left Column - Contact Form */}
            <div ref={formContainerRef}>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Let's Get a Quote that works for you
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10 h-12 bg-background border-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    aria-label="Email address"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    className="pl-10 h-12 bg-background border-input"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    aria-label="Phone number"
                    required
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="callConsent"
                    checked={formData.callConsent}
                    onCheckedChange={(checked) => setFormData({ ...formData, callConsent: checked as boolean })}
                    className="mt-1"
                  />
                  <label htmlFor="callConsent" className="text-xs text-muted-foreground leading-relaxed">
                    By checking this box, you expressly authorize Synergy X to call you, either manually or through an automated system. Your agreement to receive calls from Synergy X is not a condition of this transaction. You are to opt out of receiving calls at any time by emailing admin@synergyxtransportation.com
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="smsConsent"
                    checked={formData.smsConsent}
                    onCheckedChange={(checked) => setFormData({ ...formData, smsConsent: checked as boolean })}
                    className="mt-1"
                  />
                  <label htmlFor="smsConsent" className="text-xs text-muted-foreground leading-relaxed">
                    By checking this box, I agree to receive SMS about promotions or offers from SynergyX at the number provided. Your agreement to receive SMS messaging from Synergy X, is not a condition of this transaction. You are able to opt-out of such messaging at any time by replying "STOP". Reply "HELP" for assistance. Message frequency may vary. Message and data rates may apply.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold mt-4"
                  size="lg"
                >
                  Calculate Quote
                </Button>

                {/* Dev QA: Retry last failed attempt (only shown if there's a saved attempt) */}
                {hasSavedAttempt && (
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={retryLastAttempt}
                      className="text-sm text-muted-foreground underline"
                    >
                      Retry last failed attempt
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column - Summary */}
            <div>
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="bg-primary px-4 py-3 flex items-center justify-between">
                  <span className="text-primary-foreground font-semibold">Summary of Quote</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 h-8 px-3 gap-1"
                    onClick={handleEditClick}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                </div>

                <div className="p-4 bg-background">
                  <div className="space-y-0">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground text-sm">Pickup from</span>
                      <span className="text-foreground font-medium">{summaryData.pickupFrom}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground text-sm">Deliver to</span>
                      <span className="text-foreground font-medium">{summaryData.deliverTo}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground text-sm">Car Model</span>
                      <span className="text-foreground font-medium">{summaryData.carModel}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-muted-foreground text-sm">Date</span>
                      <span className="text-foreground font-medium">{summaryData.date}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[hsl(175,60%,40%)] p-5">
                  <p className="text-white font-medium text-sm mb-4">
                    Our knowledgeable team has 10+ years experience
                  </p>
                  <a
                    href={`mailto:${ContactEmail}`}
                    className="inline-block bg-white text-foreground px-5 py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors"
                  >
                    {ContactEmail}
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Testimonials />

      <Footer />
    </div>
  );
};

export default QuoteStep1;