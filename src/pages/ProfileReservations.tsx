// ✅ Updated File: src/pages/ProfileReservations.tsx
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reservationsAPI, type MyReservation } from "@/services/reservationsAPI"; // ✅ adjust path if yours differs

type UiReservationStatus = "Active" | "Pending" | "Cancelled";

type UiReservation = {
  id: string;
  vehicleModel: string;
  location: string;
  destination: string;
  date: string;
  amount: string;
  status: UiReservationStatus;
};

const mapStatus = (status?: string): UiReservationStatus => {
  const s = (status || "").toUpperCase();
  if (s === "ACTIVE") return "Active";
  if (s === "PENDING") return "Pending";
  if (s === "CANCELLED" || s === "CANCELED") return "Cancelled";
  // fallback (don’t break UI)
  return "Pending";
};

const formatMoney = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const pickDate = (r: MyReservation) =>
  r.reservationDate || r.pickupDate || r.deliveryDate || "—";

const ProfileReservations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<UiReservation[]>([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await reservationsAPI.getMyReservations();

        const mapped: UiReservation[] = data.map((r) => ({
          id: r.reservationId,
          vehicleModel: r.vehicle || "—",
          location: r.pickupAddress || "—",
          destination: r.deliveryAddress || "—",
          date: pickDate(r),
          amount: formatMoney(r.price),
          status: mapStatus(r.status),
        }));

        if (mounted) setReservations(mapped);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load reservations");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredReservations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return reservations.filter((r) => {
      const matchesQuery = !q || r.id.toLowerCase().includes(q);

      const matchesStatus =
        !statusFilter || r.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate = !dateFilter || r.date.includes(dateFilter);

      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [reservations, searchQuery, statusFilter, dateFilter]);

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

          <Button
            variant="outline"
            className="gap-2 bg-primary text-white hover:bg-primary/90"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter By
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setDateFilter("")}
              title="(Placeholder) Date filter UI can be wired later"
            >
              Date
              <ChevronDown className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setStatusFilter("")}
              title="(Placeholder) Status filter UI can be wired later"
            >
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

        {/* States */}
        {loading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading reservations...
          </div>
        )}

        {!loading && error && (
          <div className="py-10 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && filteredReservations.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No reservations found.
          </div>
        )}

        {/* Reservation Items */}
        {!loading && !error && filteredReservations.length > 0 && (
          <div className="space-y-4 mt-4">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-xs font-medium">🚗</span>
                  </div>
                  <span className="text-sm font-medium">
                    {reservation.vehicleModel}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground">
                  {reservation.location}
                </div>
                <div className="text-sm text-muted-foreground">
                  {reservation.destination}
                </div>
                <div className="text-sm text-muted-foreground">
                  {reservation.date}
                </div>
                <div className="text-sm font-medium">{reservation.amount}</div>

                <div>
                  <Badge
                    className={`${getStatusColor(
                      reservation.status
                    )} text-white border-0`}
                  >
                    {reservation.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination (UI kept, can be wired later) */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-border">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page 1 of 1</span>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileReservations;
