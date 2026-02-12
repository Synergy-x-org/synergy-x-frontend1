import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { reservationsAPI } from "@/services/reservationsAPI";

type DashboardStats = {
  totalReservations: number;
  successfulReservations: number;
  pendingReservations: number;
  failedReservations: number;
};

type OverviewRow = {
  vehicleModel: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  amount: string;
  status: string;
};

const DASHBOARD_URL =
  "https://synergy-x-transportation-backend.onrender.com/api/v1/user-profile/dashboard";

const formatMoney = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const pickDate = (r: any) =>
  r?.reservationDate || r?.pickupDate || r?.deliveryDate || r?.createdAt || "-";

const extractDashboardStats = (json: any): DashboardStats => {
  const maybe =
    json?.data?.data ||
    json?.data ||
    json?.dashboard ||
    json?.data?.dashboard ||
    json ||
    null;

  // 1) New shape: { stats: [{category,totalCount}] }
  if (maybe?.stats && Array.isArray(maybe.stats)) {
    const getCount = (name: string) => {
      const found = maybe.stats.find(
        (s: any) => String(s?.category || "").toLowerCase() === name.toLowerCase()
      );
      const n = found?.totalCount;
      return typeof n === "number" ? n : 0;
    };

    return {
      totalReservations: getCount("Total Reservations"),
      pendingReservations: getCount("Pending Reservations"),
      successfulReservations: getCount("Successful Reservations"),
      failedReservations: getCount("Failed Reservations"),
    };
  }

  // 2) Old/flat shape: { totalReservations, pendingReservations, ... }
  return {
    totalReservations: Number(maybe?.totalReservations ?? 0) || 0,
    pendingReservations: Number(maybe?.pendingReservations ?? 0) || 0,
    successfulReservations: Number(maybe?.successfulReservations ?? 0) || 0,
    failedReservations: Number(maybe?.failedReservations ?? 0) || 0,
  };
};

const ProfileOverview = () => {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ stats from dashboard endpoint
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    successfulReservations: 0,
    pendingReservations: 0,
    failedReservations: 0,
  });

  // ✅ rows from reservations list endpoint
  const [rows, setRows] = useState<OverviewRow[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setLoading(false);
        setError(null);
        setStats({
          totalReservations: 0,
          successfulReservations: 0,
          pendingReservations: 0,
          failedReservations: 0,
        });
        setRows([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1) DASHBOARD STATS
        const dashRes = await fetch(DASHBOARD_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dashText = await dashRes.text();
        let dashJson: any = null;
        try {
          dashJson = JSON.parse(dashText);
        } catch {
          dashJson = null;
        }

        if (!dashRes.ok) {
          throw new Error(dashJson?.message || dashText || "Failed to load dashboard");
        }

        // ✅ IMPORTANT: parse stats[] correctly
        setStats(extractDashboardStats(dashJson));

        // 2) RESERVATION LIST FOR TABLE
        const list = await reservationsAPI.getUserProfileReservations(token);

        const mapped = (Array.isArray(list) ? list : []).map((r: any) => ({
          vehicleModel: r.vehicle || "-",
          pickupLocation: r.pickupAddress || "-",
          dropoffLocation: r.deliveryAddress || "-",
          date: pickDate(r),
          amount: formatMoney(r.price ?? r.amount),
          status: r.status || "-",
        }));

        setRows(mapped.slice(0, 5));
      } catch (e: any) {
        console.error("ProfileOverview error:", e);
        setError(e?.message || "Failed to load overview");
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
      <h2 className="text-2xl font-semibold text-foreground">
        Welcome {user?.firstName}
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Reservations" value={stats.totalReservations} />
        <StatCard title="Total Pending Reservation" value={stats.pendingReservations} />
        <StatCard title="Total Successful (Shipped)" value={stats.successfulReservations} />
      </div>

      {/* Reservation Details */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-foreground">Reservation Details</h3>
          <Link to="/profile/reservations" className="text-sm text-primary cursor-pointer">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-6 gap-4 px-6 py-3 text-sm text-muted-foreground border-b">
          <div>Vehicle Model</div>
          <div>Location</div>
          <div>Destination</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {!rows.length ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No reservations yet
          </div>
        ) : (
          rows.map((r, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b text-sm"
            >
              <div className="truncate">{r.vehicleModel}</div>
              <div className="truncate">{r.pickupLocation}</div>
              <div className="truncate">{r.dropoffLocation}</div>
              <div className="truncate">{r.date}</div>
              <div className="truncate">{r.amount}</div>
              <div className="truncate">{r.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default ProfileOverview;
