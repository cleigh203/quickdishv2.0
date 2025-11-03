import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Extract token_hash and type from URL params
        const token = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        console.log('Auth confirm - token:', !!token, 'type:', type, 'email:', email);

        // Validate required parameters
        if (!token || !type) {
          console.error('Missing required parameters:', { token: !!token, type: !!type });
          setStatus('error');
          setErrorMessage('Invalid verification link. Missing required parameters.');
          return;
        }

        // Verify the OTP using Supabase
        console.log('Verifying OTP...');
        const { data, error } = await supabase.auth.verifyOtp({
          email: email || undefined, // Optional for email confirmation
          token: token,
          type: type as any,
        });

        if (error) {
          console.error('OTP verification error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Failed to verify email. Please try again.');
          return;
        }

        // Success!
        console.log('Email verified successfully:', data);
        setStatus('success');
        
        // Wait 2 seconds to show success message, then redirect
        setTimeout(() => {
          // Redirect to home page if user is authenticated, otherwise to auth
          if (data?.user) {
            navigate('/', { replace: true });
          } else {
            navigate('/auth', { replace: true });
          }
        }, 2000);
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to verify email. Please try again.');
      }
    };

    handleEmailVerification();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-muted">
            {status === 'verifying' && (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-3xl font-bold">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified! 🎉'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {status === 'verifying' && (
            <p className="text-muted-foreground">
              Please wait while we confirm your email address...
            </p>
          )}

          {status === 'success' && (
            <>
              <p className="text-muted-foreground">
                Your email has been verified successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <p className="text-muted-foreground mb-4">
                {errorMessage}
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirm;

