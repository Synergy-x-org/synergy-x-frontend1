import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

type DashboardData = {
  totalReservations?: number;
  pendingReservations?: number;
  totalShipped?: number;
  reservations?: Array<{
    vehicleModel?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    date?: string;
    amount?: number;
    status?: string;
  }>;
};

const DASHBOARD_URL =
  "https://synergy-x-transportation-backend.onrender.com/api/v1/user-profile/dashboard";

const ProfileOverview = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);

  // Always keep a safe default so UI never breaks
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalReservations: 0,
    pendingReservations: 0,
    totalShipped: 0,
    reservations: [],
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        // no token => show defaults, no crash
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(DASHBOARD_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await res.text();
        let json: any = null;

        try {
          json = JSON.parse(text);
        } catch {
          json = null;
        }

        if (!res.ok) {
          // Don’t kill UI — show defaults + error message
          throw new Error(json?.message || text || "Failed to load dashboard");
        }

        // ✅ accept multiple possible shapes
        const maybeData =
          json?.data?.data ||
          json?.data ||
          json?.dashboard ||
          json?.data?.dashboard ||
          null;

        if (!maybeData || typeof maybeData !== "object") {
          // No crash. Keep defaults, show soft error (optional).
          setDashboard({
            totalReservations: 0,
            pendingReservations: 0,
            totalShipped: 0,
            reservations: [],
          });
          setError(null); // keep UI clean
          return;
        }

        setDashboard({
          totalReservations: maybeData.totalReservations ?? 0,
          pendingReservations: maybeData.pendingReservations ?? 0,
          totalShipped: maybeData.totalShipped ?? 0,
          reservations: Array.isArray(maybeData.reservations)
            ? maybeData.reservations
            : [],
        });
      } catch (e: any) {
        console.error("Dashboard error:", e);
        // Keep UI working with defaults
        setDashboard({
          totalReservations: 0,
          pendingReservations: 0,
          totalShipped: 0,
          reservations: [],
        });
        setError(e.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // You asked not to change UI; this is a small inline error that doesn’t break layout
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome {user?.firstName}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome {user?.firstName}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Reservations</p>
          <p className="text-3xl font-bold mt-2">
            {dashboard.totalReservations ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Pending Reservation
          </p>
          <p className="text-3xl font-bold mt-2">
            {dashboard.pendingReservations ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Shipped</p>
          <p className="text-3xl font-bold mt-2">
            {dashboard.totalShipped ?? 0}
          </p>
        </div>
      </div>

      {/* Reservation Details */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-foreground">
            Reservation Details
          </h3>
        <Link to="/profile/reservations" className="text-sm text-primary cursor-pointer">
          See All
        </Link>

        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-3 text-sm text-muted-foreground border-b">
          <div>Vehicle Model</div>
          <div>Location</div>
          <div>Destination</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {!dashboard.reservations?.length ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No reservations yet
          </div>
        ) : (
          dashboard.reservations.map((r, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b text-sm"
            >
              <div className="truncate">{r.vehicleModel || "-"}</div>
              <div className="truncate">{r.pickupLocation || "-"}</div>
              <div className="truncate">{r.dropoffLocation || "-"}</div>
              <div className="truncate">{r.date || "-"}</div>
              <div className="truncate">{r.amount ?? "-"}</div>
              <div className="truncate">{r.status || "-"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;
