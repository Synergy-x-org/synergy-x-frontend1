// ✅ Updated File: src/pages/ProfileReservations.tsx - Using real user context
import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Reservation {
  id: string;
  vehicleModel: string;
  vehicleImage: string;
  location: string;
  destination: string;
  date: string;
  amount: string;
  status: "Active" | "Pending" | "Cancelled";
}

const ProfileReservations = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // TODO: Fetch user's reservations from backend
  // Endpoint: GET ${BASE_URL}/api/v1/users/reservations?search={searchQuery}&date={dateFilter}&status={statusFilter}
  // Headers: { 'Authorization': `Bearer ${token}` }
  // Expected response: { reservations: [...], totalPages: 10, currentPage: 1 }
  
  const mockReservations: Reservation[] = [
    {
      id: "1",
      vehicleModel: "BMW Road Cars",
      vehicleImage: "/placeholder.svg",
      location: "Montana, USA",
      destination: "Washington, USA",
      date: "15/08/2017",
      amount: "$1,451.76",
      status: "Active",
    },
    {
      id: "2",
      vehicleModel: "Volkswagen",
      vehicleImage: "/placeholder.svg",
      location: "Minnesota, USA",
      destination: "Michigan, USA",
      date: "18/09/2016",
      amount: "$1,505.33",
      status: "Pending",
    },
    {
      id: "3",
      vehicleModel: "Volkswagen",
      vehicleImage: "/placeholder.svg",
      location: "Minnesota, USA",
      destination: "Michigan, USA",
      date: "18/09/2016",
      amount: "$1,505.33",
      status: "Cancelled",
    },
    {
      id: "4",
      vehicleModel: "Volkswagen",
      vehicleImage: "/placeholder.svg",
      location: "Minnesota, USA",
      destination: "Michigan, USA",
      date: "18/09/2016",
      amount: "$1,505.33",
      status: "Cancelled",
    },
    {
      id: "5",
      vehicleModel: "BMW Road Cars",
      vehicleImage: "/placeholder.svg",
      location: "Montana, USA",
      destination: "Washington, USA",
      date: "15/08/2017",
      amount: "$1,451.76",
      status: "Active",
    },
    {
      id: "6",
      vehicleModel: "Volkswagen",
      vehicleImage: "/placeholder.svg",
      location: "Minnesota, USA",
      destination: "Michigan, USA",
      date: "18/09/2016",
      amount: "$1,505.33",
      status: "Pending",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500 hover:bg-green-600";
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Cancelled":
        return "bg-destructive hover:bg-destructive/90";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Details</CardTitle>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Reservation ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-primary text-white hover:bg-primary/90">
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter By
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              Date
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              Status
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-6 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
          <div>Vehicle Model</div>
          <div>Location</div>
          <div>Destination</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {/* Reservation Items */}
        <div className="space-y-4 mt-4">
          {mockReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs font-medium">🚗</span>
                </div>
                <span className="text-sm font-medium">{reservation.vehicleModel}</span>
              </div>
              <div className="text-sm text-muted-foreground">{reservation.location}</div>
              <div className="text-sm text-muted-foreground">{reservation.destination}</div>
              <div className="text-sm text-muted-foreground">{reservation.date}</div>
              <div className="text-sm font-medium">{reservation.amount}</div>
              <div>
                <Badge className={`${getStatusColor(reservation.status)} text-white border-0`}>
                  {reservation.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-border">
          <Button variant="outline" size="sm">Previous</Button>
          <span className="text-sm text-muted-foreground">Page 1 of 10</span>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileReservations;
