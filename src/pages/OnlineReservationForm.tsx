import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, MapPin, Phone } from "lucide-react";
import { getAutocomplete } from "@/services/mapService"; // ✅ use your endpoint

const PRIMARY = "#E85C2B";

type QuoteLike = {
  pickupLocation: string;
  deliveryLocation: string;
  quoteReference: string;
  vehicle?: { brand: string; model: string; year: number; id?: string };
  deliveryDate?: string;
  price?: number;
  downPayment?: number;
  balanceOnDelivery?: number;

  pickupdate?: string;
  pickupDate?: string;
  shipmentDate?: string;
};

/**
 * ✅ Autocomplete helper:
 * Your backend may return different shapes (array of strings, array of objects, Google-like).
 * This function normalizes to string[] safely.
 */
const normalizeAutocomplete = (data: any): string[] => {
  if (!data) return [];

  // If API returns: ["Abuja", "Abuja Municipal", ...]
  if (Array.isArray(data) && data.every((x) => typeof x === "string")) return data;

  // If API returns: { predictions: [{ description: "..." }, ...] }
  if (Array.isArray(data?.predictions)) {
    return data.predictions
      .map((p: any) => p?.description)
      .filter((v: any) => typeof v === "string");
  }

  // If API returns: [{ description: "..." }, ...]
  if (Array.isArray(data) && data.some((x) => typeof x === "object")) {
    return data
      .map((x: any) => x?.description || x?.name || x?.formatted_address)
      .filter((v: any) => typeof v === "string");
  }

  return [];
};

/**
 * ✅ Minimal dropdown that does NOT change your UI layout:
 * It's just an absolutely positioned list under the input.
 */
type AutoFieldProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  leftIcon: React.ReactNode; // keep your MapPin icon etc
  inputAriaLabel: string;
};

const AutoCompleteInput: React.FC<AutoFieldProps> = ({
  value,
  onChange,
  placeholder,
  leftIcon,
  inputAriaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastQueryRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const runSearch = (q: string) => {
    const query = q.trim();
    onChange(q);

    // guard: only search after a few chars
    if (query.length < 3) {
      setItems([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    // debounce
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      // prevent duplicate calls for same query
      if (lastQueryRef.current === query) {
        setOpen(true);
        return;
      }
      lastQueryRef.current = query;

      try {
        setLoading(true);
        setOpen(true);

        // cancel prior request if any
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        // Your getAutocomplete doesn't accept signal; that's okay.
        // We'll still abort locally by ignoring stale responses:
        const res = await getAutocomplete(query);

        // ignore stale responses
        if (lastQueryRef.current !== query) return;

        const normalized = normalizeAutocomplete(res);
        setItems(normalized.slice(0, 8));
        setActiveIndex(-1);
      } catch (e: any) {
        // ignore abort-like cases; otherwise, close dropdown quietly
        setItems([]);
        setOpen(false);
      } finally {
        if (lastQueryRef.current === query) setLoading(false);
      }
    }, 250);
  };

  const commit = (text: string) => {
    onChange(text);
    setOpen(false);
    setItems([]);
    setActiveIndex(-1);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= items.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? items.length - 1 : next;
      });
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < items.length) {
        e.preventDefault();
        commit(items[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* keep same UI: icon + Input with pl-10 */}
      {leftIcon}
      <Input
        aria-label={inputAriaLabel}
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => runSearch(e.target.value)}
        onFocus={() => {
          if (items.length > 0) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      {/* dropdown (minimal, doesn't change layout) */}
      {open && (loading || items.length > 0) && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow">
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No suggestions
            </div>
          )}

          {!loading &&
            items.map((it, idx) => (
              <button
                type="button"
                key={`${it}-${idx}`}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${
                  idx === activeIndex ? "bg-muted" : ""
                }`}
                onMouseDown={(e) => {
                  // prevent input blur before click
                  e.preventDefault();
                }}
                onClick={() => commit(it)}
              >
                {it}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

const OnlineReservationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const quote = useMemo<QuoteLike | null>(() => {
    const fromState = (location.state as any)?.quote;
    if (fromState) return fromState;

    try {
      const s = sessionStorage.getItem("pendingReservationQuote");
      return s ? (JSON.parse(s) as QuoteLike) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  useEffect(() => {
    if (!quote) {
      toast({
        title: "Missing quote",
        description: "Please calculate a quote again.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [quote, navigate]);

  const shipmentDateFromQuote =
    quote?.shipmentDate || quote?.pickupdate || quote?.pickupDate || "N/A";

  // form state
  const [carrierType, setCarrierType] = useState<"open" | "enclosed">("open");

  // Pickup
  const [pickupSameAsPrimary, setPickupSameAsPrimary] = useState(false);
  const [pickupLocationType, setPickupLocationType] =
    useState<"RESIDENTIAL" | "BUSINESS">("RESIDENTIAL");
  const [pickupContactName, setPickupContactName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupPrimaryPhone, setPickupPrimaryPhone] = useState("");
  const [pickupSecondaryPhone, setPickupSecondaryPhone] = useState("");

  // Delivery
  const [deliverySameAsPrimary, setDeliverySameAsPrimary] = useState(false);
  const [deliveryResidentialType, setDeliveryResidentialType] =
    useState<"RESIDENTIAL" | "BUSINESS">("RESIDENTIAL");
  const [deliveryContactName, setDeliveryContactName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryPrimaryPhone, setDeliveryPrimaryPhone] = useState("");
  const [deliverySecondaryPhone, setDeliverySecondaryPhone] = useState("");

  // Vehicle
  const [vehicle, setVehicle] = useState(() => {
    if (!quote?.vehicle) return "";
    return `${quote.vehicle.brand} ${quote.vehicle.model}`.trim();
  });
  const [condition, setCondition] = useState("Runs & Drive");

  // sync behavior when "same as primary" is checked
  useEffect(() => {
    if (pickupSameAsPrimary) {
      if (deliveryContactName) setPickupContactName(deliveryContactName);
      if (deliveryPrimaryPhone) setPickupPrimaryPhone(deliveryPrimaryPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupSameAsPrimary]);

  useEffect(() => {
    if (deliverySameAsPrimary) {
      if (pickupContactName) setDeliveryContactName(pickupContactName);
      if (pickupPrimaryPhone) setDeliveryPrimaryPhone(pickupPrimaryPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverySameAsPrimary]);

  const handleSubmit = () => {
    if (!quote?.quoteReference) {
      toast({
        title: "Error",
        description: "Quote reference missing. Please recalculate quote.",
        variant: "destructive",
      });
      return;
    }

    // REQUIRED fields only
    if (
      !pickupContactName ||
      !pickupAddress ||
      !pickupLocation ||
      !pickupPrimaryPhone ||
      !deliveryContactName ||
      !deliveryAddress ||
      !deliveryLocation ||
      !deliveryPrimaryPhone
    ) {
      toast({
        title: "Missing fields",
        description:
          "Please complete required pickup and delivery details (secondary phone is optional).",
        variant: "destructive",
      });
      return;
    }

    navigate("/payment-protection", {
      state: {
        quoteReference: quote.quoteReference,
        reservationDraft: {
          quoteReference: quote.quoteReference,
          pickupAddress,
          deliveryAddress,
          pickupContactName,
          pickupContactPrimaryPhoneNumber: pickupPrimaryPhone,
          deliveryContactName,
          deliveryContactPrimaryPhoneNumber: deliveryPrimaryPhone,
          pickUpResidenceType: pickupLocationType,
          deliveryResidentialType: deliveryResidentialType,

          // extra fields
          pickupLocation,
          pickupContactSecondaryPhoneNumber: pickupSecondaryPhone || undefined,
          deliveryLocation,
          deliveryContactSecondaryPhoneNumber: deliverySecondaryPhone || undefined,

          carrierType,
          condition,
          vehicle,
          shipmentDate: shipmentDateFromQuote,
        },
      },
    });
  };

  if (!quote) return null;

  const carModelText = quote.vehicle
    ? `${quote.vehicle.brand} ${quote.vehicle.model} ${quote.vehicle.year}`
    : vehicle;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Stepper */}
          <div className="mb-8 pt-24">
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-4xl justify-between">
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
                          backgroundColor: idx < 2 ? PRIMARY : "#D1D5DB",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="mx-auto w-full max-w-4xl bg-white rounded-2xl shadow-sm px-4 sm:px-6 md:px-8 py-6">
            <h1 className="text-2xl font-semibold text-center mb-2">
              Online Shipment Reservation
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Complete the secured online reservation form to book your shipment
            </p>

            {/* Quote Section */}
            <div
              className="text-white px-4 py-3 rounded-t-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              <span className="font-medium">Quote #{quote.quoteReference}</span>
            </div>

            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Pickup from</p>
                  <p className="font-medium">{quote.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Deliver to</p>
                  <p className="font-medium">{quote.deliveryLocation}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Car Model</p>
                  <p className="font-medium">{carModelText}</p>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div
              className="text-white px-4 py-3 rounded-t-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              <span className="font-medium">Shipment Details</span>
            </div>

            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Shipment Date</p>
                  <p className="font-medium">{shipmentDateFromQuote}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Carrier Type
                  </label>
                  <Select
                    value={carrierType}
                    onValueChange={(v) =>
                      setCarrierType(v as "open" | "enclosed")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Open Carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Carrier</SelectItem>
                      <SelectItem value="enclosed">Enclosed Carrier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div
              className="text-white px-4 py-3 rounded-t-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              <span className="font-medium">Pickup Location</span>
            </div>

            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="pickupSame"
                  checked={pickupSameAsPrimary}
                  onCheckedChange={(checked) =>
                    setPickupSameAsPrimary(checked as boolean)
                  }
                />
                <label htmlFor="pickupSame" className="text-sm text-gray-600">
                  Pickup contact same as primary contact
                </label>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Location Type
                  </label>
                  <Select
                    value={pickupLocationType}
                    onValueChange={(v) =>
                      setPickupLocationType(v as "RESIDENTIAL" | "BUSINESS")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Residence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RESIDENTIAL">Residence</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Contact Person (Full Name)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={pickupContactName}
                      onChange={(e) => setPickupContactName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Pickup Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {/* ✅ AUTOCOMPLETE */}
                    <AutoCompleteInput
                      value={pickupAddress}
                      onChange={setPickupAddress}
                      placeholder="Enter pickup address"
                      inputAriaLabel="Pickup Address"
                      leftIcon={
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Pickup Location
                  </label>
                  <div className="relative">
                    {/* ✅ AUTOCOMPLETE */}
                    <AutoCompleteInput
                      value={pickupLocation}
                      onChange={setPickupLocation}
                      placeholder="Enter pickup location"
                      inputAriaLabel="Pickup Location"
                      leftIcon={
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Primary Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="e.g. 09012345678"
                      className="pl-10"
                      value={pickupPrimaryPhone}
                      onChange={(e) => setPickupPrimaryPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Secondary Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="e.g. 09012345678"
                      className="pl-10"
                      value={pickupSecondaryPhone}
                      onChange={(e) => setPickupSecondaryPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Location */}
            <div
              className="text-white px-4 py-3 rounded-t-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              <span className="font-medium">Delivery Location</span>
            </div>

            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="deliverySame"
                  checked={deliverySameAsPrimary}
                  onCheckedChange={(checked) =>
                    setDeliverySameAsPrimary(checked as boolean)
                  }
                />
                <label htmlFor="deliverySame" className="text-sm text-gray-600">
                  Delivery contact same as primary contact
                </label>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Location Type
                  </label>
                  <Select
                    value={deliveryResidentialType}
                    onValueChange={(v) =>
                      setDeliveryResidentialType(
                        v as "RESIDENTIAL" | "BUSINESS"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Residence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RESIDENTIAL">Residence</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Contact Person (Full Name)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={deliveryContactName}
                      onChange={(e) => setDeliveryContactName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Delivery Address
                  </label>
                  <div className="relative">
                    {/* ✅ AUTOCOMPLETE */}
                    <AutoCompleteInput
                      value={deliveryAddress}
                      onChange={setDeliveryAddress}
                      placeholder="Enter delivery address"
                      inputAriaLabel="Delivery Address"
                      leftIcon={
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Delivery Location
                  </label>
                  <div className="relative">
                    {/* ✅ AUTOCOMPLETE */}
                    <AutoCompleteInput
                      value={deliveryLocation}
                      onChange={setDeliveryLocation}
                      placeholder="Enter delivery location"
                      inputAriaLabel="Delivery Location"
                      leftIcon={
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Primary Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="e.g. 08123456789"
                      className="pl-10"
                      value={deliveryPrimaryPhone}
                      onChange={(e) => setDeliveryPrimaryPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Secondary Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="e.g. 08123456789"
                      className="pl-10"
                      value={deliverySecondaryPhone}
                      onChange={(e) => setDeliverySecondaryPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div
              className="text-white px-4 py-3 rounded-t-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              <span className="font-medium">Vehicle Details</span>
            </div>

            <div className="border border-t-0 rounded-b-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Vehicle
                  </label>
                  <Input
                    placeholder="Vehicle name"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Condition
                  </label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Runs & Drive" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Runs & Drive">Runs & Drive</SelectItem>
                      <SelectItem value="Non-Running">Non-Running</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full text-white py-6"
              style={{ backgroundColor: PRIMARY }}
            >
              Submit & Continue
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OnlineReservationForm;
