import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PremiumSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }

        // Check subscription status
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
        } else if (data?.subscribed) {
          toast.success("Premium activated!");
        }

        // Clean up URL parameters if present
        const hasParams = searchParams.toString();
        if (hasParams) {
          window.history.replaceState({}, '', '/premium/success');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkSubscription();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-emerald-700 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Success! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            You now have access to premium features!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => navigate('/generate')}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-emerald-700 hover:from-yellow-500 hover:to-emerald-800 text-white font-semibold"
            >
              Start Cooking
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="flex-1"
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumSuccess;
