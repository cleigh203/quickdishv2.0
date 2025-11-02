import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PricingPlans from "@/components/PricingPlans";

const Premium = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      <div className="sticky top-0 z-40 glass-card border-b">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/discover')}
            className="text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Premium</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <PricingPlans />
      </div>
    </div>
  );
};

export default Premium;
