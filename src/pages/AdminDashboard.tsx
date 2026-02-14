// AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  MessageSquare,
  Users,
  Calendar,
  Truck,
  Package,
  LayoutDashboard,
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import logo from "@/assets/logo.png";
import { adminAPI, AdminReservation, AdminMetrics } from "@/services/adminApi";
import { useAuth } from "@/contexts/AuthContext";

const chartData = [
  { name: "Jan", value: 20 },
  { name: "10k", value: 35 },
  { name: "15k", value: 45 },
  { name: "20k", value: 55 },
  { name: "25k", value: 95 },
  { name: "30k", value: 65 },
  { name: "35k", value: 75 },
  { name: "40k", value: 60 },
  { name: "45k", value: 70 },
  { name: "50k", value: 55 },
  { name: "55k", value: 45 },
  { name: "Dec", value: 65 },
];

const AdminDashboard = () => {

  const todayLabel = useMemo(() => {
  const d = new Date();
  const day = d.getDate();

  const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();

  return `${day}${suffix} ${month}, ${year}`;
}, []);


  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Dashboard"]);

  // ✅ Declare user BEFORE using it
  const { token, user, logout } = useAuth() as any;

  



  // ✅ Derive real name/email from auth user (supports both shapes)
  const firstName = user?.firstName ?? user?.userDetails?.firstName ?? "";
  const lastName = user?.lastName ?? user?.userDetails?.lastName ?? "";
  const email = user?.email ?? "";

  const fullName = `${firstName} ${lastName}`.trim() || "Admin";
  const initials =
    `${(firstName?.[0] || "") + (lastName?.[0] || "")}`.trim() ||
    `${(email?.[0] || "A")}`.toUpperCase();

  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    totalReservations: 0,
    successfulShipments: 0,
  });

  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        const [m, r] = await Promise.all([
          adminAPI.getMetrics(token),
          adminAPI.getReservations(token),
        ]);

        if (cancelled) return;

        setMetrics({
          totalUsers: m?.totalUsers ?? 0,
          totalReservations: m?.totalReservations ?? 0,
          successfulShipments: m?.successfulShipments ?? 0,
        });

        setReservations(r || []);
      } catch (e) {
        // keep UI exactly the same; you can toast if you want
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };


const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Reservations", icon: Calendar, path: "/admin/reservations" },
  { name: "Update Shipment", icon: Truck, path: "/admin/update-shipment" },
  { name: "Dispatch", icon: Package, path: "/admin/dispatch" },
  { name: "Chats", icon: MessageSquare, path: "/admin/chats" },
];


  const getStatusColor = (status: string) => {
    const s = String(status || "").toUpperCase();
    if (s === "ACTIVE") return "bg-green-500";
    if (s === "PENDING") return "bg-yellow-500";
    if (s === "REJECTED") return "bg-red-500";
    if (s === "SUCCESSFUL") return "bg-green-500";
    return "bg-gray-500";
  };

  const tableRows = useMemo(() => {
    return reservations.map((r, idx) => ({
      id: r.reservationId || String(idx),
      bookingId: r.reservationId || "-", // ✅ NEW
      vehicleModel: r.vehicle || "-",
      vehicleImage: "🚗",
      location: r.pickupAddress || "-",
      destination: r.deliveryAddress || "-",
      date: r.reservationDate || "-",
      amount:
        typeof r.price === "number" ? `$ ${r.price.toLocaleString()}` : "-",
      status: r.status || "-",
    }));
  }, [reservations]);

  const navigate = useNavigate();

  
  const handleLogout = () => {
  logout?.();          // clear auth state
  navigate("/login"); // redirect
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <img src={logo} alt="Synergy X" className="h-12" />
        </div>

        <nav className="flex-1 p-4">
  <ul className="space-y-1">
    {menuItems.map((item) => (
      <li key={item.name}>
        <button
          onClick={() => navigate(item.path)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            item.name === "Dashboard"
              ? "text-primary bg-orange-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </button>
      </li>
    ))}
  </ul>
</nav>


        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5" />
              <span>Help Centre</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* ✅ Real user name/email + ✅ no profile picture */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                {initials.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-500">{email || "-"}</p>
              </div>
            </div>
            <button
  onClick={handleLogout}
  className="text-gray-400 hover:text-gray-600"
>
  <LogOut className="w-5 h-5" />
</button>

          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search here..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell className="w-6 h-6" />
            </button>

            {/* ✅ Removed profile picture; use initials circle */}
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {initials.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
            </h1>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Today's Date</p>
                  <p className="text-sm font-medium text-gray-900">{todayLabel}</p>

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards (REAL DATA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total User</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 rotate-[-45deg]" />
                  8.5% Up from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Total Reservation
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics.totalReservations.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 rotate-[-45deg]" />
                  8.5% Up from past week
                </p>
              </CardContent>
            </Card>

            {/* Total Revenue card unchanged */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$0</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-500 font-bold text-lg">$</span>
                  </div>
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 rotate-[-45deg]" />
                  8.5% Up from past week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Successful shipment
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics.successfulShipments.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 rotate-[-45deg]" />
                  8.5% Up from past week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Shipment Details Chart (unchanged) */}
          <Card className="bg-white border border-gray-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipment Details
                </h2>
                {/* <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5">
                  October
                  <ChevronDown className="w-4 h-4" />
                </button> */}
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#EA580C",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                      labelStyle={{ color: "white" }}
                      formatter={(value: number) => [`${value}%`, "Value"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#EA580C"
                      strokeWidth={2}
                      dot={{ fill: "#EA580C", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#EA580C" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Reservation Details Table (REAL DATA) */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Reservation Details
                </h2>
                <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5">
                  October
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                      <TableHead className="text-gray-500 font-medium">Booking ID</TableHead> {/* ✅ NEW */}
                    <TableHead className="text-gray-500 font-medium">
                      Vehicle Model
                    </TableHead>
                    <TableHead className="text-gray-500 font-medium">
                      Location
                    </TableHead>
                    <TableHead className="text-gray-500 font-medium">
                      Destination
                    </TableHead>
                    <TableHead className="text-gray-500 font-medium">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-500 font-medium">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-500 font-medium">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow key={row.id} className="border-b border-gray-50">
  <TableCell className="text-gray-600 font-medium">
    {row.bookingId}
  </TableCell>

  <TableCell>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
        {row.vehicleImage}
      </div>
      <span className="text-gray-900">{row.vehicleModel}</span>
    </div>
  </TableCell>

  <TableCell className="text-gray-600">{row.location}</TableCell>
  <TableCell className="text-gray-600">{row.destination}</TableCell>
  <TableCell className="text-gray-600">{row.date}</TableCell>
  <TableCell className="text-gray-900 font-medium">{row.amount}</TableCell>
  <TableCell>
    <span
      className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(row.status)}`}
    >
      {String(row.status || "").charAt(0).toUpperCase() +
        String(row.status || "").slice(1).toLowerCase()}
    </span>
  </TableCell>
</TableRow>

                  ))}

                  {loading && tableRows.length === 0 ? null : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
