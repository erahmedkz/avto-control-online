
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Car, 
  Battery, 
  Fuel, 
  AlertTriangle, 
  Map, 
  Shield, 
  ArrowRight,
  Wrench 
} from "lucide-react";
import { Link } from "react-router-dom";

interface Alert {
  id: string;
  vehicleId: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
  read: boolean;
  resolved: boolean;
}

interface Vehicle {
  id: string;
  name: string;
  model: string;
}

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    batteryLow: true,
    fuelLow: true,
    maintenance: true,
    security: true,
    location: true,
    email: true,
    push: true,
    sms: false
  });
  
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch vehicles
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from("vehicles")
          .select("id, name, model")
          .eq("user_id", user.id);
        
        if (vehiclesError) throw vehiclesError;
        
        setVehicles(vehiclesData);
        
        // Generate mock alerts for each vehicle
        if (vehiclesData && vehiclesData.length > 0) {
          const mockAlerts: Alert[] = [];
          const alertTypes = ["warning", "error", "info"];
          const alertMessages = [
            "Низкий уровень топлива",
            "Низкий заряд аккумулятора",
            "Необходимо техническое обслуживание",
            "Обнаружено движение автомобиля",
            "Низкое давление в шинах"
          ];
          
          vehiclesData.forEach(vehicle => {
            // Generate 0-3 alerts per vehicle
            const alertCount = Math.floor(Math.random() * 4);
            
            for (let i = 0; i < alertCount; i++) {
              const type = alertTypes[Math.floor(Math.random() * alertTypes.length)] as "warning" | "error" | "info";
              const message = alertMessages[Math.floor(Math.random() * alertMessages.length)];
              
              mockAlerts.push({
                id: `alert-${vehicle.id}-${i}`,
                vehicleId: vehicle.id,
                type,
                message,
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(), // Within the last week
                read: Math.random() > 0.5,
                resolved: Math.random() > 0.7
              });
            }
          });
          
          // Sort by timestamp (newest first)
          mockAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          setAlerts(mockAlerts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleAlertResolve = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
    
    toast.success("Оповещение помечено как решенное");
  };
  
  const handleAlertMarkAllRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, read: true }))
    );
    
    toast.success("Все оповещения помечены как прочитанные");
  };
  
  const handleSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast.success(`Настройка "${setting}" ${value ? "включена" : "выключена"}`);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full py-20">
          <div className="animate-pulse text-gray-400 dark:text-gray-500">
            Загрузка данных...
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Оповещения и уведомления
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Управление оповещениями и настройка уведомлений
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">Активные оповещения</CardTitle>
                  <CardDescription>
                    Последние оповещения от ваших автомобилей
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAlertMarkAllRead}>
                  Пометить все как прочитанные
                </Button>
              </CardHeader>
              <CardContent>
                {alerts.length > 0 ? (
                  <div className="space-y-4">
                    {alerts
                      .filter(alert => !alert.resolved)
                      .map(alert => (
                        <AlertItem 
                          key={alert.id} 
                          alert={alert} 
                          vehicle={vehicles.find(v => v.id === alert.vehicleId)}
                          onResolve={handleAlertResolve}
                        />
                      ))}
                    
                    {alerts.filter(alert => !alert.resolved).length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        Нет активных оповещений
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Нет новых оповещений
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">История оповещений</CardTitle>
                <CardDescription>
                  Ранее решенные оповещения
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.filter(alert => alert.resolved).length > 0 ? (
                  <div className="space-y-4">
                    {alerts
                      .filter(alert => alert.resolved)
                      .slice(0, 5)
                      .map(alert => (
                        <div 
                          key={alert.id} 
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60"
                        >
                          <AlertItem 
                            alert={alert} 
                            vehicle={vehicles.find(v => v.id === alert.vehicleId)}
                            resolved
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Нет решенных оповещений
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Notification Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Настройки уведомлений</CardTitle>
                <CardDescription>
                  Настройте способы получения уведомлений
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Типы уведомлений</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Battery className="h-4 w-4 text-amber-500" />
                      <Label htmlFor="battery">Низкий заряд аккумулятора</Label>
                    </div>
                    <Switch 
                      id="battery" 
                      checked={notificationSettings.batteryLow}
                      onCheckedChange={(checked) => handleSettingChange('batteryLow', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-red-500" />
                      <Label htmlFor="fuel">Низкий уровень топлива</Label>
                    </div>
                    <Switch 
                      id="fuel" 
                      checked={notificationSettings.fuelLow}
                      onCheckedChange={(checked) => handleSettingChange('fuelLow', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="maintenance">Техническое обслуживание</Label>
                    </div>
                    <Switch 
                      id="maintenance" 
                      checked={notificationSettings.maintenance}
                      onCheckedChange={(checked) => handleSettingChange('maintenance', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <Label htmlFor="security">Безопасность</Label>
                    </div>
                    <Switch 
                      id="security" 
                      checked={notificationSettings.security}
                      onCheckedChange={(checked) => handleSettingChange('security', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Map className="h-4 w-4 text-purple-500" />
                      <Label htmlFor="location">Изменение местоположения</Label>
                    </div>
                    <Switch 
                      id="location" 
                      checked={notificationSettings.location}
                      onCheckedChange={(checked) => handleSettingChange('location', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Способы получения</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Электронная почта</Label>
                    <Switch 
                      id="email" 
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => handleSettingChange('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push">Push-уведомления</Label>
                    <Switch 
                      id="push" 
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => handleSettingChange('push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms">SMS</Label>
                    <Switch 
                      id="sms" 
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => handleSettingChange('sms', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Сохранить настройки</Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Ваши автомобили</CardTitle>
                <CardDescription>
                  Управляйте настройками уведомлений для каждого автомобиля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vehicles.length > 0 ? (
                    vehicles.map(vehicle => (
                      <Link 
                        key={vehicle.id} 
                        to={`/vehicles/${vehicle.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <Car className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.model}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      У вас пока нет автомобилей
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/vehicles" className="w-full">
                  <Button variant="outline" className="w-full">
                    Управление автомобилями
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface AlertItemProps {
  alert: Alert;
  vehicle?: Vehicle;
  resolved?: boolean;
  onResolve?: (alertId: string) => void;
}

const AlertItem = ({ alert, vehicle, resolved = false, onResolve }: AlertItemProps) => {
  const alertTypeIcons = {
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    error: <AlertTriangle className="h-5 w-5 text-red-500" />,
    info: <Bell className="h-5 w-5 text-blue-500" />,
  };
  
  const formattedDate = new Date(alert.timestamp).toLocaleString('ru-RU', {
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const getVehicleRoute = (vehicleId?: string) => {
    if (!vehicleId) return "/vehicles";
    
    // Determine the appropriate route based on the alert message
    if (alert.message.includes("топлив")) {
      return `/control/${vehicleId}`;
    } else if (alert.message.includes("аккумулятор")) {
      return `/control/${vehicleId}`;
    } else if (alert.message.includes("обслуживание")) {
      return `/vehicles/${vehicleId}`;
    } else if (alert.message.includes("движени")) {
      return `/map`;
    } else {
      return `/vehicles/${vehicleId}`;
    }
  };
  
  return (
    <div className={`flex items-start space-x-4 p-3 rounded-md ${
      !alert.read && !resolved ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-transparent'
    }`}>
      <div>
        {alertTypeIcons[alert.type]}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <p className="font-medium text-gray-900 dark:text-white">
            {vehicle ? vehicle.name : 'Неизвестный автомобиль'}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {alert.message}
        </p>
        
        {!resolved && onResolve && (
          <div className="mt-2 flex justify-between items-center">
            <Link 
              to={getVehicleRoute(vehicle?.id)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Перейти к решению
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onResolve(alert.id)}
              className="text-xs h-7 px-2"
            >
              Пометить как решенное
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
