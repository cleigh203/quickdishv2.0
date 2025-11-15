import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
const logo = '/logo.svg';
import { supabase } from '@/integrations/supabase/client';

const signUpSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
  confirmPassword: z.string(),
  displayName: z.string().trim().min(1, 'Display name required').max(50, 'Name too long'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});

const resetPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

type ViewType = 'welcome' | 'signup' | 'signin' | 'reset' | 'verify';

const Auth = () => {
  const [view, setView] = useState<ViewType>('welcome');
  const [loading, setLoading] = useState(false);
  const { user, signUp, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeToTerms: false,
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [resetEmail, setResetEmail] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = signUpSchema.parse(signUpData);
      const { data, error } = await signUp(validated.email, validated.password, validated.displayName);

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: 'Account exists',
            description: 'This email is already registered. Please sign in instead.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Sign up failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        // Check if email confirmation is disabled (session exists immediately)
        if (data?.session) {
          toast({
            title: 'Account created!',
            description: 'Welcome to QuickDish!',
          });
          navigate('/');
        } else {
          // Email confirmation is enabled, redirect to confirm email page
          navigate(`/auth/confirm-email?email=${encodeURIComponent(validated.email)}`);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verifyEmail) return;
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: verifyEmail });
      if (error) {
        toast({ title: 'Could not resend', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Email sent', description: 'Check your inbox for the verification link.' });
      }
    } catch (e: any) {
      toast({ title: 'Could not resend', description: e.message, variant: 'destructive' });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = signInSchema.parse(signInData);
      const { error } = await signIn(validated.email, validated.password);

      if (error) {
        // Check if it's an unverified email error
        if ((error as any).code === 'EMAIL_NOT_VERIFIED') {
          toast({
            title: 'Email not verified',
            description: error.message,
            variant: 'destructive',
            action: {
              label: 'Resend',
              onClick: () => navigate(`/auth/confirm-email?email=${encodeURIComponent((error as any).email)}`)
            }
          });
        } else {
          toast({
            title: 'Sign in failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = resetPasswordSchema.parse({ email: resetEmail });
      const { error } = await resetPassword(validated.email);

      if (error) {
        toast({
          title: 'Reset failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Check your email',
          description: 'Password reset link has been sent',
        });
        setView('signin');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    navigate('/');
  };

  if (view === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Quick Dish" 
              className="h-24 w-24 object-contain"
              loading="eager"
              fetchpriority="high"
              decoding="sync"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            </div>
            <CardTitle className="text-3xl">Welcome to Quick Dish</CardTitle>
            <CardDescription>Cook Smarter Not Harder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => setView('signup')} className="w-full" size="lg">
              Sign Up
            </Button>
            <Button onClick={() => setView('signin')} variant="outline" className="w-full" size="lg">
              Log In
            </Button>
            <Button onClick={handleContinueAsGuest} variant="ghost" className="w-full" size="lg">
              Continue as Guest
            </Button>
            
            {/* Footer Links */}
            <div className="pt-4 border-t mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <a href="/about" className="hover:text-primary hover:underline">
                About
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-primary hover:underline">
                Terms
              </a>
              <span>•</span>
              <a href="/privacy" className="hover:text-primary hover:underline">
                Privacy
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up to save your recipes and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    placeholder="Chef John"
                    value={signUpData.displayName}
                    onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={signUpData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setSignUpData({ ...signUpData, agreeToTerms: checked as boolean })
                  }
                  required
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                  I agree to the{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="text-primary hover:underline"
                >
                  Log in
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to {verifyEmail}. Click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleResendVerification}>
              Resend verification email
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Verified already?
              <button
                type="button"
                onClick={() => setView('signin')}
                className="text-primary hover:underline ml-1"
              >
                Sign in
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'signin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access your recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setView('reset')}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Auth;
