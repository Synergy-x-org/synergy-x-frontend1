import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    year: "",
    make: "",
    model: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request:", formData);
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

        <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Car Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model1">Model 1</SelectItem>
            <SelectItem value="model2">Model 2</SelectItem>
          </SelectContent>
        </Select>

        <Select value={formData.make} onValueChange={(value) => setFormData({ ...formData, make: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Maker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="make1">Make 1</SelectItem>
            <SelectItem value="make2">Make 2</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="mm/dd/yyyy"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
          Calculate Quote
        </Button>
      </form>
    </Card>
  );
};

export default QuoteForm;
