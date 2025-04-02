
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VehiclesList from "./pages/VehiclesList";
import VehicleDetail from "./pages/VehicleDetail";
import VehicleControl from "./pages/VehicleControl";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Check theme on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else {
      // If theme is not saved, check system settings
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes with Layout */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehiclesList />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/control/:id" element={<VehicleControl />} />
              <Route path="/control" element={<VehicleControl />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/map" element={<Map />} />
              <Route path="/settings" element={<Settings />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
