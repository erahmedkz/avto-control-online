
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { 
  User, 
  Car, 
  Bell, 
  Battery, 
  Fuel, 
  MapPin,
  AlertTriangle,
  Info,
  XCircle,
  ArrowRight
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { mockVehicles, mockAlerts, getVehiclesByUser, getAllAlertsByUser } from "@/lib/mock-data";
import { Vehicle, Alert, User as UserType } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Only proceed if we have a logged-in user
    if (!user) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setUserProfile({
            id: profileData.id,
            name: profileData.name || user.email?.split('@')[0] || "Пользователь",
            email: profileData.email || user.email || "",
            avatar: profileData.avatar || null
          });
        }

        // Fetch vehicles from Supabase
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id);
          
        if (vehiclesError) {
          console.error("Error fetching vehicles:", vehiclesError);
          
          // Fallback to mock data on error
          const mockUserVehicles = getVehiclesByUser(user.id);
          setVehicles(mockUserVehicles);
        } else if (vehiclesData && vehiclesData.length > 0) {
          // Transform data to match Vehicle interface
          const transformedVehicles = vehiclesData.map(vehicle => ({
            id: vehicle.id,
            name: vehicle.name,
            model: vehicle.model,
            make: vehicle.model.split(' ')[0],
            year: vehicle.year,
            color: vehicle.color || "Не указан",
            status: vehicle.status || "offline",
            licensePlate: "А123БВ77",
            batteryLevel: Math.floor(Math.random() * 100),
            fuelLevel: Math.floor(Math.random() * 100),
            mileage: Math.floor(Math.random() * 50000),
            lastService: {
              date: new Date().toISOString(),
              type: "ТО-1"
            },
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop"
          }));
          
          setVehicles(transformedVehicles);
        } else {
          // If no vehicles in DB, use mock data
          const mockUserVehicles = getVehiclesByUser(user.id);
          setVehicles(mockUserVehicles);
        }
        
        // Get mock alerts - would be replaced with real alerts from Supabase
        const userAlerts = getAllAlertsByUser(user.id);
        setAlerts(userAlerts);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить информацию о пользователе и автомобилях",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
    
    // Simulate getting a new alert
    const timer = setTimeout(() => {
      toast({
        title: "Новое оповещение",
        description: "Низкий уровень топлива в BMW X5",
        variant: "destructive",
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [user, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full py-20">
          <div className="animate-pulse text-gray-400 dark:text-gray-500">
            Загрузка...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Приветствие */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Добро пожаловать, {userProfile?.name || user?.email?.split('@')[0] || "Пользователь"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Вот обзор состояния ваших автомобилей
              </p>
            </div>
            <Link to="/profile">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.name} className="h-12 w-12 rounded-full" />
                ) : (
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </div>
            </Link>
          </div>
        </section>
        
        {/* Обзор автомобилей */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Ваши автомобили
            </h3>
            <Link to="/vehicles">
              <Button variant="outline" className="text-sm">
                Все автомобили
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
        
        {/* Последние оповещения */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Последние оповещения
            </h3>
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                Все оповещения
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Оповещения и уведомления</CardTitle>
              <CardDescription>
                Важная информация о состоянии ваших автомобилей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.length > 0 ? alerts.slice(0, 3).map((alert) => (
                <AlertItem key={alert.id} alert={alert} vehicle={vehicles.find(v => v.id === alert.vehicleId)} />
              )) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Нет новых оповещений
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link to="/settings" className="w-full">
                <Button variant="outline" className="w-full">
                  Показать все оповещения
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
        
        {/* Быстрые действия */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Быстрые действия
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionButton 
              icon={<Car />} 
              label="Управление" 
              description="Открыть/закрыть, завести"
              link={vehicles.length > 0 ? `/control/${vehicles[0].id}` : "/vehicles"}
            />
            <ActionButton 
              icon={<MapPin />} 
              label="Найти" 
              description="Где мой автомобиль?"
              link="/map"
            />
            <ActionButton 
              icon={<Bell />} 
              label="Оповещения" 
              description="Настройка уведомлений"
              link="/settings"
            />
            <ActionButton 
              icon={<User />} 
              label="Профиль" 
              description="Настройки аккаунта"
              link="/profile"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

// Компоненты

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  let statusColor;
  let statusText;
  
  switch (vehicle.status) {
    case "online":
      statusColor = "text-green-500 dark:text-green-400";
      statusText = "В сети";
      break;
    case "offline":
      statusColor = "text-gray-500 dark:text-gray-400";
      statusText = "Не в сети";
      break;
    case "maintenance":
      statusColor = "text-yellow-500 dark:text-yellow-400";
      statusText = "На обслуживании";
      break;
    default:
      statusColor = "text-gray-500 dark:text-gray-400";
      statusText = "Неизвестно";
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 overflow-hidden">
        <img 
          src={vehicle.image || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d"}
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{`${vehicle.make} ${vehicle.model}`}</CardTitle>
          <span className={`text-sm font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>
        <CardDescription>{vehicle.licensePlate}, {vehicle.year}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Battery className="h-4 w-4 mr-1" />
              <span>Батарея</span>
            </div>
            <Progress value={vehicle.batteryLevel} className="h-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {vehicle.batteryLevel}%
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Fuel className="h-4 w-4 mr-1" />
              <span>Топливо</span>
            </div>
            <Progress value={vehicle.fuelLevel} className="h-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {vehicle.fuelLevel}%
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/vehicles/${vehicle.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Подробнее
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

interface AlertItemProps {
  alert: Alert;
  vehicle?: Vehicle;
}

const AlertItem = ({ alert, vehicle }: AlertItemProps) => {
  const alertTypeIcons = {
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };
  
  const formattedDate = new Date(alert.timestamp).toLocaleString('ru-RU', {
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  return (
    <div className={`flex items-start space-x-4 p-3 rounded-md ${alert.read ? 'bg-transparent' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
      <div>
        {alertTypeIcons[alert.type]}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <p className="font-medium text-gray-900 dark:text-white">
            {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Неизвестный автомобиль'}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {alert.message}
        </p>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  link: string;
}

const ActionButton = ({ icon, label, description, link }: ActionButtonProps) => {
  return (
    <Link to={link}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col items-center text-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-car-blue dark:text-blue-400 mb-2">
            {icon}
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;
