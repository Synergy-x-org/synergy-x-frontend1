// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Menu, X, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useAuth } from "@/contexts/AuthContext";
// import logo from "@/assets/logo.png";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user, isAuthenticated, isLoading, logout } = useAuth();
//   const userName = user?.firstName || "User";
//   const isLoggedIn = !isLoading && isAuthenticated;

//   const handleLogout = () => {
//     logout();
//     // Optionally navigate to login or home
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b border-border">
//       <div className="bg-background border-b border-border">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-end h-10 gap-6 text-xs">
//             <Link to="/moving-cost-calculator" className="text-muted-foreground hover:text-foreground transition-colors">
//               Moving cost calculator
//             </Link>
//             <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//               Help
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center gap-2">
//             <img src={logo} alt="AutoShip Pro" className="h-35 w-15" />
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-8">
//             <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
//               How It Works
//             </a>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors focus:outline-none">
//                 Transport Options <ChevronDown className="h-4 w-4" />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem asChild>
//                   <Link to="/door-to-door">Door-to-Door</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to="/car-to-another-state">Ship car to Another State</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to="/cross-country-car-shipping">Cross Country Car Shipping</Link>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors focus:outline-none">
//                 Who We Serve <ChevronDown className="h-4 w-4" />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>Individuals</DropdownMenuItem>
//                 <DropdownMenuItem>Businesses</DropdownMenuItem>
//                 <DropdownMenuItem>Military</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <a href="#why-choose-us" className="text-sm font-medium hover:text-primary transition-colors">
//               Why Choose Us
//             </a>
//             <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
//               Contact Us
//             </Link>
//           </nav>

//           {/* User Greeting / CTA Button Desktop */}
//           <div className="hidden md:block">
//             {isLoggedIn ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors focus:outline-none">
//                   Hi, {userName}! <ChevronDown className="h-4 w-4" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem asChild>
//                     <Link to="/profile">Profile</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <Link to="/login">
//                 <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 animate-fade-in">
//             <nav className="flex flex-col gap-4">
//               <Link to="/moving-cost-calculator" className="text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setIsMenuOpen(false)}>
//                   Moving cost calculator
//                 </Link>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setIsMenuOpen(false)}>
//                   Help
//                 </a>
//                 <hr className="border-border my-2" />

//               <a
//                 href="#how-it-works"
//                 className="text-sm font-medium hover:text-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 How It Works
//               </a>
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2 w-full text-left focus:outline-none">
//                   Transport Options <ChevronDown className="h-4 w-4" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem asChild>
//                     <Link to="/door-to-door" onClick={() => setIsMenuOpen(false)}>Door-to-Door</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link to="/ship-to-another-state" onClick={() => setIsMenuOpen(false)}>Ship car to Another State</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link to="/cross-country-car-shipping" onClick={() => setIsMenuOpen(false)}>Cross Country Car Shipping</Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2 w-full text-left focus:outline-none">
//                   Who We Serve <ChevronDown className="h-4 w-4" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>Individuals</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>Businesses</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>Military</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <a
//                 href="#why-choose-us"
//                 className="text-sm font-medium hover:text-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Why Choose Us
//               </a>
//               <Link
//                 to="/contact"
//                 className="text-sm font-medium hover:text-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact Us
//               </Link>
//               {isLoggedIn ? (
//                 <>
//                   <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
//                     Profile
//                   </Link>
//                   <Button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-primary hover:bg-primary/90 mt-2">
//                     Logout
//                   </Button>
//                 </>
//               ) : (
//                 <Link to="/login">
//                   <Button className="bg-primary hover:bg-primary/90 mt-2">Get Started</Button>
//                 </Link>
//               )}
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const userName = user?.firstName || "User";
  const isLoggedIn = !isLoading && isAuthenticated;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end h-10 gap-6 text-xs">
            <Link
              to="/moving-cost-calculator"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Moving cost calculator
            </Link>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Help
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="AutoShip Pro" className="h-35 w-15" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors focus:outline-none">
                Transport Options <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/door-to-door">Door-to-Door</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/car-to-another-state">
                    Ship car to Another State
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cross-country-car-shipping">
                    Cross Country Car Shipping
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors focus:outline-none">
                Who We Serve <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Individuals</DropdownMenuItem>
                <DropdownMenuItem>Businesses</DropdownMenuItem>
                <DropdownMenuItem>Military</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a
              href="#why-choose-us"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Why Choose Us
            </a>

            <Link
              to="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* User Greeting / CTA Button Desktop */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors focus:outline-none">
                  Hi, {userName}! <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link
                to="/moving-cost-calculator"
                className="text-sm text-muted-foreground hover:text-foreground py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Moving cost calculator
              </Link>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </a>
              <hr className="border-border my-2" />

              <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2 w-full text-left focus:outline-none">
                  Transport Options <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/door-to-door"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Door-to-Door
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/car-to-another-state"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Ship car to Another State
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/cross-country-car-shipping"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cross Country Car Shipping
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2 w-full text-left focus:outline-none">
                  Who We Serve <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
                    Individuals
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
                    Businesses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
                    Military
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a
                href="#why-choose-us"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Why Choose Us
              </a>

              <Link
                to="/contact"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-primary hover:bg-primary/90 mt-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/90 mt-2">
                    Get Started
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
