import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { carBrandsAPI, quotesAPI } from "@/services/api";
import { getAutocomplete } from "@/services/mapService";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface QuoteFormProps {
  initialData?: any;
  onSubmit?: (data: any) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ initialData, onSubmit }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carModels, setCarModels] = useState<Record<string, number[]>>({});
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    pickupLocation: initialData?.pickupLocation || "",
    deliveryLocation: initialData?.deliveryLocation || "",
    year: initialData?.year || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    pickupDate: initialData?.pickupDate || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
  });

  // --- Fetch car brands ---
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await carBrandsAPI.getAllCarBrands();
        setCarBrands(response || []);
      } catch (error: any) {
        console.error("Failed to load car brands:", error);
        toast({
          title: "Error",
          description: "Failed to load car brands",
          variant: "destructive",
        });
      }
    };
    fetchBrands();
  }, []);

  // --- Fetch car models when brand changes ---
  useEffect(() => {
    if (!formData.brand) return;
    const fetchModels = async () => {
      try {
        const response = await carBrandsAPI.getModelsByBrand(formData.brand);
        if (response && typeof response === "object" && !Array.isArray(response)) {
          setCarModels(response as Record<string, number[]>);
        } else {
          setCarModels({});
        }
      } catch (error: any) {
        console.error("Failed to load models:", error);
        toast({
          title: "Error",
          description: "Failed to load models for selected brand",
          variant: "destructive",
        });
      }
    };
    fetchModels();
  }, [formData.brand]);

  // --- Autocomplete for Pickup ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.pickupLocation.length < 3) {
        setPickupSuggestions([]);
        return;
      }
      try {
        const suggestions = await getAutocomplete(formData.pickupLocation);
        setPickupSuggestions(suggestions);
      } catch (error: any) {
        console.error(error);
      }
    };
    const timeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [formData.pickupLocation]);

  // --- Autocomplete for Delivery ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.deliveryLocation.length < 3) {
        setDeliverySuggestions([]);
        return;
      }
      try {
        const suggestions = await getAutocomplete(formData.deliveryLocation);
        setDeliverySuggestions(suggestions);
      } catch (error: any) {
        console.error(error);
      }
    };
    const timeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [formData.deliveryLocation]);

  // --- Submit Quote ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await quotesAPI.calculateVisitorQuote({
          ...formData,
          year: parseInt(formData.year),
        });
        toast({ title: "Success!", description: "Quote calculated successfully." });
        navigate("/quote-result-step-two", { state: { quote: response } });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to calculate quote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-2xl">
      <h3 className="text-2xl font-bold mb-6">Calculate Your Shipping Cost</h3>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {/* Pickup Input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Pickup Location"
            className="pl-10"
            value={formData.pickupLocation}
            onChange={(e) =>
              setFormData({ ...formData, pickupLocation: e.target.value })
            }
          />
          {pickupSuggestions.length > 0 && (
            <ul className="absolute bg-white border rounded-md mt-1 w-full z-50 shadow-md">
              {pickupSuggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className="px-4 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    setFormData({ ...formData, pickupLocation: suggestion });
                    setPickupSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Delivery Input */}
        <div className="relative">
          <Navigation className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Delivery Location"
            className="pl-10"
            value={formData.deliveryLocation}
            onChange={(e) =>
              setFormData({ ...formData, deliveryLocation: e.target.value })
            }
          />
          {deliverySuggestions.length > 0 && (
            <ul className="absolute bg-white border rounded-md mt-1 w-full z-50 shadow-md">
              {deliverySuggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className="px-4 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    setFormData({ ...formData, deliveryLocation: suggestion });
                    setDeliverySuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Car Brand */}
        <Select
          value={formData.brand}
          onValueChange={(value) => setFormData({ ...formData, brand: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Car Brand" />
          </SelectTrigger>
          <SelectContent>
            {carBrands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Car Model */}
        <Select
          value={formData.model}
          onValueChange={(value) => setFormData({ ...formData, model: value })}
          disabled={!formData.brand}
        >
          <SelectTrigger>
            <SelectValue placeholder="Car Model" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(carModels).map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={formData.year}
          onValueChange={(value) => setFormData({ ...formData, year: value })}
          disabled={!formData.model}
        >
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {formData.model &&
              carModels[formData.model]?.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Other inputs */}
        <Input
          type="date"
          value={formData.pickupDate}
          onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
          required
        />

        <Input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          type="tel"
          placeholder="Your Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Quote"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        We respect your privacy and do not distribute your data.
      </p>
    </Card>
  );
};

export default QuoteForm;
