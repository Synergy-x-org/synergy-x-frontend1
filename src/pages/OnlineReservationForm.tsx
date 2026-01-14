import React, { useMemo, useState, useEffect } from "react";
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
import { User, MapPin } from "lucide-react";

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
};

const OnlineReservationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const quote = useMemo<QuoteLike | null>(() => {
    const fromState = (location.state as any)?.quote;
    if (fromState) return fromState;

    try {
      const s = sessionStorage.getItem("pendingReservationQuote");
      return s ? JSON.parse(s) : null;
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

  // Form state
  const [shipmentDate, setShipmentDate] = useState("");
  const [carrierType, setCarrierType] = useState("open");

  const [pickupSameAsPrimary, setPickupSameAsPrimary] = useState(false);
  const [pickupLocationType, setPickupLocationType] =
    useState<"RESIDENTIAL" | "BUSINESS">("RESIDENTIAL");
  const [pickupContactName, setPickupContactName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupContactPrimaryPhoneNumber, setPickupContactPrimaryPhoneNumber] =
    useState("");

  const [deliverySameAsPrimary, setDeliverySameAsPrimary] = useState(false);
  const [deliveryResidentialType, setDeliveryResidentialType] =
    useState<"RESIDENTIAL" | "BUSINESS">("RESIDENTIAL");
  const [deliveryContactName, setDeliveryContactName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryContactPrimaryPhoneNumber, setDeliveryContactPrimaryPhoneNumber] =
    useState("");

  const [vehicle, setVehicle] = useState(() => {
    if (!quote?.vehicle) return "";
    return `${quote.vehicle.brand} ${quote.vehicle.model}`.trim();
  });
  const [condition, setCondition] = useState("Runs & Drive");

  const handleSubmit = async () => {
    if (!quote?.quoteReference) {
      toast({
        title: "Error",
        description: "Quote reference missing. Please recalculate quote.",
        variant: "destructive",
      });
      return;
    }

    if (
      !pickupAddress ||
      !deliveryAddress ||
      !pickupContactName ||
      !deliveryContactName ||
      !pickupContactPrimaryPhoneNumber ||
      !deliveryContactPrimaryPhoneNumber
    ) {
      toast({
        title: "Missing fields",
        description: "Please complete pickup/delivery contact & addresses.",
        variant: "destructive",
      });
      return;
    }

    // ✅ You said: after submit, go to payment protection
    navigate("/payment-protection", {
      state: {
        quoteReference: quote.quoteReference,
        reservationDraft: {
          quoteReference: quote.quoteReference,
          pickupAddress,
          deliveryAddress,
          pickupContactName,
          pickupContactPrimaryPhoneNumber,
          deliveryContactName,
          deliveryContactPrimaryPhoneNumber,
          pickUpResidenceType: pickupLocationType,
          deliveryResidentialType,
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
                  <label className="block text-sm text-gray-600 mb-1">
                    Shipment Date
                  </label>
                  <Select value={shipmentDate} onValueChange={setShipmentDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipment date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11/04/2025">11/04/2025</SelectItem>
                      <SelectItem value="11/05/2025">11/05/2025</SelectItem>
                      <SelectItem value="11/06/2025">11/06/2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Carrier Type
                  </label>
                  <Select value={carrierType} onValueChange={setCarrierType}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Pickup Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter your address"
                      className="pl-10"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Primary Phone Number
                  </label>
                  <Input
                    placeholder="e.g. 09012345678"
                    value={pickupContactPrimaryPhoneNumber}
                    onChange={(e) =>
                      setPickupContactPrimaryPhoneNumber(e.target.value)
                    }
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Location Type
                  </label>
                  <Select
                    value={deliveryResidentialType}
                    onValueChange={(v) =>
                      setDeliveryResidentialType(v as "RESIDENTIAL" | "BUSINESS")
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter your address"
                      className="pl-10"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Primary Phone Number
                  </label>
                  <Input
                    placeholder="e.g. 08123456789"
                    value={deliveryContactPrimaryPhoneNumber}
                    onChange={(e) =>
                      setDeliveryContactPrimaryPhoneNumber(e.target.value)
                    }
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
