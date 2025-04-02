
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Страницы
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VehiclesList from "./pages/VehiclesList";
import VehicleDetail from "./pages/VehicleDetail";
import VehicleControl from "./pages/VehicleControl";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Проверка темы при запуске приложения
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else {
      // Если тема не сохранена, проверяем системные настройки
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
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehicles" element={<VehiclesList />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/control/:id" element={<VehicleControl />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/map" element={<Map />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
