import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png"; // Assuming logo is still used

const PasswordChanged = () => {
  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-8">
            {/* Icon from Figma: Orange lock */}
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="#FF7A00" fillOpacity="0.1"/>
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11V13" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4C10.3431 4 9 5.34315 9 7V9H15V7C15 5.34315 13.6569 4 12 4Z" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Password changed!
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            You can proceed to sign in
          </p>

          <Link to="/login" className="w-full">
            <Button type="button" className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6">
              Sign in &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordChanged;
