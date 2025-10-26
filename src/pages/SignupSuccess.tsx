import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png"; // Assuming logo is still used

const SignupSuccess = () => {
  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-8">
            {/* Icon from Figma: Orange person with checkmark */}
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#FF7A00" fillOpacity="0.1"/>
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="#FF7A00"/>
              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#FF7A00"/>
              <path d="M16.5 7.5L10.5 13.5L8.5 11.5" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Congratulations!
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Your account has successfully been created.
          </p>

          <Link to="/confirm-email" className="w-full">
            <Button type="button" className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6">
              Continue &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
