import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { carBrandsAPI, quotesAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const QuoteForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carModels, setCarModels] = useState<Record<string, number[]>>({});
  const [formData, setFormData] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    year: "",
    brand: "", // Changed from 'make' to 'brand'
    model: "",
    pickupDate: "", // Changed from 'date' to 'pickupDate'
    email: "", // Added email
    phoneNumber: "", // Added phoneNumber
  });

  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const brands = await carBrandsAPI.getAllCarBrands();
        setCarBrands(brands);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch car brands",
          variant: "destructive",
        });
      }
    };
    fetchCarBrands();
  }, []);

  useEffect(() => {
    const fetchCarModels = async () => {
      if (formData.brand) {
        try {
          const models = await carBrandsAPI.getModelsByBrand(formData.brand);
          setCarModels(models);
          setFormData((prev) => ({ ...prev, model: "", year: "" })); // Reset model and year when brand changes
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || `Failed to fetch models for ${formData.brand}`,
            variant: "destructive",
          });
        }
      } else {
        setCarModels({});
        setFormData((prev) => ({ ...prev, model: "", year: "" }));
      }
    };
    fetchCarModels();
  }, [formData.brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await quotesAPI.calculateVisitorQuote({
        ...formData,
        year: parseInt(formData.year), // Ensure year is a number
      });
      toast({
        title: "Success!",
        description: "Quote calculated successfully.",
      });
      navigate("/quote-result", { state: { quote: response } });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Your Location"
            className="pl-10"
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
          />
        </div>

        <div className="relative">
          <Navigation className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Delivery Location"
            className="pl-10"
            value={formData.deliveryLocation}
            onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
          />
        </div>

        <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
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

        <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })} disabled={!formData.brand}>
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

        <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })} disabled={!formData.model}>
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {formData.model && carModels[formData.model]?.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="mm/dd/yyyy"
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

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={loading}>
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
