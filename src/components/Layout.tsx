
import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Home, 
  User, 
  LogOut, 
  Car, 
  Map, 
  Settings, 
  Bell 
} from "lucide-react";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  // Проверка аутентификации
  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/vehicles", "/control", "/settings"];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
    
    if (isProtectedRoute && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [location, isAuthenticated]);

  // Если пользователь не авторизован, показываем только основной контент
  if (!isAuthenticated && location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register") {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Боковая навигация - только для авторизованных пользователей */}
      {isAuthenticated && (
        <nav className="w-20 md:w-64 bg-white dark:bg-gray-800 shadow-md">
          <div className="px-4 py-6">
            <h2 className="text-xl font-bold text-car-blue dark:text-white hidden md:block">
              АвтоКонтроль
            </h2>
            <div className="md:hidden flex justify-center">
              <Car className="text-car-blue dark:text-white" size={32} />
            </div>
            
            <ul className="mt-8 space-y-2">
              <NavItem 
                to="/dashboard" 
                icon={<Home />} 
                label="Главная" 
                active={location.pathname === "/dashboard"} 
              />
              <NavItem 
                to="/vehicles" 
                icon={<Car />} 
                label="Автомобили" 
                active={location.pathname.startsWith("/vehicles")} 
              />
              <NavItem 
                to="/control" 
                icon={<Settings />} 
                label="Управление" 
                active={location.pathname.startsWith("/control")} 
              />
              <NavItem 
                to="/map" 
                icon={<Map />} 
                label="Карта" 
                active={location.pathname === "/map"} 
              />
              <NavItem 
                to="/profile" 
                icon={<User />} 
                label="Профиль" 
                active={location.pathname === "/profile"} 
              />
            </ul>
            
            <div className="absolute bottom-4 left-0 w-20 md:w-64 px-4">
              <button 
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                className="flex items-center w-full p-2 text-gray-600 dark:text-gray-300 hover:text-car-blue dark:hover:text-white rounded-md"
              >
                <LogOut className="h-5 w-5 mx-auto md:mx-0" />
                <span className="ml-3 hidden md:block">Выйти</span>
              </button>
            </div>
          </div>
        </nav>
      )}
      
      {/* Основной контент */}
      <div className="flex-1">
        {isAuthenticated && (
          <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center">
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
        
        <main className="p-6">
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
        className={`flex items-center p-2 rounded-md ${
          active 
            ? "bg-blue-50 text-car-blue dark:bg-gray-700 dark:text-white" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <span className="mx-auto md:mx-0">{icon}</span>
        <span className="ml-3 hidden md:block">{label}</span>
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
