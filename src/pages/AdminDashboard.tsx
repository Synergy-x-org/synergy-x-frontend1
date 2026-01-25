import { useState } from "react";
import { Search, Bell, ChevronDown, ChevronRight, LogOut, Settings, HelpCircle, MessageSquare, Users, Calendar, Truck, Package, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import logo from "@/assets/logo.png";

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

const reservations = [
  {
    id: 1,
    vehicleModel: "BMW Road Cars",
    vehicleImage: "🚗",
    location: "Montana, USA",
    destination: "Washington, USA",
    date: "15/08/2017",
    amount: "$ 1,451.76",
    status: "Active",
  },
  {
    id: 2,
    vehicleModel: "Volkswagen",
    vehicleImage: "🚙",
    location: "Minnesota, USA",
    destination: "Michigan, USA",
    date: "18/09/2016",
    amount: "$ 1,505.33",
    status: "Pending",
  },
  {
    id: 3,
    vehicleModel: "Land Rover",
    vehicleImage: "🚕",
    location: "New Mexico, USA",
    destination: "Brazil, USA",
    date: "15/08/2017",
    amount: "$ 1,764.46",
    status: "Rejected",
  },
];

const AdminDashboard = () => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Dashboard"]);

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, hasSubmenu: true },
    { name: "Users", icon: Users, hasSubmenu: true },
    { name: "Reservations", icon: Calendar, hasSubmenu: true },
    { name: "Shipment Status", icon: Truck, hasSubmenu: true },
    { name: "Dispatch", icon: Package, hasSubmenu: true },
    { name: "Chats", icon: MessageSquare, hasSubmenu: true },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <img src={logo} alt="Synergy X" className="h-12" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    item.name === "Dashboard"
                      ? "text-primary bg-orange-50"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedMenus.includes(item.name) ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
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

          {/* User Profile */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="John Doe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">johndoe@gmail.com</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
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
            <div className="w-10 h-10 rounded-full bg-primary overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome David</h1>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Today's Date</p>
                  <p className="text-sm font-medium text-gray-900">1st July, 2023</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total User */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total User</p>
                    <p className="text-2xl font-bold text-gray-900">1,902</p>
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

            {/* Total Reservation */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Reservation</p>
                    <p className="text-2xl font-bold text-gray-900">1,190</p>
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

            {/* Total Revenue */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$1,190</p>
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

            {/* Successful shipment */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Successful shipment</p>
                    <p className="text-2xl font-bold text-gray-900">1,190</p>
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

          {/* Shipment Details Chart */}
          <Card className="bg-white border border-gray-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
                <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5">
                  October
                  <ChevronDown className="w-4 h-4" />
                </button>
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

          {/* Reservation Details Table */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Reservation Details</h2>
                <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5">
                  October
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                    <TableHead className="text-gray-500 font-medium">Vehicle Model</TableHead>
                    <TableHead className="text-gray-500 font-medium">Location</TableHead>
                    <TableHead className="text-gray-500 font-medium">Destination</TableHead>
                    <TableHead className="text-gray-500 font-medium">Date</TableHead>
                    <TableHead className="text-gray-500 font-medium">Amount</TableHead>
                    <TableHead className="text-gray-500 font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id} className="border-b border-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                            {reservation.vehicleImage}
                          </div>
                          <span className="text-gray-900">{reservation.vehicleModel}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{reservation.location}</TableCell>
                      <TableCell className="text-gray-600">{reservation.destination}</TableCell>
                      <TableCell className="text-gray-600">{reservation.date}</TableCell>
                      <TableCell className="text-gray-900 font-medium">{reservation.amount}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {reservation.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
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
