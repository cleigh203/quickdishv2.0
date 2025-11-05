import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the code from URL params (Supabase PKCE flow)
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('Auth callback - code:', !!code, 'error:', error);

        // Handle errors from Supabase
        if (error) {
          console.error('Auth error from Supabase:', error, errorDescription);
          setStatus('error');
          setErrorMessage(errorDescription || 'Failed to verify your email. Please try again.');
          return;
        }

        // Exchange code for session (PKCE flow)
        if (code) {
          console.log('Exchanging code for session...');
          const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            setStatus('error');
            setErrorMessage(exchangeError.message || 'Failed to verify email');
            return;
          }

          // Success! Wait a moment for auth state to propagate
          console.log('Email verified successfully', data);
          setStatus('success');
          
          // Wait for auth state to propagate, then reload the app to ensure everything refreshes
          setTimeout(async () => {
            // Force refresh session to ensure AuthContext picks it up
            await supabase.auth.getSession();
            
            // Reload the entire app to ensure all state is fresh
            window.location.href = '/profile-setup';
          }, 2000);
          return;
        }

        // Fallback 1: Try token_hash flow for email confirmation links
        const tokenHash = searchParams.get('token_hash');
        const tokenType = searchParams.get('type');

        console.log('Token hash flow - token:', !!tokenHash, 'type:', tokenType);

        if (tokenHash && tokenType) {
          // Verify OTP with token_hash
          console.log('Verifying OTP with token_hash...');
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: tokenType as any,
          });

          if (verifyError) {
            console.error('OTP verification error:', verifyError);
            setStatus('error');
            setErrorMessage(verifyError.message || 'Failed to verify email');
            return;
          }

          console.log('OTP verification successful', data);
          setStatus('success');
          
          // Wait for auth state to propagate, then reload the app
          setTimeout(async () => {
            // Force refresh session to ensure AuthContext picks it up
            await supabase.auth.getSession();
            
            // Reload the entire app to ensure all state is fresh
            window.location.href = '/';
          }, 2000);
          return;
        }

        // Fallback 2: Try hash-based flow for older links
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        console.log('Hash flow - type:', type, 'has token:', !!accessToken);

        if (type && accessToken) {
          // Set session from hash-based flow
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });

          if (sessionError) {
            throw sessionError;
          }

          console.log('Hash-based verification successful');
          setStatus('success');
          
          // Wait for auth state to propagate, then reload the app
          setTimeout(async () => {
            // Force refresh session to ensure AuthContext picks it up
            await supabase.auth.getSession();
            
            // Reload the entire app to ensure all state is fresh
            window.location.href = '/profile-setup';
          }, 2000);
          return;
        }

        // No valid callback found
        console.error('No valid auth callback found');
        setStatus('error');
        setErrorMessage('Invalid verification link. Please request a new one.');
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
                Redirecting you to complete your profile...
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
                  onClick={() => navigate('/auth/confirm-email')}
                  className="w-full"
                >
                  Resend Verification Email
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
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

export default AuthCallback;



