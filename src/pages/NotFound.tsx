import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a Stripe success redirect - redirect IMMEDIATELY
    const searchParams = new URLSearchParams(location.search);
    const hasStripeParams = 
      searchParams.has('session_id') || 
      searchParams.has('payment_intent') || 
      searchParams.has('payment_intent_client_secret') ||
      searchParams.get('status') === 'success' ||
      location.pathname.includes('success') ||
      location.pathname.includes('checkout') ||
      location.pathname.includes('billing') ||
      location.pathname.includes('payment') ||
      location.pathname.includes('stripe') ||
      location.pathname.includes('subscribe');

    if (hasStripeParams) {
      // Redirect to premium success page IMMEDIATELY
      navigate('/premium/success', { replace: true });
      return;
    }

    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
