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
import { getAutocomplete } from "@/services/mapService";

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

type CountryCodeOption = {
  label: string;
  value: string;
};

const buildCountryCodes = (data: any[]): CountryCodeOption[] => {
  const results: CountryCodeOption[] = [];

  for (const c of data || []) {
    const root = c?.idd?.root;
    const suffixes: string[] = c?.idd?.suffixes || [];
    const name = c?.name?.common || c?.name?.official || "Unknown";
    if (!root) continue;

    if (suffixes.length === 0) {
      results.push({ label: `${name} (${root})`, value: root });
    } else {
      const code = `${root}${suffixes[0]}`;
      results.push({ label: `${name} (${code})`, value: code });
    }
  }

  const map = new Map<string, CountryCodeOption>();
  for (const r of results) if (!map.has(r.value)) map.set(r.value, r);

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
};

const splitPhone = (full: string | undefined): { code: string; number: string } => {
  const v = (full || "").trim();
  const match = v.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) return { code: match[1], number: (match[2] || "").trim() };
  return { code: "+1", number: v };
};

const PhoneWithCountry: React.FC<{
  value: { code: string; number: string };
  onChange: (next: { code: string; number: string }) => void;
  options: CountryCodeOption[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  return (
    <div className="flex gap-2">
      <div className="w-[140px]">
        <Select value={value.code} onValueChange={(v) => onChange({ ...value, code: v })}>
          <SelectTrigger>
            <SelectValue placeholder="+1" />
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          className="pl-10"
          placeholder={placeholder}
          value={value.number}
          onChange={(e) => onChange({ ...value, number: e.target.value })}
        />
      </div>
    </div>
  );
};

const normalizeAutocomplete = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data) && data.every((x) => typeof x === "string")) return data;

  if (Array.isArray(data?.predictions)) {
    return data.predictions
      .map((p: any) => p?.description)
      .filter((v: any) => typeof v === "string");
  }

  if (Array.isArray(data) && data.some((x) => typeof x === "object")) {
    return data
      .map((x: any) => x?.description || x?.name || x?.formatted_address)
      .filter((v: any) => typeof v === "string");
  }

  return [];
};

const AddressAutocompleteInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaLabel: string;
}> = ({ value, onChange, placeholder, ariaLabel }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const queryRef = useRef<string>("");

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

  const runSearch = (raw: string) => {
    onChange(raw);

    const q = raw.trim();
    if (q.length < 3) {
      setItems([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        setOpen(true);
        queryRef.current = q;

        const res = await getAutocomplete(q);
        if (queryRef.current !== q) return;

        const normalized = normalizeAutocomplete(res).slice(0, 8);
        setItems(normalized);
        setActiveIndex(-1);
      } catch {
        setItems([]);
        setOpen(false);
      } finally {
        if (queryRef.current === q) setLoading(false);
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
      setActiveIndex((prev) => (prev + 1 >= items.length ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? items.length - 1 : prev - 1));
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
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        aria-label={ariaLabel}
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

      {open && (loading || items.length > 0) && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow">
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching...
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
                onMouseDown={(e) => e.preventDefault()}
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

  const mode = (location.state as any)?.mode as "edit" | undefined;
  const isEditMode = mode === "edit";

  // ✅ FIX: if NOT edit mode, wipe any previous draft so new users don't inherit it
  useEffect(() => {
    if (!isEditMode) {
      sessionStorage.removeItem("reservationDraft");
    }
  }, [isEditMode]);

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

  const draftFromNav = useMemo<ReservationDraft | null>(() => {
    const d = (location.state as any)?.reservationDraft;
    return d ?? null;
  }, [location.state]);

  const draftFromStorage = useMemo<ReservationDraft | null>(() => {
    try {
      const s = sessionStorage.getItem("reservationDraft");
      return s ? (JSON.parse(s) as ReservationDraft) : null;
    } catch {
      return null;
    }
  }, []);

  // ✅ FIX: only hydrate draft when editing from PaymentProtection
  const initialDraft = isEditMode ? (draftFromNav || draftFromStorage) : null;

  const [countryCodes, setCountryCodes] = useState<CountryCodeOption[]>([
    { label: "United States (+1)", value: "+1" },
  ]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,idd");
        const json = await res.json();
        const options = buildCountryCodes(json);

        if (!alive) return;

        const top = ["+234", "+1"];
        const prioritized = [
          ...options.filter((o) => top.includes(o.value)),
          ...options.filter((o) => !top.includes(o.value)),
        ];

        setCountryCodes(prioritized);
      } catch {
        // keep default
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

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

  if (!quote) return null;

  const shipmentDateFromQuote =
    quote.shipmentDate || quote.pickupdate || quote.pickupDate || "N/A";

  const [carrierType, setCarrierType] = useState<"open" | "enclosed">(
    (initialDraft?.carrierType as any) || "open"
  );

  const [pickupSameAsPrimary, setPickupSameAsPrimary] = useState(false);
  const [pickupLocationType, setPickupLocationType] = useState<
    "RESIDENTIAL" | "BUSINESS"
  >(initialDraft?.pickUpResidenceType || "RESIDENTIAL");

  const [pickupContactName, setPickupContactName] = useState(
    initialDraft?.pickupContactName || ""
  );

  const [pickupAddress, setPickupAddress] = useState(
    initialDraft?.pickupAddress || ""
  );

  const [pickupLocation, setPickupLocation] = useState<string>(
    initialDraft?.pickupLocation || quote.pickupLocation || ""
  );

  const pickupPrimarySplit = splitPhone(
    initialDraft?.pickupContactPrimaryPhoneNumber
  );
  const pickupSecondarySplit = splitPhone(
    initialDraft?.pickupContactSecondaryPhoneNumber
  );

  const [pickupPrimaryPhone, setPickupPrimaryPhone] = useState<{
    code: string;
    number: string;
  }>(pickupPrimarySplit);

  const [pickupSecondaryPhone, setPickupSecondaryPhone] = useState<{
    code: string;
    number: string;
  }>(pickupSecondarySplit);

  const [deliverySameAsPrimary, setDeliverySameAsPrimary] = useState(false);
  const [deliveryResidentialType, setDeliveryResidentialType] = useState<
    "RESIDENTIAL" | "BUSINESS"
  >(initialDraft?.deliveryResidentialType || "RESIDENTIAL");

  const [deliveryContactName, setDeliveryContactName] = useState(
    initialDraft?.deliveryContactName || ""
  );

  const [deliveryAddress, setDeliveryAddress] = useState(
    initialDraft?.deliveryAddress || ""
  );

  const [deliveryLocation, setDeliveryLocation] = useState<string>(
    initialDraft?.deliveryLocation || quote.deliveryLocation || ""
  );

  const deliveryPrimarySplit = splitPhone(
    initialDraft?.deliveryContactPrimaryPhoneNumber
  );
  const deliverySecondarySplit = splitPhone(
    initialDraft?.deliveryContactSecondaryPhoneNumber
  );

  const [deliveryPrimaryPhone, setDeliveryPrimaryPhone] = useState<{
    code: string;
    number: string;
  }>(deliveryPrimarySplit);

  const [deliverySecondaryPhone, setDeliverySecondaryPhone] = useState<{
    code: string;
    number: string;
  }>(deliverySecondarySplit);

  const [vehicle, setVehicle] = useState<string>(() => {
    if (initialDraft?.vehicle) return initialDraft.vehicle;
    if (!quote.vehicle) return "";
    return `${quote.vehicle.brand} ${quote.vehicle.model}`.trim();
  });

  const [condition, setCondition] = useState<string>(
    initialDraft?.condition || "Runs & Drive"
  );

  useEffect(() => {
    if (!isEditMode) {
      setPickupLocation(quote.pickupLocation || "");
      setDeliveryLocation(quote.deliveryLocation || "");
    }
  }, [isEditMode, quote.pickupLocation, quote.deliveryLocation]);

  useEffect(() => {
    if (pickupSameAsPrimary) {
      if (deliveryContactName) setPickupContactName(deliveryContactName);
      if (deliveryPrimaryPhone.number)
        setPickupPrimaryPhone(deliveryPrimaryPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupSameAsPrimary]);

  useEffect(() => {
    if (deliverySameAsPrimary) {
      if (pickupContactName) setDeliveryContactName(pickupContactName);
      if (pickupPrimaryPhone.number)
        setDeliveryPrimaryPhone(pickupPrimaryPhone);
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

    const pickupPrimaryFull =
      `${pickupPrimaryPhone.code} ${pickupPrimaryPhone.number}`.trim();
    const deliveryPrimaryFull =
      `${deliveryPrimaryPhone.code} ${deliveryPrimaryPhone.number}`.trim();

    const pickupSecondaryFull = pickupSecondaryPhone.number
      ? `${pickupSecondaryPhone.code} ${pickupSecondaryPhone.number}`.trim()
      : undefined;

    const deliverySecondaryFull = deliverySecondaryPhone.number
      ? `${deliverySecondaryPhone.code} ${deliverySecondaryPhone.number}`.trim()
      : undefined;

    if (
      !pickupContactName ||
      !pickupAddress ||
      !pickupPrimaryPhone.number ||
      !deliveryContactName ||
      !deliveryAddress ||
      !deliveryPrimaryPhone.number
    ) {
      toast({
        title: "Missing fields",
        description:
          "Please complete required pickup and delivery details (secondary phone is optional).",
        variant: "destructive",
      });
      return;
    }

    const finalPickupLocation = isEditMode ? pickupLocation : quote.pickupLocation;
    const finalDeliveryLocation = isEditMode ? deliveryLocation : quote.deliveryLocation;

    const reservationDraft: ReservationDraft = {
      quoteReference: quote.quoteReference,

      pickupAddress,
      pickupLocation: finalPickupLocation,
      pickupContactName,
      pickupContactPrimaryPhoneNumber: pickupPrimaryFull,
      pickupContactSecondaryPhoneNumber: pickupSecondaryFull,
      pickUpResidenceType: pickupLocationType,

      deliveryAddress,
      deliveryLocation: finalDeliveryLocation,
      deliveryContactName,
      deliveryContactPrimaryPhoneNumber: deliveryPrimaryFull,
      deliveryContactSecondaryPhoneNumber: deliverySecondaryFull,
      deliveryResidentialType,

      carrierType,
      condition,
      vehicle,
      shipmentDate: shipmentDateFromQuote,
    };

    // ✅ Store draft only to support edit flow (PaymentProtection -> Edit)
    sessionStorage.setItem("reservationDraft", JSON.stringify(reservationDraft));

    navigate("/payment-protection", {
      state: {
        quoteReference: quote.quoteReference,
        quote,
        reservationDraft,
      },
    });
  };

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
                  <AddressAutocompleteInput
                    value={pickupAddress}
                    onChange={setPickupAddress}
                    placeholder="Enter pickup address"
                    ariaLabel="Pickup Address"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter pickup location"
                      className="pl-10"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      disabled={!isEditMode}
                      readOnly={!isEditMode}
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
                  <PhoneWithCountry
                    value={pickupPrimaryPhone}
                    onChange={setPickupPrimaryPhone}
                    options={countryCodes}
                    placeholder="e.g. 12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Secondary Phone Number
                  </label>
                  <PhoneWithCountry
                    value={pickupSecondaryPhone}
                    onChange={setPickupSecondaryPhone}
                    options={countryCodes}
                    placeholder="e.g. 12345678"
                  />
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
                      placeholder="Enter full name"
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
                  <AddressAutocompleteInput
                    value={deliveryAddress}
                    onChange={setDeliveryAddress}
                    placeholder="Enter delivery address"
                    ariaLabel="Delivery Address"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Delivery Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter delivery location"
                      className="pl-10"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      disabled={!isEditMode}
                      readOnly={!isEditMode}
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
                  <PhoneWithCountry
                    value={deliveryPrimaryPhone}
                    onChange={setDeliveryPrimaryPhone}
                    options={countryCodes}
                    placeholder="e.g. 08123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Secondary Phone Number
                  </label>
                  <PhoneWithCountry
                    value={deliverySecondaryPhone}
                    onChange={setDeliverySecondaryPhone}
                    options={countryCodes}
                    placeholder="e.g. 0123456789"
                  />
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
        readOnly
        disabled
        className="bg-gray-100 cursor-not-allowed"
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
                      {/* <SelectItem value="Non-Running">Non-Running</SelectItem> */}
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
