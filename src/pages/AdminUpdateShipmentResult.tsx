// ✅ AdminUpdateShipmentResult.tsx
// Displays the backend response returned from the PATCH call.

import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowLeft, Hash } from "lucide-react";

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

const AdminUpdateShipmentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result: ApiResponse | undefined = (location.state as any)?.result;

  const isSuccess = !!result && result.success === true;

  const fmtTs = useMemo(() => {
    const ts = (result as any)?.timestamp;
    if (!ts) return "—";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return String(ts);
    return d.toLocaleString();
  }, [result]);

  const data = (result as ApiSuccess)?.data;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 bg-gray-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Update Shipment Result
            </h1>
            <Button variant="outline" onClick={() => navigate("/admin/update-shipment")}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Status */}
              <div className="flex items-start gap-3 mb-6">
                {isSuccess ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                )}

                <div>
                  <p className={`text-base font-semibold ${isSuccess ? "text-gray-900" : "text-red-700"}`}>
                    {result?.message || (isSuccess ? "Updated successfully" : "Update failed")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Timestamp: {fmtTs}</p>
                  {!isSuccess && (result as ApiError)?.error && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {(result as ApiError).error}
                    </p>
                  )}
                </div>
              </div>

              {/* Data */}
              {!isSuccess || !data ? (
                <div className="rounded-lg border bg-white p-4 text-sm text-gray-700">
                  No shipment data returned.
                </div>
              ) : (
                <>
                  {/* Addresses */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Delivery Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#E8F5E9] rounded-lg p-4">
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Pickup Address
                        </p>
                        <p className="text-sm text-gray-900">{data.pickupAddress || "—"}</p>
                      </div>
                      <div className="bg-[#E3F2FD] rounded-lg p-4">
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Delivery Address
                        </p>
                        <p className="text-sm text-gray-900">{data.deliveryAddress || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Quote Reference
                      </p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        {data.quoteReference || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Pickup Date
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.pickupDate || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Shipment Status
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.shipmentStatus || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Delivery Status
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.deliveryStatus || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Transit Progress
                    </p>
                    <div className="rounded-lg border border-gray-200 p-4 bg-white">
                      <p className="text-sm text-gray-900">
                        {data.transitProgress || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Created At
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.createdAt || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Updated At
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.updatedAt || "—"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUpdateShipmentResult;
