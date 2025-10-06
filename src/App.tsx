import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OfflineBanner } from "@/components/OfflineBanner";
import { InstallPrompt } from "@/components/InstallPrompt";
import Index from "./pages/Index";
import Generate from "./pages/Generate";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import SavedRecipes from "./pages/SavedRecipes";
import Shopping from "./pages/Shopping";
import Pantry from "./pages/Pantry";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import PremiumSuccess from "./pages/PremiumSuccess";
import Admin from "./pages/Admin";
import AdminRecipes from "./pages/AdminRecipes";
import GenerateDessertImages from "./pages/GenerateDessertImages";
import GenerateNewRecipeImages from "./pages/GenerateNewRecipeImages";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import ProfileSetup from "./pages/ProfileSetup";

import BatchRegenerateImages from "./pages/BatchRegenerateImages";
import MigrateRecipes from "./pages/MigrateRecipes";
import RegenerateImages from "./pages/RegenerateImages";
import GenerateRecipeImages from "./pages/GenerateRecipeImages";
import ExecuteImageGeneration from "./pages/ExecuteImageGeneration";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <OfflineBanner />
        <InstallPrompt />
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute allowGuest><Index /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute allowGuest><Generate /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute allowGuest><Generate /></ProtectedRoute>} />
          <Route path="/recipe/:id" element={<ProtectedRoute allowGuest><RecipeDetail /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedRecipes /></ProtectedRoute>} />
          <Route path="/shopping" element={<ProtectedRoute><Shopping /></ProtectedRoute>} />
          <Route path="/pantry" element={<ProtectedRoute><Pantry /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute allowGuest><Premium /></ProtectedRoute>} />
          <Route path="/premium/success" element={<ProtectedRoute><PremiumSuccess /></ProtectedRoute>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/recipes" element={<AdminRecipes />} />
          <Route path="/admin/generate-dessert-images" element={<GenerateDessertImages />} />
          <Route path="/admin/generate-onepot-images" element={<GenerateNewRecipeImages />} />
            <Route path="/migrate-recipes" element={<MigrateRecipes />} />
            <Route path="/regenerate-images" element={<RegenerateImages />} />
            <Route path="/generate-recipe-images" element={<GenerateRecipeImages />} />
            <Route path="/execute-image-generation" element={<ExecuteImageGeneration />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
