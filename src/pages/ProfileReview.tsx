// ✅ New File: src/pages/ProfileReview.tsx - Review and analytics page
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const ProfileReview = () => {
  // TODO: Fetch review/analytics data from backend
  // Endpoint: GET /api/user/analytics
  // Expected response: { chartData: [...], metrics: {...} }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Details</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Chart Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Activity</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">100%</span>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  84,595.73
                </span>
              </div>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="h-80 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-6 relative overflow-hidden">
            {/* TODO: Integrate chart library (e.g., recharts, chart.js) */}
            {/* Data endpoint: GET /api/user/analytics/chart */}
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Analytics chart will display here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Showing reservation trends and performance metrics
                </p>
              </div>
            </div>
            
            {/* Mock Chart Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path
                  d="M 0,25 Q 10,15 20,20 T 40,25 T 60,15 T 80,20 T 100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                />
                <path
                  d="M 0,25 Q 10,15 20,20 T 40,25 T 60,15 T 80,20 T 100,10 L 100,50 L 0,50 Z"
                  fill="currentColor"
                  className="text-primary"
                />
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>5k</span>
            <span>10k</span>
            <span>15k</span>
            <span>20k</span>
            <span>25k</span>
            <span>30k</span>
            <span>35k</span>
            <span>40k</span>
            <span>45k</span>
            <span>50k</span>
            <span>55k</span>
            <span>60k</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileReview;
