import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="AutoShip Pro" className="h-10 w-10 brightness-0 invert" />
              <span className="text-xl font-bold">AutoShip Pro</span>
            </div>
            <p className="text-background/80 mb-4">
              Reliable auto transport services across the United States. Fast, secure, and affordable.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Transport Way, City, ST 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@autoship-pro.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Get a Quote
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Track Shipment
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Transport Options</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  Open Transport
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  Enclosed Transport
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  Door-to-Door
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Expedited Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Classic Car Transport
                </a>
              </li>
            </ul>
          </div>

          {/* Who We Serve */}
          <div>
            <h3 className="font-bold text-lg mb-4">Who We Serve</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Individuals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Dealerships
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Corporate Fleets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Military Personnel
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Snowbirds
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20 text-center text-background/60">
          <p>© 2024 AutoShip Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
