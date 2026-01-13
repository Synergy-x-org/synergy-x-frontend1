// ✅ Updated File: src/pages/Profile.tsx - Main profile layout using real auth data
import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileOverview from "@/pages/ProfileOverview";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const isActivePath = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/profile", label: "Overview" },
    { path: "/profile/reservations", label: "Reservations" },
    { path: "/profile/review", label: "Review" },
    { path: "/profile/track-shipment", label: "Track Shipment" },
    
    
  ];

  return (
    <div className="min-h-screen bg-secondary/20">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4a1f1f] to-[#6b2e2e] pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Account</h1>
          <nav className="flex items-center gap-2 text-sm text-white/80">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white">Account Dashboard</span>
            {location.pathname !== "/profile" && (
              <>
                <span>›</span>
                <span className="text-white">
                  {navItems.find(item => item.path === location.pathname)?.label}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-background rounded-lg shadow-sm overflow-hidden">
              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-border my-4" />

              {/* Settings Links */}
              <div className="px-4 pb-4 space-y-1">
                <Link
                  to="/profile/settings"
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActivePath("/profile/settings")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  Update Porfile
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-3 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Help Centre
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-border my-4" />

              {/* User Info */}
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-secondary rounded-md transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            <ProfileOverview />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
