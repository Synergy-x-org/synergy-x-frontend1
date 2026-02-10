import { Link } from "react-router-dom"; // Import Link

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/moving-cost-calculator" className="hover:text-primary transition-colors">
                  Moving Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-primary transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#why-choose-us" className="hover:text-primary transition-colors">
                  Why SynergyX
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* Transport options */}
          <div>
            <h3 className="font-bold text-lg mb-4">Transport options</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/door-to-door" className="hover:text-primary transition-colors">
                  Door-to-Door
                </Link>
              </li>
              <li>
                <Link to="/car-to-another-state" className="hover:text-primary transition-colors">
                  Ship Car to Another State
                </Link>
              </li>
              <li>
                <Link to="/cross-country-car-shipping" className="hover:text-primary transition-colors">
                  Cross Country Car Shipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Synergy X Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Synergy X</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>2501 NE 23rd Street Suite A388</li>
              <li>Oklahoma City, OK 73111</li>
              <li>admin@synergyxtransportation.com</li>
              <li>
                <h3 className="font-bold text-lg mb-4">Reviews</h3>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Google Reviews
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="font-bold text-lg mb-4">Synergy</h1>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <p>© 2025 Synergy. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
