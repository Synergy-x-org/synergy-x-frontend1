import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { carBrandsAPI, quotesAPI } from '@/services/api'; // Import carBrandsAPI and quotesAPI
import { toast } from "@/hooks/use-toast"; // Import toast

import movingCostHero from "@/assets/movingcost.png";
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const MovingCostCalculator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carModels, setCarModels] = useState<Record<string, number[]>>({});
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

  // Fetch car brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await carBrandsAPI.getAllCarBrands();
        setCarBrands(fetchedBrands);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch car brands",
          variant: "destructive",
        });
      }
    };
    fetchBrands();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (formData.brand) {
      const fetchModels = async () => {
        try {
          const fetchedModels = await carBrandsAPI.getModelsByBrand(formData.brand);
          setCarModels(fetchedModels);
          setFormData((prev) => ({ ...prev, model: "", year: "" })); // Reset model and year when brand changes
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || `Failed to fetch models for brand ${formData.brand}`,
            variant: "destructive",
          });
        }
      };
      fetchModels();
    } else {
      setCarModels({});
      setFormData((prev) => ({ ...prev, model: "", year: "" }));
    }
  }, [formData.brand]);

  // Update available years when model changes
  useEffect(() => {
    if (formData.model && carModels[formData.model]) {
      setFormData((prev) => ({ ...prev, year: "" })); // Reset year when model changes
    }
  }, [formData.model, carModels]);

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
    <div className="min-h-screen">
      {/* Hero Section with Calculator Form */}
      <section 
        className="relative bg-cover bg-center py-32 text-white"
        style={{ backgroundImage: `url(${movingCostHero})` }} // User-provided image from assets
      >
        {/* Removed overlay div */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Calculate your car shipping cost</h1>
          <div className="max-w-md mx-auto mt-8">
            <Card className="shadow-lg bg-white text-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Calculate your car shipping cost</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Location</label>
                      <Input
                        id="pickupLocation"
                        type="text"
                        placeholder="Enter pickup location"
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700">Destination</label>
                      <Input
                        id="deliveryLocation"
                        type="text"
                        placeholder="Enter delivery destination"
                        value={formData.deliveryLocation}
                        onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Car Brand</label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) => setFormData({ ...formData, brand: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Car Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {carBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700">Car Model</label>
                      <Select
                        value={formData.model}
                        onValueChange={(value) => setFormData({ ...formData, model: value })}
                        disabled={!formData.brand}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Car Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(carModels).map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => setFormData({ ...formData, year: value })}
                        disabled={!formData.model}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.model && carModels[formData.model]?.map((year) => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">Pickup Date</label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
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
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? "Calculating..." : "Calculate Quote"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Much Does Car Shipping Cost? */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">How Much Does Car Shipping Cost?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-center">
            Car shipping costs in 2024, specifically for open car shipping, are estimated around $1.85/mile for short distances (1-500 miles) or $555 for a 300-mile trip. Medium distances average about $.91/mile (500-1500 miles) or $910 for 1000 miles. Long distances (1500+ miles) may vary and the rates for enclosed car shipping will be higher.
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto text-center">
            When it comes to shipping your vehicle, there are several factors that come into play when determining the cost. Everything from the type of vehicle you're shipping to the type of shipping method you choose will affect the price.
          </p>

          <h3 className="text-2xl font-bold text-center mb-6">Average Car Shipping Cost Per Mile</h3>
          <div className="overflow-x-auto mb-12">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Distance</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average open carrier cost</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average closed carrier cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">Less than 500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$630</td>
                  <td className="py-4 px-6 whitespace-nowrap">$930</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">Between 500-1500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$910</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1350</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">Between 1500-2500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1200</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1700</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">More than 2500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1500</td>
                  <td className="py-4 px-6 whitespace-nowrap">$2000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-bold text-center mb-6">Average Car Shipping by Carrier Type and Distance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Distance</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average open carrier cost</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average closed carrier cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">Less than 500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$630</td>
                  <td className="py-4 px-6 whitespace-nowrap">$930</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">Between 500-2500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$910</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1350</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">Less than 500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1200</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1700</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 whitespace-nowrap">Less than 500 miles</td>
                  <td className="py-4 px-6 whitespace-nowrap">$1500</td>
                  <td className="py-4 px-6 whitespace-nowrap">$2000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What our customers are saying (Testimonials) */}
      <section className="py-20 bg-secondary/10">
        <Testimonials />
        <Footer />
      </section>
    </div>
  );
};

export default MovingCostCalculator;
