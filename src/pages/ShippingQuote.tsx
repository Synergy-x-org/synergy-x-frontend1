import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { ChevronDown, Menu, X } from "lucide-react";

const ShippingQuote = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ firstname: "John", lastname: "Doe" }); // Mock user data
  const [formData, setFormData] = useState({
    location: "",
    destination: "",
    year: "",
    carModel: "",
    maker: "",
    shipYear: "",
  });

  // Check if user is logged in (mock check)
  useEffect(() => {
    // TODO: Replace with real authentication check
    const isLoggedIn = true; // Mock
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace demo endpoint with real Java backend endpoint
      const response = await fetch("https://example.com/api/demo-calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      toast({
        title: "Quote Calculated!",
        description: "Your estimated quote will appear here.",
      });
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

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

            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter pickup location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    type="text"
                    placeholder="Enter destination"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    required
                  />
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carModel">Car Model</Label>
                  <Select
                    value={formData.carModel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, carModel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select car model (from backend)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="model1">Model 1</SelectItem>
                      <SelectItem value="model2">Model 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maker">Maker</Label>
                  <Select
                    value={formData.maker}
                    onValueChange={(value) =>
                      setFormData({ ...formData, maker: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select maker (from backend)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="make1">Make 1</SelectItem>
                      <SelectItem value="make2">Make 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipYear">Ship Date</Label>
                  <Select
                    value={formData.shipYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, shipYear: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ship date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="1-week">Within 1 week</SelectItem>
                      <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                    </SelectContent>
                  </Select>
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
