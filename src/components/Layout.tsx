
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Home, 
  User, 
  LogOut, 
  Car, 
  Map, 
  Settings, 
  Bell,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Закрыть сайдбар при изменении маршрута
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Проверка аутентификации
  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/vehicles", "/control", "/settings", "/map"];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
    
    if (isProtectedRoute && !user) {
      window.location.href = "/login";
    }
  }, [location, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Вы успешно вышли из системы");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Ошибка при выходе из системы");
    }
  };

  // Если пользователь не авторизован, показываем только основной контент
  if (!user && location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register") {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Мобильная кнопка для открытия/закрытия сайдбара */}
      {user && isMobile && (
        <button 
          className={`fixed z-50 top-4 left-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md transition-all ${sidebarOpen ? 'left-[280px]' : 'left-4'}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      
      {/* Боковая навигация - только для авторизованных пользователей */}
      {user && (
        <nav 
          className={`fixed md:static z-40 h-full transition-all duration-300 ease-in-out ${
            isMobile 
              ? sidebarOpen ? 'left-0' : '-left-[280px]' 
              : 'left-0'
          } w-[280px] md:w-64 bg-white dark:bg-gray-800 shadow-lg`}
        >
          <div className="px-6 py-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-car-blue dark:text-white">
                АвтоКонтроль
              </h2>
              <Car className="text-car-blue dark:text-white" size={24} />
            </div>
            
            <ul className="mt-10 space-y-4 flex-1">
              <NavItem 
                to="/dashboard" 
                icon={<Home size={20} />} 
                label="Главная" 
                active={location.pathname === "/dashboard"} 
              />
              <NavItem 
                to="/vehicles" 
                icon={<Car size={20} />} 
                label="Автомобили" 
                active={location.pathname.startsWith("/vehicles")} 
              />
              <NavItem 
                to="/control" 
                icon={<Settings size={20} />} 
                label="Управление" 
                active={location.pathname.startsWith("/control")} 
              />
              <NavItem 
                to="/map" 
                icon={<Map size={20} />} 
                label="Карта" 
                active={location.pathname === "/map"} 
              />
              <NavItem 
                to="/profile" 
                icon={<User size={20} />} 
                label="Профиль" 
                active={location.pathname === "/profile"} 
              />
            </ul>
            
            <div className="mt-auto">
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center w-full justify-start gap-2 py-2 text-gray-600 dark:text-gray-300 hover:text-car-blue dark:hover:text-white"
              >
                <LogOut size={20} />
                <span>Выйти</span>
              </Button>
            </div>
          </div>
        </nav>
      )}
      
      {/* Основной контент */}
      <div className={`flex-1 transition-all duration-300 ${
        user && isMobile && sidebarOpen ? 'ml-[280px]' : ''
      }`}>
        {user && (
          <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {getPageTitle(location.pathname)}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <Bell size={18} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-car-red"></span>
              </button>
              <ThemeToggle />
            </div>
          </header>
        )}
        
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          active 
            ? "bg-blue-50 text-car-blue dark:bg-gray-700 dark:text-white" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

function getPageTitle(pathname: string): string {
  switch (true) {
    case pathname === "/dashboard":
      return "Панель приборов";
    case pathname.startsWith("/vehicles"):
      return "Автомобили";
    case pathname.startsWith("/control"):
      return "Управление";
    case pathname === "/map":
      return "Карта";
    case pathname === "/profile":
      return "Профиль";
    case pathname === "/settings":
      return "Настройки";
    default:
      return "АвтоКонтроль";
  }
}
