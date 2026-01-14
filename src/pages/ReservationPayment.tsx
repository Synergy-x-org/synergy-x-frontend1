// ✅ Updated File: src/pages/ProfilePayments.tsx - Using real user context
import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ReservationPayment = () => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState("visa");
  const [cardData, setCardData] = useState({
    holderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    zipCode: "",
  });

  // TODO: Fetch saved payment methods from backend
  // Endpoint: GET ${BASE_URL}/api/v1/users/payment-methods
  // Headers: { 'Authorization': `Bearer ${token}` }
  // Expected response: { paymentMethods: [{ id, type, last4, isDefault }] }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Submit payment method to backend
    // Endpoint: POST ${BASE_URL}/api/v1/users/payment-methods
    // Headers: { 'Authorization': `Bearer ${token}` }
    // Body: { holderName, cardNumber, expiryDate, cvc, zipCode, type: selectedMethod, userId: user?.id }
    // Expected response: { success: boolean, message: string }
    
    toast({
      title: "Payment Method Saved",
      description: "Your payment information has been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Payment Method Selection */}
        <div className="flex gap-4 mb-8">
          {/* Visa Card */}
          <button
            onClick={() => setSelectedMethod("visa")}
            className={`flex-1 p-4 border-2 rounded-lg transition-all ${
              selectedMethod === "visa"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full border-2 border-primary">
                  {selectedMethod === "visa" && (
                    <div className="w-full h-full rounded-full bg-primary scale-75" />
                  )}
                </div>
                <span className="font-medium text-sm">•••• 8304</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">VISA</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Visa</span>
              <button className="text-primary hover:underline">Edit</button>
            </div>
          </button>

          {/* PayPal */}
          <button
            onClick={() => setSelectedMethod("paypal")}
            className={`flex-1 p-4 border-2 rounded-lg transition-all ${
              selectedMethod === "paypal"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full border-2 border-primary">
                  {selectedMethod === "paypal" && (
                    <div className="w-full h-full rounded-full bg-primary scale-75" />
                  )}
                </div>
                <span className="font-medium text-sm">•••• 8304</span>
              </div>
              <span className="text-xl font-bold text-blue-700">PayPal</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Paypal</span>
              <button className="text-primary hover:underline">Edit</button>
            </div>
          </button>

          {/* Add New */}
          <button className="flex-1 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-all">
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Plus className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-primary">New</span>
            </div>
          </button>
        </div>

        {/* Card Details Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="holderName">Card holder name</Label>
            <Input
              id="holderName"
              placeholder="Ex. Cameron Williamson"
              value={cardData.holderName}
              onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card number</Label>
            <Input
              id="cardNumber"
              placeholder="••• ••• ••• •••"
              value={cardData.cardNumber}
              onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry date</Label>
              <Input
                id="expiryDate"
                placeholder="11/09/25"
                value={cardData.expiryDate}
                onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="323"
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip code</Label>
            <Input
              id="zipCode"
              placeholder="Ex. 78958"
              value={cardData.zipCode}
              onChange={(e) => setCardData({ ...cardData, zipCode: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Confirm
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReservationPayment;
