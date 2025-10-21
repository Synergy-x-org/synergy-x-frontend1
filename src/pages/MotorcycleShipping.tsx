import React from 'react';
import { Link } from 'react-router-dom';
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
import { CheckCircle, DollarSign, ShieldCheck } from 'lucide-react';

// Placeholder images
import motorcycleHero from "@/assets/hero3.jpg"; // Using existing hero image as placeholder
import motorcycleContent from "@/assets/hero1.jpg"; // Using existing hero image as placeholder
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import ReadyToShip from '@/components/ReadyToShip'; // Import ReadyToShip component

const MotorcycleShipping = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Calculator Form */}
      <section 
        className="relative bg-cover bg-center py-32 text-white"
        style={{ backgroundImage: `url(${motorcycleHero})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Motorcycle Shipping</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Get your motorcycle delivered safely, anytime, anywhere. Fast, secure, and affordable transport for individuals and businesses.
          </p>
          <div className="max-w-md mx-auto mt-8">
            <Card className="shadow-lg bg-white text-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Calculate your shipping cost</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <Input id="location" type="text" placeholder="Enter pickup location" />
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                      <Input id="destination" type="text" placeholder="Enter delivery destination" />
                    </div>
                    <div>
                      <label htmlFor="motorcycle-year" className="block text-sm font-medium text-gray-700">Year</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="motorcycle-model" className="block text-sm font-medium text-gray-700">Motorcycle Model</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="model1">Model 1 (from backend)</SelectItem>
                          <SelectItem value="model2">Model 2 (from backend)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="motorcycle-make" className="block text-sm font-medium text-gray-700">Make</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="make1">Make 1 (from backend)</SelectItem>
                          <SelectItem value="make2">Make 2 (from backend)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="ship-date" className="block text-sm font-medium text-gray-700">Ship Date</label>
                      <Input id="ship-date" type="date" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Calculate Quote</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What is motorcycle shipping? */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <img 
                src={motorcycleContent} 
                alt="Motorcycle Shipping" 
                className="rounded-lg shadow-lg w-full h-auto" 
              />
            </div>
            <div className="md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What is motorcycle shipping?</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Motorcycle shipping involve transporting two-wheeler from one location to another. Various methods can be used, such as safely hauling, towing, or carrying the motorbike in a truck or trailer. Professional bike freight services are available for those who prefer professional handling and care during transportation.
              </p>
              <p className="text-lg text-muted-foreground">
                Over 80% of two-wheeler owners in the United States use motorcycle hauling services at least once in their lifetime. As a reliable leader in the auto moving industry, we can cater to almost any motorbike shipping request, whether you need your Dirt bike delivered where the state, country, or internationally.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                All motorcycle shipping quotes include real-time satellite tracking nationwide and insurance coverage while your vehicle is in our care. We are a licensed, bonded, and insured full-service auto transporter, offering you the utmost peace of mind at the most reasonable price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Is it worth it to ship a motorcycle? */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Is it worth it to ship a motorcycle?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-md">
              <CheckCircle className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-xl font-bold mb-3">Convenient & Efficient</CardTitle>
              <CardContent className="text-muted-foreground">
                Shipping a motorcycle yourself requires you to make travel plans and clear your personal and work schedule for the long road ahead.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md">
              <DollarSign className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-xl font-bold mb-3">Cheaper Motorcycle Shipping</CardTitle>
              <CardContent className="text-muted-foreground">
                You may pay less out the door for terminal-to-terminal motorcycle shipping.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md">
              <ShieldCheck className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-xl font-bold mb-3">Dedicated Customer Care</CardTitle>
              <CardContent className="text-muted-foreground">
                Synergy X vets all trucking partners so you can confidently transport a motorcycle.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ready To Ship Your Motorcycle? */}
      <ReadyToShip />

      {/* What our customers are saying (Testimonials) */}
      <section className="py-20 bg-background">
        <Testimonials />
        <Footer />
      </section>
    </div>
  );
};

export default MotorcycleShipping;
