
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Battery, 
  Fuel, 
  Gauge, 
  Calendar, 
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddVehicleDialog } from "@/components/AddVehicleDialog";

interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  color?: string;
  status?: string;
  licensePlate?: string;
  batteryLevel?: number;
  fuelLevel?: number;
  mileage?: number;
  lastService?: {
    date: string;
    type: string;
  };
  image?: string;
  location?: string;
}

const VehiclesList = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      // Transform data to match the Vehicle interface
      const transformedVehicles = data.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color || "Не указан",
        status: vehicle.status || "offline",
        licensePlate: "А123БВ77", // Temporary value
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
    } catch (error: any) {
      console.error("Ошибка при загрузке автомобилей:", error);
      toast.error("Не удалось загрузить список автомобилей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ваши автомобили
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Управляйте и мониторьте состояние ваших автомобилей
          </p>
        </div>
        <AddVehicleDialog onVehicleAdded={fetchVehicles} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-opacity-30 border-t-primary rounded-full"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-xl mb-2">
                У вас пока нет автомобилей
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Добавьте свой первый автомобиль для начала работы с системой мониторинга и управления.
              </p>
              <AddVehicleDialog onVehicleAdded={fetchVehicles} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const getStatusBadge = () => {
    switch (vehicle.status) {
      case "online":
        return <Badge className="bg-green-500">В сети</Badge>;
      case "offline":
        return <Badge variant="outline" className="text-gray-500">Не в сети</Badge>;
      case "maintenance":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">На обслуживании</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-48 overflow-hidden">
        <img
          src={vehicle.image || "https://via.placeholder.com/400x200"}
          alt={`${vehicle.make || vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {vehicle.name}
            </CardTitle>
            <CardDescription>{vehicle.model}, {vehicle.year}, {vehicle.color}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 mr-3">
              <Battery className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Батарея</p>
              <p className="font-medium">{vehicle.batteryLevel}%</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 mr-3">
              <Fuel className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Топливо</p>
              <p className="font-medium">{vehicle.fuelLevel}%</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 mr-3">
              <Gauge className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Пробег</p>
              <p className="font-medium">{vehicle.mileage} км</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 mr-3">
              <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">ТО</p>
              <p className="font-medium">
                {vehicle.lastService ? formatDate(vehicle.lastService.date).split(' ').slice(0, 2).join(' ') : "Нет данных"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-sm">
          <p className="font-medium">Гос. номер: {vehicle.licensePlate || "Не указан"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={`/vehicles/${vehicle.id}`} className="flex-1 mr-2">
          <Button variant="outline" className="w-full">
            Подробнее
          </Button>
        </Link>
        <Link to={`/control/${vehicle.id}`} className="flex-1 ml-2">
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Управление
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehiclesList;
