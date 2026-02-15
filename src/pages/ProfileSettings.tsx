import { useState, useEffect, useRef } from "react";
import { Mail, Phone, Lock, MapPin, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// ✅ use your existing autocomplete function
import { getAutocomplete } from "@/services/mapService";

const BASE_URL = "https://synergy-x-transportation-backend.onrender.com/api/v1";

type UpdateProfileResponse = {
  success: boolean;
  message: string;
  data?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
  timestamp?: string;
};

type Suggestion = {
  id: string;
  label: string;
};

function normalizeAutocompleteResponse(raw: any): Suggestion[] {
  // Case A: Google-like { predictions: [{ description, place_id }] }
  if (raw?.predictions && Array.isArray(raw.predictions)) {
    return raw.predictions
      .map((p: any) => ({
        id: String(p.place_id ?? p.id ?? p.description ?? Math.random()),
        label: String(p.description ?? ""),
      }))
      .filter((s: Suggestion) => s.label.trim().length > 0);
  }

  // Case B: { suggestions: [...] }
  if (raw?.suggestions && Array.isArray(raw.suggestions)) {
    return raw.suggestions
      .map((x: any) => ({
        id: String(x.place_id ?? x.id ?? x.description ?? x.label ?? x ?? Math.random()),
        label: String(x.description ?? x.label ?? x),
      }))
      .filter((s: Suggestion) => s.label.trim().length > 0);
  }

  // Case C: raw is array of strings / objects
  if (Array.isArray(raw)) {
    return raw
      .map((x: any) => ({
        id: String(x.place_id ?? x.id ?? x.description ?? x.label ?? x ?? Math.random()),
        label: String(x.description ?? x.label ?? x),
      }))
      .filter((s: Suggestion) => s.label.trim().length > 0);
  }

  return [];
}

const ProfileSettings = () => {
  const { user, updateUser, token } = useAuth() as any;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    newPassword: "",
    confirmPassword: "",
    currentAddress: "",
    permanentAddress: "",
    postalCode: "",
    city: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
      }));
    }
  }, [user]);

  const getToken = () => token || "";

  /* ----------------------------------
     AUTOCOMPLETE STATE (3 fields)
  ----------------------------------- */
  const [currentAddrSuggestions, setCurrentAddrSuggestions] = useState<Suggestion[]>([]);
  const [permanentAddrSuggestions, setPermanentAddrSuggestions] = useState<Suggestion[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<Suggestion[]>([]);

  const [isLoadingCurrentAddr, setIsLoadingCurrentAddr] = useState(false);
  const [isLoadingPermanentAddr, setIsLoadingPermanentAddr] = useState(false);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  const currentAddrReqId = useRef(0);
  const permanentAddrReqId = useRef(0);
  const cityReqId = useRef(0);

  const [openDropdown, setOpenDropdown] = useState<"current" | "permanent" | "city" | null>(null);

  const runAutocomplete = async (
    value: string,
    which: "current" | "permanent" | "city"
  ) => {
    const q = value.trim();
    if (q.length < 3) {
      if (which === "current") setCurrentAddrSuggestions([]);
      if (which === "permanent") setPermanentAddrSuggestions([]);
      if (which === "city") setCitySuggestions([]);
      return;
    }

    if (which === "current") {
      const id = ++currentAddrReqId.current;
      setIsLoadingCurrentAddr(true);
      try {
        const res = await getAutocomplete(q);
        if (id !== currentAddrReqId.current) return; // ignore stale
        setCurrentAddrSuggestions(normalizeAutocompleteResponse(res));
      } catch {
        setCurrentAddrSuggestions([]);
      } finally {
        if (id === currentAddrReqId.current) setIsLoadingCurrentAddr(false);
      }
    }

    if (which === "permanent") {
      const id = ++permanentAddrReqId.current;
      setIsLoadingPermanentAddr(true);
      try {
        const res = await getAutocomplete(q);
        if (id !== permanentAddrReqId.current) return;
        setPermanentAddrSuggestions(normalizeAutocompleteResponse(res));
      } catch {
        setPermanentAddrSuggestions([]);
      } finally {
        if (id === permanentAddrReqId.current) setIsLoadingPermanentAddr(false);
      }
    }

    if (which === "city") {
      const id = ++cityReqId.current;
      setIsLoadingCity(true);
      try {
        const res = await getAutocomplete(q);
        if (id !== cityReqId.current) return;
        setCitySuggestions(normalizeAutocompleteResponse(res));
      } catch {
        setCitySuggestions([]);
      } finally {
        if (id === cityReqId.current) setIsLoadingCity(false);
      }
    }
  };

  const selectSuggestion = (which: "current" | "permanent" | "city", label: string) => {
    if (which === "current") {
      setFormData((p) => ({ ...p, currentAddress: label }));
      setCurrentAddrSuggestions([]);
    }
    if (which === "permanent") {
      setFormData((p) => ({ ...p, permanentAddress: label }));
      setPermanentAddrSuggestions([]);
    }
    if (which === "city") {
      setFormData((p) => ({ ...p, city: label }));
      setCitySuggestions([]);
    }
    setOpenDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      toast({
        title: "Session expired",
        description: "Please log in again to update your profile.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const body: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      currentAddress: formData.currentAddress,
      permanentAddress: formData.permanentAddress,
      postalCode: formData.postalCode,
      city: formData.city,
    };

    if (formData.newPassword) {
      body.newPassword = formData.newPassword;
      body.confirmPassword = formData.confirmPassword;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/user/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as UpdateProfileResponse;

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to update profile");
      }

      updateUser({
        firstName: data?.data?.firstName ?? formData.firstName,
        lastName: data?.data?.lastName ?? formData.lastName,
        phone: data?.data?.phoneNumber ?? formData.phoneNumber,
        email: formData.email,
      });

      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));

      toast({
        title: "Profile Updated",
        description: data.message || "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const Suggestions = ({
    items,
    loading,
    onPick,
  }: {
    items: Suggestion[];
    loading: boolean;
    onPick: (label: string) => void;
  }) => {
    if (loading) {
      return (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-md p-2 text-sm text-muted-foreground">
          Loading suggestions...
        </div>
      );
    }

    if (!items.length) return null;

    return (
      <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-md overflow-hidden">
        {items.slice(0, 8).map((s) => (
          <button
            type="button"
            key={s.id}
            onMouseDown={(e) => e.preventDefault()} // prevents blur before click
            onClick={() => onPick(s.label)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">Email can’t be changed here.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  placeholder="08112345678"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Address Fields (AUTOCOMPLETE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Address */}
            <div className="space-y-2">
              <Label htmlFor="currentAddress">Current Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="currentAddress"
                  placeholder="your current address"
                  value={formData.currentAddress}
                  onFocus={() => setOpenDropdown("current")}
                  onBlur={() => setTimeout(() => setOpenDropdown(null), 120)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, currentAddress: v });
                    setOpenDropdown("current");
                    runAutocomplete(v, "current");
                  }}
                  className="pl-10"
                  autoComplete="off"
                />
                {openDropdown === "current" && (
                  <Suggestions
                    items={currentAddrSuggestions}
                    loading={isLoadingCurrentAddr}
                    onPick={(label) => selectSuggestion("current", label)}
                  />
                )}
              </div>
            </div>

            {/* Permanent Address */}
            <div className="space-y-2">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="permanentAddress"
                  placeholder="your permanent address"
                  value={formData.permanentAddress}
                  onFocus={() => setOpenDropdown("permanent")}
                  onBlur={() => setTimeout(() => setOpenDropdown(null), 120)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, permanentAddress: v });
                    setOpenDropdown("permanent");
                    runAutocomplete(v, "permanent");
                  }}
                  className="pl-10"
                  autoComplete="off"
                />
                {openDropdown === "permanent" && (
                  <Suggestions
                    items={permanentAddrSuggestions}
                    loading={isLoadingPermanentAddr}
                    onPick={(label) => selectSuggestion("permanent", label)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* City (AUTOCOMPLETE) + Postal code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="your city"
                  value={formData.city}
                  onFocus={() => setOpenDropdown("city")}
                  onBlur={() => setTimeout(() => setOpenDropdown(null), 120)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, city: v });
                    setOpenDropdown("city");
                    runAutocomplete(v, "city");
                  }}
                  className="pl-10"
                  autoComplete="off"
                />
                {openDropdown === "city" && (
                  <Suggestions
                    items={citySuggestions}
                    loading={isLoadingCity}
                    onPick={(label) => selectSuggestion("city", label)}
                  />
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
