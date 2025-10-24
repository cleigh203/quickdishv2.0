import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Premium = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      <div className="sticky top-0 z-40 glass-card border-b">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Premium</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Premium temporarily unavailable</h2>
        <p className="text-muted-foreground">We currently offer ad-supported access to premium features.</p>
      </div>
    </div>
  );
};

export default Premium;
