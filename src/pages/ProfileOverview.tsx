// // ✅ Updated File: src/pages/ProfileOverview.tsx - Profile overview using real user data
// import { FileText, Clock, Truck, TrendingUp } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/contexts/AuthContext";

// const ProfileOverview = () => {
//   const { user } = useAuth();
  
//   // TODO: Fetch user statistics from backend
//   // Example endpoint: GET ${BASE_URL}/api/v1/users/dashboard
//   // Expected response: { stats: { totalReservations, pendingReservations, totalShipped } }
  
//   const stats = {
//     totalReservations: 0,
//     pendingReservations: 0,
//     totalShipped: 0,
//   };

//   const statsCards = [
//     {
//       title: "Total Reservations",
//       value: stats.totalReservations,
//       change: "8.5% Up from yesterday",
//       icon: FileText,
//       bgColor: "bg-yellow-50",
//       iconColor: "text-yellow-600",
//     },
//     {
//       title: "Total Pending Reservation",
//       value: stats.pendingReservations,
//       change: "8.5% Up from yesterday",
//       icon: Clock,
//       bgColor: "bg-orange-50",
//       iconColor: "text-primary",
//     },
//     {
//       title: "Total Shipped",
//       value: stats.totalShipped,
//       change: "8.5% Up from yesterday",
//       icon: Truck,
//       bgColor: "bg-green-50",
//       iconColor: "text-green-600",
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Welcome Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Welcome {user?.firstName} {user?.lastName}</CardTitle>
//           <p className="text-sm text-muted-foreground mt-2">
//             Track your shipping reservations, view payment history, and manage your account settings all in one place. 
//             We're here to make your vehicle transportation experience seamless and stress-free.
//           </p>
//         </CardHeader>
//       </Card>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {statsCards.map((stat, index) => (
//           <Card key={index} className="border-border">
//             <CardContent className="p-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
//                   <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
//                   <div className="flex items-center gap-1 text-sm text-primary">
//                     <TrendingUp className="w-4 h-4" />
//                     <span>{stat.change}</span>
//                   </div>
//                 </div>
//                 <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
//                   <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Recent Activity Section */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Reservation Details</CardTitle>
//             <select className="text-sm border border-input rounded-md px-3 py-1.5 bg-background">
//               <option>October</option>
//               <option>November</option>
//               <option>December</option>
//             </select>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Placeholder for chart/graph */}
//           <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center text-muted-foreground">
//             {/* TODO: Integrate chart library (e.g., recharts) */}
//             {/* Data endpoint: GET /api/user/reservations/chart?month=October */}
//             Chart visualization will appear here
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ProfileOverview;

import { useAuth } from "@/contexts/AuthContext";

const ProfileOverview = () => {
  const { user } = useAuth();

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
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Pending Reservation
          </p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Shipped</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>

      {/* Reservation Details */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-foreground">
            Reservation Details
          </h3>
          <span className="text-sm text-primary cursor-pointer">
            See All
          </span>
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

        {/* Empty State */}
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          No reservations yet
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;

