import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getAutocomplete } from "@/services/mapService";
import { carBrandsAPI, quotesAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ReadyToShip from "@/components/ReadyToShip";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import carShipping from "@/assets/car-shipping.png";
import crosscarcountry from "@/assets/crosscarcountry.png";
import Header from "@/components/Header";

const ShipCarToAnotherState = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carModels, setCarModels] = useState<Record<string, number[]>>({});
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    year: "",
    brand: "",
    model: "",
    pickupDate: "",
    email: "",
    phoneNumber: "",
  });

  // Fetch car brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await carBrandsAPI.getAllCarBrands();
        setCarBrands(response || []);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load car brands",
          variant: "destructive",
        });
      }
    };
    fetchBrands();
  }, []);

  // Fetch models
  useEffect(() => {
    if (!formData.brand) return;
    const fetchModels = async () => {
      try {
        const response = await carBrandsAPI.getModelsByBrand(formData.brand);
        setCarModels(response || {});
      } catch {
        toast({
          title: "Error",
          description: "Failed to load car models",
          variant: "destructive",
        });
      }
    };
    fetchModels();
  }, [formData.brand]);

  // Autocomplete pickup
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.pickupLocation.length < 3) return setPickupSuggestions([]);
      const results = await getAutocomplete(formData.pickupLocation);
      setPickupSuggestions(results);
    };
    const timeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [formData.pickupLocation]);

  // Autocomplete delivery
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.deliveryLocation.length < 3) return setDeliverySuggestions([]);
      const results = await getAutocomplete(formData.deliveryLocation);
      setDeliverySuggestions(results);
    };
    const timeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [formData.deliveryLocation]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await quotesAPI.calculateVisitorQuote({
        ...formData,
        year: parseInt(formData.year),
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
    <div>
      <Header />
      <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: `url(${carShipping})` }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full container mx-auto px-6 py-10">
        {/* === LEFT SIDE TEXT === */}
        <div className="text-white max-w-lg md:w-1/2">
          <h1 className="text-5xl font-bold mb-4">Cross-Country Shipping</h1>
          <p className="text-lg text-gray-100 mb-6">
            Get your car delivered safely, anywhere, anytime. Fast, secure,
            and affordable auto transport for individuals and businesses.
          </p>
          <Link to="/moving-cost-calculator">
  <Button size="lg" className="bg-primary hover:bg-primary/90">
    Get a free quote!
  </Button>
</Link>

        </div>

        {/* === RIGHT SIDE FORM === */}
        <Card className="p-8 bg-white/95 shadow-2xl rounded-2xl max-w-md w-full md:w-1/2">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Calculate your shipping cost
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Pickup */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Location"
                className="pl-9"
                value={formData.pickupLocation}
                onChange={(e) =>
                  setFormData({ ...formData, pickupLocation: e.target.value })
                }
              />
              {pickupSuggestions.length > 0 && (
                <ul className="absolute bg-white border rounded-md mt-1 w-full z-50 shadow">
                  {pickupSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, pickupLocation: s });
                        setPickupSuggestions([]);
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Delivery */}
            <div className="relative">
              <Navigation className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Destination"
                className="pl-9"
                value={formData.deliveryLocation}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryLocation: e.target.value })
                }
              />
              {deliverySuggestions.length > 0 && (
                <ul className="absolute bg-white border rounded-md mt-1 w-full z-50 shadow">
                  {deliverySuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, deliveryLocation: s });
                        setDeliverySuggestions([]);
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Brand, Model, Year */}
            <Select
              value={formData.brand}
              onValueChange={(value) => setFormData({ ...formData, brand: value })}
            >
              <SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent>
                {carBrands.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.model}
              onValueChange={(value) => setFormData({ ...formData, model: value })}
              disabled={!formData.brand}
            >
              <SelectTrigger><SelectValue placeholder="Car Model" /></SelectTrigger>
              <SelectContent>
                {Object.keys(carModels).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.year}
              onValueChange={(value) => setFormData({ ...formData, year: value })}
              disabled={!formData.model}
            >
              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                {formData.model &&
                  carModels[formData.model]?.map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Date, Email, Phone */}
            <Input
              type="date"
              value={formData.pickupDate}
              onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Get Free A Quote"}
            </Button>
          </form>
        </Card>
      </div>

      {/* === WHAT IS SHIP SECTION === */}
      <section className="py-20 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row gap-10 items-center px-6">
          <img
            src={crosscarcountry}
            alt="Shipping containers"
            className="w-full md:w-1/3 rounded-xl shadow-lg object-cover"
          />
          <div className="md:w-1/2 space-y-5">
            <h2 className="text-3xl font-bold">What is Cross-Country Shipping?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cross-country car shipping is a convenient way to transport your vehicle from one region of the United States to another without the need to drive it yourself. This service is ideal for individuals relocating, purchasing a car from another state, or needing to move a vehicle over a long distance.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When you schedule a shipment, your car is picked up from a specified location and delivered as close as possible to your chosen destination. You can select pickup and drop-off points that best suit your needs, such as your residence, office, or another easily accessible area.
            </p>
            <p className="text-gray-700 leading-relaxed">
              It’s important to note that certain neighborhoods or city areas may restrict large transport trucks due to factors like narrow roads, low-hanging trees, or tight turns. In these situations, the driver may arrange to meet you at a nearby open or commercial area, such as a large parking lot, for safe loading or unloading.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cross-country car shipping helps you avoid the time, cost, and wear associated with long-distance driving while ensuring that your vehicle arrives safely and securely at its new location.
            </p>
          </div>
        </div>
      </section>

      {/* === IS IT WORTH IT SECTION === */}
      <section className="py-20 bg-gray-100 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-3">Is it worth it to ship to another state?</h2>
          <p className="text-gray-600 mb-10">
            There are many good reasons to ship a vehicle professionally rather than move it yourself or utilize terminal-to-terminal car shipping.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Convenient & Efficient",
                text: "Shipping a car yourself requires you to make travel plans and clear your personal and work schedule for the long road ahead.",
              },
              {
                title: "Cheaper Car Shipping",
                text: "You may pay less out the door for terminal-to-terminal vehicle shipping.",
              },
              {
                title: "Dedicated Customer Care",
                text: "Synergy X vets all trucking partners so you can confidently transport a car.",
              },
            ].map((item, i) => (
              <Card key={i} className="p-8 bg-white shadow-xl rounded-xl border border-gray-200">
                <div className="bg-orange-100 p-3 w-12 h-12 mx-auto rounded-full mb-4 flex items-center justify-center">
                  <MapPin className="text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section>
        <ReadyToShip />
      </section>
      <section>
        <Testimonials />
      </section>
      <section>
        <Footer />
      </section>
    </div>
    </div>
  );
};

export default ShipCarToAnotherState;
