import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign, ShieldCheck } from 'lucide-react';
import { carBrandsAPI } from '@/services/api'; // Import carBrandsAPI

// Placeholder images
import doorToDoorHero from "@/assets/hero1.jpg"; // Using existing hero image as placeholder
import doorToDoorContent from "@/assets/hero2.jpg"; // Using existing hero image as placeholder
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import ReadyToShip from '@/components/ReadyToShip'; // Import ReadyToShip component

const DoorToDoorShipping = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<Record<string, number[]>>({});
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Fetch car brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await carBrandsAPI.getAllCarBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Failed to fetch car brands:", error);
        // Optionally show a toast error
      }
    };
    fetchBrands();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (selectedBrand) {
      const fetchModels = async () => {
        try {
          const fetchedModels = await carBrandsAPI.getModelsByBrand(selectedBrand);
          setModels(fetchedModels);
          setSelectedModel(''); // Reset model when brand changes
          setAvailableYears([]); // Reset years
        } catch (error) {
          console.error(`Failed to fetch models for brand ${selectedBrand}:`, error);
          // Optionally show a toast error
        }
      };
      fetchModels();
    }
  }, [selectedBrand]);

  // Update available years when model changes
  useEffect(() => {
    if (selectedModel && models[selectedModel]) {
      setAvailableYears(models[selectedModel]);
    } else {
      setAvailableYears([]);
    }
  }, [selectedModel, models]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-32 text-white"
        style={{ backgroundImage: `url(${doorToDoorHero})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Door-to-Door Shipping</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              Get your car delivered safely, anytime, anywhere. Fast, secure, and affordable auto transport for individuals and businesses.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Get a free shipping quote now!</Button>
            </Link>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Calculate your shipping cost</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <Input id="location" type="text" placeholder="Enter pickup location" />
                  </div>
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                    <Input id="destination" type="text" placeholder="Enter delivery destination" />
                  </div>
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                    <select
                      id="brand"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="car-model" className="block text-sm font-medium text-gray-700">Car Model</label>
                    <select
                      id="car-model"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={!selectedBrand}
                    >
                      <option value="">Select Car Model</option>
                      {Object.keys(models).map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                    <select
                      id="year"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      disabled={!selectedModel}
                    >
                      <option value="">Select Year</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ship-date" className="block text-sm font-medium text-gray-700">Ship Date</label>
                    <Input id="ship-date" type="date" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <Input id="phone-number" type="tel" placeholder="Enter your phone number" />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Calculate Quote</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What is Door-to-Door Car Shipping? */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <img 
                src={doorToDoorContent} 
                alt="Door-to-Door Car Shipping" 
                className="rounded-lg shadow-lg w-full h-auto" 
              />
            </div>
            <div className="md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What is Door-to-Door Car Shipping?</h2>
              <p className="text-lg text-muted-foreground mb-4">
                A door-to-door vehicle transport provider ships cars from one desired location to another, getting as close to each point as possible. When you choose door-to-door auto transport, you control your pickup and drop-off spots.
              </p>
              <p className="text-lg text-muted-foreground">
                If you want to ship your vehicle to or from a residential address, the driver will get as close to your home as possible with concern for safety and legal regulations. You don't have to worry about driving to a terminal, spending gas, and potentially hours in traffic.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                Some cities and towns prohibit large trucks from driving into certain residential neighborhoods. If access to your location is restricted by low-hanging trees, narrow streets, tight turns, or speed bumps, the driver might ask you to meet in a nearby large parking lot instead for loading and unloading your vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Is it worth to ship a car? */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Is it worth to ship a car?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-md">
              <CheckCircle className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-xl font-bold mb-3">Convenient & Efficient</CardTitle>
              <CardContent className="text-muted-foreground">
                Shipping a car yourself requires you to make travel plans and clear your personal and work schedule for the long road ahead.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md">
              <DollarSign className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-xl font-bold mb-3">Cheaper Car Shipping</CardTitle>
              <CardContent className="text-muted-foreground">
                You may pay less out the door for terminal-to-terminal vehicle shipping.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md">
              <ShieldCheck className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-xl font-bold mb-3">Dedicated Customer Care</CardTitle>
              <CardContent className="text-muted-foreground">
                Synergy X vets all trucking partners so you can confidently transport a car.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ready To Ship Your Vehicle? */}
      <ReadyToShip />

      {/* What our customers are saying (Testimonials) */}
      <section className="py-20 bg-background">
        <Testimonials />
        <Footer />
      </section>
    </div>
  );
};

export default DoorToDoorShipping;
