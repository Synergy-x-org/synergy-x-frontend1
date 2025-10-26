// ✅ New File: src/pages/ProfileReturnRequest.tsx - Return request page
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const ProfileReturnRequest = () => {
  // TODO: Fetch return requests from backend
  // Endpoint: GET /api/user/return-requests
  // Expected response: { returnRequests: [{ id, orderId, reason, status, date }] }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Return Request</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Return Requests</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            You haven't submitted any return requests yet. If you need to return a shipment, 
            please contact our support team.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileReturnRequest;
