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

import movingCostHero from "@/assets/movingcost.png"; // Import the image from assets

const MovingCostCalculator = () => {
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
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <Input id="location" type="text" placeholder="Enter pickup location" />
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                      <Input id="destination" type="text" placeholder="Enter delivery destination" />
                    </div>
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
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
                      <label htmlFor="car-model" className="block text-sm font-medium text-gray-700">Car Model</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Car Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="model1">Model 1 (from backend)</SelectItem>
                          <SelectItem value="model2">Model 2 (from backend)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="maker" className="block text-sm font-medium text-gray-700">Maker</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Maker" />
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
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">What our customers are saying</h2>
          {/* Placeholder for testimonials - will use existing Testimonials component if available */}
          <p className="text-muted-foreground">Testimonials section placeholder.</p>
        </div>
      </section>
    </div>
  );
};

export default MovingCostCalculator;
