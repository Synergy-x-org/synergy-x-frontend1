// // ✅ Updated File: src/pages/ProfileReservations.tsx
// // Only change from your last file: map "Amount" to backend `price` (fallback to `amount`)
// // and also fill Location/Destination/Date/Vehicle from the default endpoint shape.
// // Placeholders "Start date" and "End date" are kept exactly as you had them.

// import { useEffect, useMemo, useState } from "react";
// import { Search, Filter, ChevronDown } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   reservationsAPI,
//   type UserProfileReservation,
//   type ReservationDetails,
// } from "@/services/reservationsAPI";

// type UiStatus = "Active" | "Pending" | "Canceled";

// type UiReservation = {
//   id: string;
//   vehicleModel: string;
//   location: string;
//   destination: string;
//   date: string;
//   amount: string;
//   status: UiStatus;
// };

// type FilterBy = "NONE" | "DATE" | "LOCATION";

// const mapStatus = (raw?: string): UiStatus => {
//   const s = (raw || "").toUpperCase();
//   if (s === "PENDING") return "Pending";
//   if (
//     s === "ACTIVE" ||
//     s === "SUCCESSFUL" ||
//     s === "SHIPPED" ||
//     s === "DELIVERED"
//   )
//     return "Active";
//   if (s === "CANCELLED" || s === "CANCELED" || s === "FAILED")
//     return "Canceled";
//   return "Pending";
// };

// const statusBadgeClass = (s: UiStatus) => {
//   if (s === "Active")
//     return "bg-green-500 hover:bg-green-600 text-white border-0";
//   if (s === "Pending")
//     return "bg-yellow-500 hover:bg-yellow-600 text-white border-0";
//   return "bg-red-500 hover:bg-red-600 text-white border-0";
// };

// const formatMoney = (value?: number) => {
//   if (typeof value !== "number" || Number.isNaN(value)) return "—";
//   return new Intl.NumberFormat(undefined, {
//     style: "currency",
//     currency: "USD",
//   }).format(value);
// };

// const toUiFromUserProfile = (r: UserProfileReservation): UiReservation => ({
//   id: r.reservationId,
//   vehicleModel:
//     (r as any).vehicle ||
//     (r.quoteReference ? `Quote ${r.quoteReference}` : "—"),
//   location: (r as any).pickupAddress || "—",
//   destination: (r as any).deliveryAddress || "—",
//   date:
//     (r as any).reservationDate ||
//     (r as any).pickupDate ||
//     (r as any).deliveryDate ||
//     r.createdAt ||
//     "—",
//   // ✅ FIX: Amount column should be the price
//   amount: formatMoney(
//     typeof (r as any).price === "number" ? (r as any).price : r.amount
//   ),
//   status: mapStatus(r.status),
// });

// const pickDate = (r: ReservationDetails) =>
//   r.reservationDate || r.pickupDate || r.deliveryDate || "—";

// const toUiFromDateRange = (r: ReservationDetails): UiReservation => ({
//   id: r.reservationId,
//   vehicleModel: r.vehicle || "—",
//   location: r.pickupAddress || "—",
//   destination: r.deliveryAddress || "—",
//   date: pickDate(r),
//   amount: formatMoney(r.price),
//   status: mapStatus(r.status),
// });

// const ProfileReservations = () => {
//   const { token } = useAuth();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [allReservations, setAllReservations] = useState<UiReservation[]>([]);

//   const [search, setSearch] = useState("");

//   const [filterBy, setFilterBy] = useState<FilterBy>("NONE");

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [locationKeyword, setLocationKeyword] = useState("");
//   const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

//   const [statusFilter, setStatusFilter] = useState<UiStatus | "ALL">("ALL");

//   const activeLock = useMemo(() => {
//     if (filterBy === "DATE" && (startDate || endDate)) return "DATE";
//     if (filterBy === "LOCATION" && locationKeyword.trim()) return "LOCATION";
//     if (statusFilter !== "ALL") return "STATUS";
//     if (search.trim()) return "SEARCH";
//     return null;
//   }, [filterBy, startDate, endDate, locationKeyword, statusFilter, search]);

//   const loadDefault = async () => {
//     if (!token) {
//       setLoading(false);
//       setError("You must be logged in.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const data = await reservationsAPI.getUserProfileReservations(token);
//       setAllReservations(data.map(toUiFromUserProfile));
//     } catch (e: any) {
//       setAllReservations([]);
//       setError(e?.message || "Failed to load reservations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDefault();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   const resetAll = () => {
//     setSearch("");
//     setFilterBy("NONE");
//     setStartDate("");
//     setEndDate("");
//     setLocationKeyword("");
//     setLocationSuggestions([]);
//     setStatusFilter("ALL");
//     setError(null);
//     loadDefault();
//   };

//   useEffect(() => {
//     const run = async () => {
//       if (filterBy !== "DATE") return;
//       if (!startDate || !endDate) return;
//       if (!token) return;

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await reservationsAPI.getByDateRange(
//           startDate,
//           endDate,
//           token
//         );
//         setAllReservations(data.map(toUiFromDateRange));
//       } catch (e: any) {
//         setAllReservations([]);
//         setError(e?.message || "Failed to fetch reservations by date range");
//       } finally {
//         setLoading(false);
//       }
//     };

//     run();
//   }, [filterBy, startDate, endDate, token]);

//   useEffect(() => {
//     const run = async () => {
//       if (filterBy !== "LOCATION") return;
//       const kw = locationKeyword.trim();
//       if (!kw) {
//         setLocationSuggestions([]);
//         return;
//       }
//       if (!token) return;

//       try {
//         setError(null);
//         const suggestions = await reservationsAPI.getLocationSuggestions(
//           kw,
//           token
//         );
//         setLocationSuggestions(suggestions);
//       } catch (e: any) {
//         setLocationSuggestions([]);
//         setError(e?.message || "Failed to fetch location suggestions");
//       }
//     };

//     run();
//   }, [filterBy, locationKeyword, token]);

//   // const handleSearch = async () => {
//   //   const q = search.trim();
//   //   if (!q) return;

//   //   if (!token) {
//   //     setError("You must be logged in.");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     setError(null);

//   //     const one = await reservationsAPI.getUserProfileByQuoteReference(q, token);

//   //     if (one?.reservationId) {
//   //       setAllReservations([
//   //         {
//   //           id: one.reservationId,
//   //           vehicleModel: one.quoteReference ? `Quote ${one.quoteReference}` : "—",
//   //           location: "—",
//   //           destination: "—",
//   //           date: "—",
//   //           amount: formatMoney(one.amount),
//   //           status: mapStatus(one.status),
//   //         },
//   //       ]);
//   //       return;
//   //     }

//   //     setAllReservations((prev) =>
//   //       prev.filter(
//   //         (r) =>
//   //           r.id.toLowerCase().includes(q.toLowerCase()) ||
//   //           r.vehicleModel.toLowerCase().includes(q.toLowerCase())
//   //       )
//   //     );
//   //   } catch {
//   //     setAllReservations((prev) =>
//   //       prev.filter((r) => r.id.toLowerCase().includes(q.toLowerCase()))
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSearch = async () => {
//   const q = search.trim();
//   if (!q) return;

//   if (!token) {
//     setError("You must be logged in.");
//     return;
//   }

//   try {
//     setLoading(true);
//     setError(null);

//     const one = await reservationsAPI.getUserProfileByQuoteReference(q, token);

//     if (!one?.reservationId) {
//       setAllReservations([]);
//       setError("No reservation found for that quote reference.");
//       return;
//     }

//     setAllReservations([
//       {
//         id: one.reservationId,
//         vehicleModel: one.quoteReference ? `Quote ${one.quoteReference}` : "—",
//         location: "—",
//         destination: "—",
//         date: "—",
//         amount: formatMoney(one.amount),
//         status: mapStatus(one.status),
//       },
//     ]);
//   } catch (e: any) {
//     setAllReservations([]);
//     setError(e?.message || "No reservation found for that quote reference.");
//   } finally {
//     setLoading(false);
//   }
// };


//   const rows = useMemo(() => {
//     let list = [...allReservations];

//     if (statusFilter !== "ALL") {
//       list = list.filter((r) => r.status === statusFilter);
//     }

//     const q = search.trim().toLowerCase();
//     if (q && activeLock === "SEARCH") {
//       list = list.filter(
//         (r) =>
//           r.id.toLowerCase().includes(q) ||
//           r.vehicleModel.toLowerCase().includes(q)
//       );
//     }

//     return list;
//   }, [allReservations, statusFilter, search, activeLock]);

//   const disableSearch = activeLock !== null && activeLock !== "SEARCH";
//   const disableFilterBy =
//     activeLock !== null && activeLock !== "DATE" && activeLock !== "LOCATION";
//   const disableStatus = activeLock !== null && activeLock !== "STATUS";

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle>Reservation Details</CardTitle>

//           {(activeLock || error) && (
//             <Button variant="outline" size="sm" onClick={resetAll}>
//               Reset
//             </Button>
//           )}
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 mt-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//             <Input
//               placeholder="Quote Reference"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10"
//               disabled={disableSearch}
//             />
//           </div>

//           <Button
//             className="gap-2 bg-primary text-white hover:bg-primary/90"
//             onClick={handleSearch}
//             disabled={disableSearch}
//           >
//             <Search className="w-4 h-4" />
//             Search
//           </Button>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="gap-2"
//               disabled={disableFilterBy}
//             >
//               <Filter className="w-4 h-4" />
//               Filter By
//             </Button>

//             <Select
//               value={filterBy}
//               onValueChange={(v) => {
//                 const next = v as FilterBy;
//                 setFilterBy(next);

//                 setStartDate("");
//                 setEndDate("");
//                 setLocationKeyword("");
//                 setLocationSuggestions([]);
//                 setError(null);

//                 if (next === "NONE") loadDefault();
//               }}
//               disabled={disableFilterBy}
//             >
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="NONE">None</SelectItem>
//                 <SelectItem value="DATE">Date</SelectItem>
//                 <SelectItem value="LOCATION">Location</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex items-center gap-2">
//             {filterBy === "DATE" ? (
//               <>
//                 <Input
//                   type="text"
//                   placeholder="Start date"
//                   value={startDate}
//                   onFocus={(e) => (e.currentTarget.type = "date")}
//                   onBlur={(e) => {
//                     if (!startDate) e.currentTarget.type = "text";
//                   }}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-[160px]"
//                 />

//                 <Input
//                   type="text"
//                   placeholder="End date"
//                   value={endDate}
//                   onFocus={(e) => (e.currentTarget.type = "date")}
//                   onBlur={(e) => {
//                     if (!endDate) e.currentTarget.type = "text";
//                   }}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-[160px]"
//                 />
//               </>
//             ) : (
//               <Button variant="outline" className="gap-2" disabled>
//                 Date
//                 <ChevronDown className="w-4 h-4" />
//               </Button>
//             )}

//             {filterBy === "LOCATION" ? (
//               <Input
//                 placeholder="Keyword e.g. New"
//                 value={locationKeyword}
//                 onChange={(e) => setLocationKeyword(e.target.value)}
//                 className="w-[200px]"
//               />
//             ) : (
//               <Button variant="outline" className="gap-2" disabled>
//                 Location
//                 <ChevronDown className="w-4 h-4" />
//               </Button>
//             )}
//           </div>

//           <Select
//             value={statusFilter}
//             onValueChange={(v) => setStatusFilter(v as any)}
//             disabled={disableStatus}
//           >
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="ALL">Status</SelectItem>
//               <SelectItem value="Pending">Pending</SelectItem>
//               <SelectItem value="Active">Active</SelectItem>
//               <SelectItem value="Canceled">Canceled</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {filterBy === "LOCATION" && locationSuggestions.length > 0 && (
//           <div className="mt-3 text-sm text-muted-foreground">
//             Suggestions:{" "}
//             <span className="text-foreground">
//               {locationSuggestions.join(", ")}
//             </span>
//           </div>
//         )}
//       </CardHeader>

//       <CardContent>
//         <div className="hidden md:grid md:grid-cols-6 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
//           <div>Vehicle Model</div>
//           <div>Location</div>
//           <div>Destination</div>
//           <div>Date</div>
//           <div>Amount</div>
//           <div>Status</div>
//         </div>

//         {loading && (
//           <div className="py-10 text-center text-sm text-muted-foreground">
//             Loading reservations...
//           </div>
//         )}

//         {!loading && error && (
//           <div className="py-10 text-center text-sm text-destructive">
//             {error}
//           </div>
//         )}

//         {!loading && !error && rows.length === 0 && (
//           <div className="py-10 text-center text-sm text-muted-foreground">
//             No reservations found.
//           </div>
//         )}

//         {!loading && !error && rows.length > 0 && (
//           <div className="space-y-4 mt-4">
//             {rows.map((r) => (
//               <div
//                 key={r.id}
//                 className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4 border-b border-border last:border-0"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
//                     <span className="text-xs font-medium">🚗</span>
//                   </div>
//                   <span className="text-sm font-medium">{r.vehicleModel}</span>
//                 </div>

//                 <div className="text-sm text-muted-foreground">{r.location}</div>
//                 <div className="text-sm text-muted-foreground">
//                   {r.destination}
//                 </div>
//                 <div className="text-sm text-muted-foreground">{r.date}</div>
//                 <div className="text-sm font-medium">{r.amount}</div>

//                 <div>
//                   <Badge className={statusBadgeClass(r.status)}>{r.status}</Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-border">
//           <Button variant="outline" size="sm">
//             Previous
//           </Button>
//           <span className="text-sm text-muted-foreground">Page 1 of 1</span>
//           <Button variant="outline" size="sm">
//             Next
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileReservations;

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  reservationsAPI,
  type UserProfileReservation,
  type ReservationDetails,
} from "@/services/reservationsAPI";

type UiStatus = "Active" | "Pending" | "Canceled";

type UiReservation = {
  id: string;
  bookingId: string; // ✅ quoteReference
  vehicleModel: string;
  location: string;
  destination: string;
  date: string;
  amount: string;
  status: UiStatus;
};

type FilterBy = "NONE" | "DATE" | "LOCATION";

const mapStatus = (raw?: string): UiStatus => {
  const s = (raw || "").toUpperCase();
  if (s === "PENDING") return "Pending";
  if (s === "ACTIVE" || s === "SUCCESSFUL" || s === "SHIPPED" || s === "DELIVERED")
    return "Active";
  if (s === "CANCELLED" || s === "CANCELED" || s === "FAILED") return "Canceled";
  return "Pending";
};

const statusBadgeClass = (s: UiStatus) => {
  if (s === "Active") return "bg-green-500 hover:bg-green-600 text-white border-0";
  if (s === "Pending") return "bg-yellow-500 hover:bg-yellow-600 text-white border-0";
  return "bg-red-500 hover:bg-red-600 text-white border-0";
};

const formatMoney = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const toUiFromUserProfile = (r: UserProfileReservation): UiReservation => ({
  id: r.reservationId,
  bookingId: (r as any).quoteReference || "—",
  vehicleModel: (r as any).vehicle || (r.quoteReference ? `Quote ${r.quoteReference}` : "—"),
  location: (r as any).pickupAddress || "—",
  destination: (r as any).deliveryAddress || "—",
  date:
    (r as any).reservationDate ||
    (r as any).pickupDate ||
    (r as any).deliveryDate ||
    r.createdAt ||
    "—",
  amount: formatMoney(typeof (r as any).price === "number" ? (r as any).price : r.amount),
  status: mapStatus(r.status),
});

const pickDate = (r: ReservationDetails) =>
  r.reservationDate || r.pickupDate || r.deliveryDate || "—";

const toUiFromDateRange = (r: ReservationDetails): UiReservation => ({
  id: r.reservationId,
  bookingId: (r as any).quoteReference || "—",
  vehicleModel: r.vehicle || "—",
  location: r.pickupAddress || "—",
  destination: r.deliveryAddress || "—",
  date: pickDate(r),
  amount: formatMoney(r.price),
  status: mapStatus(r.status),
});

const ProfileReservations = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allReservations, setAllReservations] = useState<UiReservation[]>([]);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<FilterBy>("NONE");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [locationKeyword, setLocationKeyword] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const [statusFilter, setStatusFilter] = useState<UiStatus | "ALL">("ALL");

  const activeLock = useMemo(() => {
    if (filterBy === "DATE" && (startDate || endDate)) return "DATE";
    if (filterBy === "LOCATION" && locationKeyword.trim()) return "LOCATION";
    if (statusFilter !== "ALL") return "STATUS";
    if (search.trim()) return "SEARCH";
    return null;
  }, [filterBy, startDate, endDate, locationKeyword, statusFilter, search]);

  const loadDefault = async () => {
    if (!token) {
      setLoading(false);
      setError("You must be logged in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await reservationsAPI.getUserProfileReservations(token);
      setAllReservations(data.map(toUiFromUserProfile));
    } catch (e: any) {
      setAllReservations([]);
      setError(e?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const resetAll = () => {
    setSearch("");
    setFilterBy("NONE");
    setStartDate("");
    setEndDate("");
    setLocationKeyword("");
    setLocationSuggestions([]);
    setStatusFilter("ALL");
    setError(null);
    loadDefault();
  };

  useEffect(() => {
    const run = async () => {
      if (filterBy !== "DATE") return;
      if (!startDate || !endDate) return;
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        const data = await reservationsAPI.getByDateRange(startDate, endDate, token);
        setAllReservations(data.map(toUiFromDateRange));
      } catch (e: any) {
        setAllReservations([]);
        setError(e?.message || "Failed to fetch reservations by date range");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [filterBy, startDate, endDate, token]);

  useEffect(() => {
    const run = async () => {
      if (filterBy !== "LOCATION") return;
      const kw = locationKeyword.trim();
      if (!kw) {
        setLocationSuggestions([]);
        return;
      }
      if (!token) return;

      try {
        setError(null);
        const suggestions = await reservationsAPI.getLocationSuggestions(kw, token);
        setLocationSuggestions(suggestions);
      } catch (e: any) {
        setLocationSuggestions([]);
        setError(e?.message || "Failed to fetch location suggestions");
      }
    };

    run();
  }, [filterBy, locationKeyword, token]);

  const handleSearch = async () => {
    const q = search.trim();
    if (!q) return;

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const one = await reservationsAPI.getUserProfileByQuoteReference(q, token);

      if (!one?.reservationId) {
        setAllReservations([]);
        setError("No reservation found for that quote reference.");
        return;
      }

      setAllReservations([
        {
          id: one.reservationId,
          bookingId: one.quoteReference || "—",
          vehicleModel: one.quoteReference ? `Quote ${one.quoteReference}` : "—",
          location: "—",
          destination: "—",
          date: "—",
          amount: formatMoney(one.amount),
          status: mapStatus(one.status),
        },
      ]);
    } catch (e: any) {
      setAllReservations([]);
      setError(e?.message || "No reservation found for that quote reference.");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    let list = [...allReservations];

    if (statusFilter !== "ALL") {
      list = list.filter((r) => r.status === statusFilter);
    }

    const q = search.trim().toLowerCase();
    if (q && activeLock === "SEARCH") {
      list = list.filter(
        (r) => r.id.toLowerCase().includes(q) || r.vehicleModel.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allReservations, statusFilter, search, activeLock]);

  const disableSearch = activeLock !== null && activeLock !== "SEARCH";
  const disableFilterBy = activeLock !== null && activeLock !== "DATE" && activeLock !== "LOCATION";
  const disableStatus = activeLock !== null && activeLock !== "STATUS";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reservation Details</CardTitle>

          {(activeLock || error) && (
            <Button variant="outline" size="sm" onClick={resetAll}>
              Reset
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Booking Id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              disabled={disableSearch}
            />
          </div>

          <Button
            className="gap-2 bg-primary text-white hover:bg-primary/90"
            onClick={handleSearch}
            disabled={disableSearch}
          >
            <Search className="w-4 h-4" />
            Search
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" disabled={disableFilterBy}>
              <Filter className="w-4 h-4" />
              Filter By
            </Button>

            <Select
              value={filterBy}
              onValueChange={(v) => {
                const next = v as FilterBy;
                setFilterBy(next);

                setStartDate("");
                setEndDate("");
                setLocationKeyword("");
                setLocationSuggestions([]);
                setError(null);

                if (next === "NONE") loadDefault();
              }}
              disabled={disableFilterBy}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="DATE">Date</SelectItem>
                <SelectItem value="LOCATION">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {filterBy === "DATE" ? (
              <>
                <Input
                  type="text"
                  placeholder="Start date"
                  value={startDate}
                  onFocus={(e) => (e.currentTarget.type = "date")}
                  onBlur={(e) => {
                    if (!startDate) e.currentTarget.type = "text";
                  }}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[160px]"
                />

                <Input
                  type="text"
                  placeholder="End date"
                  value={endDate}
                  onFocus={(e) => (e.currentTarget.type = "date")}
                  onBlur={(e) => {
                    if (!endDate) e.currentTarget.type = "text";
                  }}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[160px]"
                />
              </>
            ) : (
              <Button variant="outline" className="gap-2" disabled>
                Date
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}

            {filterBy === "LOCATION" ? (
              <Input
                placeholder="Keyword e.g. New"
                value={locationKeyword}
                onChange={(e) => setLocationKeyword(e.target.value)}
                className="w-[200px]"
              />
            ) : (
              <Button variant="outline" className="gap-2" disabled>
                Location
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
            disabled={disableStatus}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filterBy === "LOCATION" && locationSuggestions.length > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            Suggestions:{" "}
            <span className="text-foreground">{locationSuggestions.join(", ")}</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* ✅ 7 columns now */}
        <div className="hidden md:grid md:grid-cols-7 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
          <div>Vehicle Model</div>
          <div>Booking ID</div>
          <div>Location</div>
          <div>Destination</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {loading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading reservations...
          </div>
        )}

        {!loading && error && (
          <div className="py-10 text-center text-sm text-destructive">{error}</div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No reservations found.
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <div className="space-y-4 mt-4">
            {rows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center py-4 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-xs font-medium">🚗</span>
                  </div>
                  <span className="text-sm font-medium">{r.vehicleModel}</span>
                </div>

                <div className="text-sm text-muted-foreground">{r.bookingId}</div>
                <div className="text-sm text-muted-foreground">{r.location}</div>
                <div className="text-sm text-muted-foreground">{r.destination}</div>
                <div className="text-sm text-muted-foreground">{r.date}</div>
                <div className="text-sm font-medium">{r.amount}</div>

                <div>
                  <Badge className={statusBadgeClass(r.status)}>{r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

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

