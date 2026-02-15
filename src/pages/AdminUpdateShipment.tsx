// ✅ AdminUpdateShipment.tsx (REAL API INTEGRATION)
// Uses PATCH /tracking/admin/update-progress with Bearer token (ADMIN / SUPER_ADMIN)

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Hash, Activity, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const STATUSES = ["IN_PROGRESS", "PICKED_UP", "IN_TRANSIT", "DELIVERED"] as const;
type ShipmentStatus = (typeof STATUSES)[number];

type ApiSuccess = {
  success: true;
  message: string;
  data: {
    quoteReference: string;
    pickupAddress: string;
    deliveryAddress: string;
    pickupDate: string;
    shipmentStatus: string;
    deliveryStatus: string;
    transitProgress: string;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
};

type ApiError = {
  success: false;
  error?: string;
  message: string;
  timestamp?: string;
};

type ApiResponse = ApiSuccess | ApiError;

const AdminUpdateShipment: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth() as any;

  const [quoteReference, setQuoteReference] = useState("");
  const [shipmentStatus, setShipmentStatus] = useState<ShipmentStatus>("IN_PROGRESS");
  const [progress, setProgress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return quoteReference.trim().length >= 6 && progress.trim().length >= 3 && !!shipmentStatus;
  }, [quoteReference, progress, shipmentStatus]);

  const handleSubmit = async () => {
    const ref = quoteReference.trim();
    const prog = progress.trim();

    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Admin token missing. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    if (!canSubmit) {
      toast({
        title: "Please complete the form",
        description: "Quote reference, status and progress are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        "https://synergy-x-transportation-backend.onrender.com/api/v1/admin/update-progress",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            quoteReference: ref,
            progress: prog,
            shipmentStatus: shipmentStatus,
          }),
        }
      );

      const json: ApiResponse | any = await res.json().catch(() => null);

      // If backend sends { success:false, message: ... } we show that.
      if (!res.ok || !json) {
        const msg =
          json?.message ||
          json?.error ||
          `Request failed (${res.status})`;
        toast({
          title: "Update failed",
          description: msg,
          variant: "destructive",
        });
        return;
      }

      if (json.success) {
        toast({
          title: "Success",
          description: json.message || "Transit progress updated successfully",
        });

        // Navigate to result page with backend response
        navigate("/admin/update-shipment-result", { state: { result: json } });
      } else {
        toast({
          title: "Update failed",
          description: json.message || "Unable to update shipment.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      toast({
        title: "Network error",
        description: "Unable to reach server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 bg-gray-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Update Shipment</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update shipment status + transit progress (ADMIN / SUPER_ADMIN).
              If status becomes <span className="font-medium">DELIVERED</span>, delivery status auto-completes.
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quote Reference
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={quoteReference}
                      onChange={(e) => setQuoteReference(e.target.value)}
                      placeholder="e.g cdd4c0b1"
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Shipment Status
                  </label>
                  <Select
                    value={shipmentStatus}
                    onValueChange={(v) => setShipmentStatus(v as ShipmentStatus)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Transit Progress
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                    <Textarea
                      value={progress}
                      onChange={(e) => setProgress(e.target.value)}
                      placeholder="e.g Vehicle is now in transit"
                      className="pl-10 min-h-[110px] resize-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    This message appears to customers on the tracking page.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className="h-11 bg-[#FF6B35] hover:bg-[#e55a2a] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Update Shipment <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUpdateShipment;
