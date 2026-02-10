// ✅ Updated File: src/pages/ProfileOverview.tsx
// Frontend-computed totals (totalReservations, pendingReservations, totalShipped)
// derived from the same reservations list used in the table.

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  reservationsAPI,
  type UserProfileReservation,
} from "@/services/reservationsAPI";

type DashboardData = {
  totalReservations?: number;
  pendingReservations?: number;
  totalShipped?: number;
};

type OverviewReservationRow = {
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

// same logic as your reservations page, but simplified for overview
const mapStatus = (raw?: string): "PENDING" | "SHIPPED" | "OTHER" => {
  const s = (raw || "").toUpperCase();

  if (s === "PENDING") return "PENDING";

  // treat these as shipped/in-progress states
  if (s === "SHIPPED" || s === "DELIVERED") return "SHIPPED";

  // SUCCESSFUL might mean payment success; if your business logic says
  // "SUCCESSFUL = shipped", move it into SHIPPED. Otherwise leave as OTHER.
  // If you want SUCCESSFUL counted as shipped, uncomment next line:
  // if (s === "SUCCESSFUL") return "SHIPPED";

  return "OTHER";
};

const mapOverviewRow = (r: UserProfileReservation): OverviewReservationRow => ({
  vehicleModel:
    (r as any).vehicle ||
    ((r as any).vehicleModel as string) ||
    (r.quoteReference ? `Quote ${r.quoteReference}` : "-"),
  pickupLocation: (r as any).pickupAddress || (r as any).pickupLocation || "-",
  dropoffLocation:
    (r as any).deliveryAddress || (r as any).dropoffLocation || "-",
  date: pickDate(r),
  amount: formatMoney(
    typeof (r as any).price === "number" ? (r as any).price : r.amount
  ),
  status: (r.status as string) || "-",
});

const ProfileOverview = () => {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);

  // dashboard endpoint (optional fallback)
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalReservations: 0,
    pendingReservations: 0,
    totalShipped: 0,
  });

  // ✅ reservations list fetched from backend (source of truth for frontend totals)
  const [rawReservations, setRawReservations] = useState<UserProfileReservation[]>(
    []
  );

  const [reservationRows, setReservationRows] = useState<OverviewReservationRow[]>(
    []
  );

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setLoading(false);
        setError(null);
        setDashboard({
          totalReservations: 0,
          pendingReservations: 0,
          totalShipped: 0,
        });
        setRawReservations([]);
        setReservationRows([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1) Fetch reservations (same as reservations page)
        const list = await reservationsAPI.getUserProfileReservations(token);
        const safeList = Array.isArray(list) ? list : [];
        setRawReservations(safeList);

        // Table preview
        const mappedRows = safeList.map(mapOverviewRow);
        setReservationRows(mappedRows.slice(0, 5));

        // 2) OPTIONAL: fetch dashboard (if it works) as fallback only
        try {
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

          if (dashRes.ok) {
            const maybeData =
              dashJson?.data?.data ||
              dashJson?.data ||
              dashJson?.dashboard ||
              dashJson?.data?.dashboard ||
              null;

            setDashboard({
              totalReservations: maybeData?.totalReservations ?? 0,
              pendingReservations: maybeData?.pendingReservations ?? 0,
              totalShipped: maybeData?.totalShipped ?? 0,
            });
          }
        } catch {
          // ignore dashboard failure; we already have list-based totals
        }
      } catch (e: any) {
        console.error("ProfileOverview error:", e);
        setDashboard({
          totalReservations: 0,
          pendingReservations: 0,
          totalShipped: 0,
        });
        setRawReservations([]);
        setReservationRows([]);
        setError(e?.message || "Failed to load overview");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  // ✅ FRONTEND totals computed from rawReservations
  const computedTotals = useMemo(() => {
    const totalReservations = rawReservations.length;

    let pendingReservations = 0;
    let totalShipped = 0;

    for (const r of rawReservations) {
      const bucket = mapStatus(r.status);

      if (bucket === "PENDING") pendingReservations += 1;
      if (bucket === "SHIPPED") totalShipped += 1;
    }

    return { totalReservations, pendingReservations, totalShipped };
  }, [rawReservations]);

  // ✅ Use computed totals first; fallback to dashboard endpoint if needed
  const totalReservations =
    computedTotals.totalReservations ?? dashboard.totalReservations ?? 0;
  const pendingReservations =
    computedTotals.pendingReservations ?? dashboard.pendingReservations ?? 0;
  const totalShipped = computedTotals.totalShipped ?? dashboard.totalShipped ?? 0;

  const hasReservations = reservationRows.length > 0;

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
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome {user?.firstName}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Reservations</p>
          <p className="text-3xl font-bold mt-2">{totalReservations}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Pending Reservation
          </p>
          <p className="text-3xl font-bold mt-2">{pendingReservations}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Shipped</p>
          <p className="text-3xl font-bold mt-2">{totalShipped}</p>
        </div>
      </div>

      {/* Reservation Details */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-foreground">Reservation Details</h3>

          <Link
            to="/profile/reservations"
            className="text-sm text-primary cursor-pointer"
          >
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

        {!hasReservations ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No reservations yet
          </div>
        ) : (
          reservationRows.map((r, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b text-sm"
            >
              <div className="truncate">{r.vehicleModel || "-"}</div>
              <div className="truncate">{r.pickupLocation || "-"}</div>
              <div className="truncate">{r.dropoffLocation || "-"}</div>
              <div className="truncate">{r.date || "-"}</div>
              <div className="truncate">{r.amount || "-"}</div>
              <div className="truncate">{r.status || "-"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;
