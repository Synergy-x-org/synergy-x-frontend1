import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { ChevronDown, Menu, X } from "lucide-react";
import { carBrandsAPI, quotesAPI } from "@/services/api"; // Import APIs
import MapView from "@/components/MapView"; // Import MapView

const ShippingQuote = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ firstname: "John", lastname: "Doe" }); // Mock user data
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carModels, setCarModels] = useState<Record<string, number[]>>({});
  const [formData, setFormData] = useState({
    pickupLocation: "", // Renamed from 'location'
    deliveryLocation: "", // Renamed from 'destination'
    year: "",
    brand: "", // Renamed from 'maker'
    model: "", // Renamed from 'carModel'
    pickupDate: "", // Renamed from 'shipYear'
    email: "", // Added email
    phoneNumber: "", // Added phoneNumber
  });

  // Check if user is logged in (mock check)
  useEffect(() => {
    // TODO: Replace with real authentication check
    const isLoggedIn = true; // Mock
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

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

  const handleCalculate = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-secondary/30">
      {/* Navbar */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              {/* Replace logo image here: /src/assets/logo.png */}
              <img src={logo} alt="Synergy-X Logo" className="h-10" />
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary transition-colors">
                Moving cost calculator
              </a>
              <a href="/" className="text-foreground hover:text-primary transition-colors">
                Cost shipping calculator
              </a>
              <a href="/" className="text-foreground hover:text-primary transition-colors">
                Teams
              </a>
              <a href="/" className="text-foreground hover:text-primary transition-colors">
                Help
              </a>
            </div>

            {/* User Menu - Right */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                >
                  {/* Display user name here, e.g., `${user.firstname} ${user.lastname}` */}
                  <span className="font-medium">{user.firstname} {user.lastname}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
                    <a
                      href="/shipping-quote"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary"
                      onClick={() => {
                        // TODO: Add logout logic
                        navigate("/login");
                      }}
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                <div className="px-4 py-2 font-medium text-foreground border-b border-border">
                  {user.firstname} {user.lastname}
                </div>
                <a href="/" className="px-4 py-2 text-foreground hover:bg-secondary">
                  Moving cost calculator
                </a>
                <a href="/" className="px-4 py-2 text-foreground hover:bg-secondary">
                  Cost shipping calculator
                </a>
                <a href="/" className="px-4 py-2 text-foreground hover:bg-secondary">
                  Teams
                </a>
                <a href="/" className="px-4 py-2 text-foreground hover:bg-secondary">
                  Help
                </a>
                <a
                  href="/"
                  className="px-4 py-2 text-foreground hover:bg-secondary"
                  onClick={() => navigate("/login")}
                >
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                1
              </div>
              <span className="text-xs md:text-sm mt-2 text-foreground">Calculate shipping</span>
            </div>
            <div className="w-12 md:w-24 h-0.5 bg-border"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center font-bold text-muted-foreground">
                2
              </div>
              <span className="text-xs md:text-sm mt-2 text-muted-foreground">Price</span>
            </div>
            <div className="w-12 md:w-24 h-0.5 bg-border"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center font-bold text-muted-foreground">
                3
              </div>
              <span className="text-xs md:text-sm mt-2 text-muted-foreground">Confirmation</span>
            </div>
            <div className="w-12 md:w-24 h-0.5 bg-border"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center font-bold text-muted-foreground">
                4
              </div>
              <span className="text-xs md:text-sm mt-2 text-muted-foreground">Finish</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-background rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center text-foreground mb-8">
              Calculate your car shipping cost
            </h1>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <form onSubmit={handleCalculate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Car Brand</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) =>
                          setFormData({ ...formData, brand: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select car brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {carBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Car Model</Label>
                      <Select
                        value={formData.model}
                        onValueChange={(value) =>
                          setFormData({ ...formData, model: value })
                        }
                        disabled={!formData.brand}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select car model" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(carModels).map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) =>
                          setFormData({ ...formData, year: value })
                        }
                        disabled={!formData.model}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.model && carModels[formData.model]?.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        placeholder="mm/dd/yyyy"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Calculating..." : "Calculate Quote"}
                  </Button>
                </form>
              </div>
              <div className="md:w-1/2">
                <MapView
                  onOriginChange={(origin) => setFormData((prev) => ({ ...prev, pickupLocation: origin }))}
                  onDestinationChange={(destination) => setFormData((prev) => ({ ...prev, deliveryLocation: destination }))}
                  onDistanceChange={(distance) => console.log("Distance:", distance)} // You can use this to update a state if needed
                />
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              We respect your privacy and do not distribute your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingQuote;
