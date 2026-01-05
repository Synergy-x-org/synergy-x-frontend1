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
import { Check } from "lucide-react";
import QuoteForm from '@/components/QuoteForm';
import ServicesWeOffer from '@/components/ServicesWeOffer';
import HaveQuestions from '@/components/HaveQuestions';

const heroImages = [movingCostHero];

const steps = [
  { number: 1, label: "Calculate shipping" },
  { number: 2, label: "Price" },
  { number: 3, label: "Confirmation" },
  { number: 4, label: "Finish" },
];


const MovingCostCalculator = () => {

   const [currentImage, setCurrentImage] = useState(0);
  const [currentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

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
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-8 pb-16 overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Auto transport ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 z-10 flex flex-col items-center">
        {/* Progress Stepper */}
        <div className="w-full max-w-2xl mb-8 px-4">
          <div className="flex items-center justify-between relative">
            {/* Progress Line Background */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/30 mx-8" />
            {/* Progress Line Active */}
            <div 
              className="absolute top-4 left-0 h-0.5 bg-primary mx-8 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step.number < currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.number === currentStep
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                      : "bg-white/20 text-white border-2 border-white/40"
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium whitespace-nowrap ${
                    step.number <= currentStep ? "text-white" : "text-white/60"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Form */}
        <div className="w-full max-w-md animate-fade-in">
          <QuoteForm />
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentImage ? "w-8 bg-primary" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
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
      </section>
      <section className="py-20 bg-secondary/10">
      <ServicesWeOffer />
      </section>
      <section className="py-20 bg-secondary/10">
      <HaveQuestions />
      </section>
      <section className="py-10 bg-secondary/5">
      <Footer />
      </section>
      

    </div>
  );
};

export default MovingCostCalculator;
