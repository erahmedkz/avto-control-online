
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
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
  Calendar 
} from "lucide-react";
import { Vehicle } from "@/lib/types";
import { getVehiclesByUser } from "@/lib/mock-data";

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Получаем пользователя из локального хранилища
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("Пользователь не найден");
        }
        
        const user = JSON.parse(storedUser);
        
        // Получаем автомобили пользователя (в реальном приложении это будет API запрос)
        const userVehicles = getVehiclesByUser(user.id);
        setVehicles(userVehicles);
      } catch (error) {
        console.error("Ошибка при загрузке автомобилей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ваши автомобили
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Управляйте и мониторьте состояние ваших автомобилей
            </p>
          </div>
          <Button className="mt-4 md:mt-0">
            Добавить автомобиль
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500">Загрузка...</div>
          </div>
        ) : vehicles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                У вас пока нет автомобилей
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Добавьте свой первый автомобиль для начала работы с системой.
              </p>
              <Button>Добавить автомобиль</Button>
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
    </Layout>
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={vehicle.image || "https://via.placeholder.com/400x200"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {vehicle.make} {vehicle.model}
            </CardTitle>
            <CardDescription>{vehicle.year}, {vehicle.color}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
              <Battery className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Батарея</p>
              <p className="font-medium">{vehicle.batteryLevel}%</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
              <Fuel className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Топливо</p>
              <p className="font-medium">{vehicle.fuelLevel}%</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
              <Gauge className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Пробег</p>
              <p className="font-medium">{vehicle.mileage} км</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">ТО</p>
              <p className="font-medium">
                {vehicle.lastService ? formatDate(vehicle.lastService.date).split(' ').slice(0, 2).join(' ') : "Нет данных"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm">
          <p className="font-medium">Гос. номер: {vehicle.licensePlate}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={`/vehicles/${vehicle.id}`} className="flex-1 mr-2">
          <Button variant="outline" className="w-full">
            Подробнее
          </Button>
        </Link>
        <Link to={`/control/${vehicle.id}`} className="flex-1 ml-2">
          <Button className="w-full">
            Управление
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehiclesList;
