import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { DevTools } from "@/components/DevTools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { RecipesProvider } from "@/contexts/RecipesContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OfflineBanner } from "@/components/OfflineBanner";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { LoadingScreen } from "@/components/LoadingScreen";

// Eager load critical pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load non-critical pages
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Generate = lazy(() => import("./pages/Generate"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const Favorites = lazy(() => import("./pages/Favorites"));
const SavedRecipes = lazy(() => import("./pages/SavedRecipes"));
const Shopping = lazy(() => import("./pages/Shopping"));
const Pantry = lazy(() => import("./pages/Pantry"));
const Profile = lazy(() => import("./pages/Profile"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const About = lazy(() => import("./pages/About"));
const Help = lazy(() => import("./pages/Help"));
const Premium = lazy(() => import("./pages/Premium"));
const PremiumSuccess = lazy(() => import("./pages/PremiumSuccess"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages (rarely used)
const Admin = lazy(() => import("./pages/Admin"));
const AdminRecipes = lazy(() => import("./pages/AdminRecipes"));
const GenerateDessertImages = lazy(() => import("./pages/GenerateDessertImages"));
const GenerateNewRecipeImages = lazy(() => import("./pages/GenerateNewRecipeImages"));
const BatchRegenerateImages = lazy(() => import("./pages/BatchRegenerateImages"));
const CustomRegenerateImages = lazy(() => import("./pages/CustomRegenerateImages"));
const QuickImageUpdate = lazy(() => import("./pages/QuickImageUpdate"));
const MigrateRecipes = lazy(() => import("./pages/MigrateRecipes"));
const RegenerateImages = lazy(() => import("./pages/RegenerateImages"));
const GenerateRecipeImages = lazy(() => import("./pages/GenerateRecipeImages"));
const ExecuteImageGeneration = lazy(() => import("./pages/ExecuteImageGeneration"));

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const userKey = user?.id || "anon";

  return (
    <OnboardingProvider>
      <RecipesProvider>
        <OfflineBanner />
        <InstallPrompt />
        <OnboardingFlow />
        <Toaster />
        <Sonner />
        <DevTools />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/confirm-email" element={<Suspense fallback={<LoadingScreen />}><ConfirmEmail /></Suspense>} />
            <Route path="/auth/callback" element={<Suspense fallback={<LoadingScreen />}><AuthCallback /></Suspense>} />
            <Route path="/auth/reset-password" element={<Suspense fallback={<LoadingScreen />}><ResetPassword /></Suspense>} />
            <Route path="/profile-setup" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><ProfileSetup /></Suspense></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute allowGuest><Index /></ProtectedRoute>} />
            <Route
              path="/generate"
              element={
                <ProtectedRoute allowGuest>
                  <Suspense fallback={<LoadingScreen />}>
                    <Generate key={`generate-${userKey}`} />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute allowGuest>
                  <Suspense fallback={<LoadingScreen />}>
                    <Generate key={`discover-${userKey}`} />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipe/:id"
              element={<ProtectedRoute allowGuest><Suspense fallback={<LoadingScreen />}><RecipeDetail /></Suspense></ProtectedRoute>}
            />
            <Route path="/favorites" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><Favorites /></Suspense></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><SavedRecipes /></Suspense></ProtectedRoute>} />
            <Route path="/shopping" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><Shopping /></Suspense></ProtectedRoute>} />
            <Route path="/pantry" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><Pantry /></Suspense></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><Profile /></Suspense></ProtectedRoute>} />
            <Route path="/privacy" element={<Suspense fallback={<LoadingScreen />}><Privacy /></Suspense>} />
            <Route path="/terms" element={<Suspense fallback={<LoadingScreen />}><Terms /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<LoadingScreen />}><About /></Suspense>} />
            <Route path="/help" element={<Suspense fallback={<LoadingScreen />}><Help /></Suspense>} />
            <Route path="/premium" element={<ProtectedRoute allowGuest><Suspense fallback={<LoadingScreen />}><Premium /></Suspense></ProtectedRoute>} />
            <Route path="/premium/success" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><PremiumSuccess /></Suspense></ProtectedRoute>} />
            <Route path="/admin" element={<Suspense fallback={<LoadingScreen />}><Admin /></Suspense>} />
            <Route path="/admin/recipes" element={<Suspense fallback={<LoadingScreen />}><AdminRecipes /></Suspense>} />
            <Route path="/admin/generate-dessert-images" element={<Suspense fallback={<LoadingScreen />}><GenerateDessertImages /></Suspense>} />
            <Route path="/admin/generate-onepot-images" element={<Suspense fallback={<LoadingScreen />}><GenerateNewRecipeImages /></Suspense>} />
            <Route path="/migrate-recipes" element={<Suspense fallback={<LoadingScreen />}><MigrateRecipes /></Suspense>} />
            <Route path="/regenerate-images" element={<Suspense fallback={<LoadingScreen />}><RegenerateImages /></Suspense>} />
            <Route path="/batch-regenerate-images" element={<Suspense fallback={<LoadingScreen />}><BatchRegenerateImages /></Suspense>} />
            <Route path="/custom-regenerate-images" element={<Suspense fallback={<LoadingScreen />}><CustomRegenerateImages /></Suspense>} />
            <Route path="/quick-image-update" element={<Suspense fallback={<LoadingScreen />}><QuickImageUpdate /></Suspense>} />
            <Route path="/generate-recipe-images" element={<Suspense fallback={<LoadingScreen />}><GenerateRecipeImages /></Suspense>} />
            <Route path="/execute-image-generation" element={<Suspense fallback={<LoadingScreen />}><ExecuteImageGeneration /></Suspense>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Suspense fallback={<LoadingScreen />}><NotFound /></Suspense>} />
          </Routes>
        </Suspense>
      </RecipesProvider>
    </OnboardingProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
