
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Car,
  MapPin,
  LocateFixed,
  Route,
  Layers,
  Home,
  MapPinned,
  Building
} from "lucide-react";
import { getVehiclesByUser } from "@/lib/mock-data";
import { Vehicle } from "@/lib/types";

const Map = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
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
        
        // Выбираем первый автомобиль по умолчанию
        if (userVehicles.length > 0) {
          setSelectedVehicle(userVehicles[0]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке автомобилей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 dark:text-gray-500">Загрузка...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Карта автомобилей
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Левая боковая панель с автомобилями */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ваши автомобили</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicles.map((vehicle) => (
                  <VehicleSelector
                    key={vehicle.id}
                    vehicle={vehicle}
                    isSelected={selectedVehicle?.id === vehicle.id}
                    onSelect={() => handleSelectVehicle(vehicle)}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Сохраненные места</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SavedLocation
                  icon={<Home className="h-5 w-5" />}
                  name="Дом"
                  address="ул. Пушкина, д. 10"
                />
                <SavedLocation
                  icon={<Building className="h-5 w-5" />}
                  name="Работа"
                  address="ул. Ленина, д. 25"
                />
                <SavedLocation
                  icon={<MapPinned className="h-5 w-5" />}
                  name="Дача"
                  address="пос. Сосновка, ул. Лесная, д. 5"
                />
                <Button variant="outline" className="w-full mt-3">
                  Добавить место
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Основная карта */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-12rem)]">
              <CardContent className="p-0 h-full relative">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center px-4">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                      Карта автомобилей будет доступна в ближайшем обновлении
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      Здесь вы сможете отслеживать местоположение всех ваших автомобилей
                    </p>
                    {selectedVehicle && selectedVehicle.location && (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg inline-block">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedVehicle.make} {selectedVehicle.model}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Координаты: {selectedVehicle.location.latitude.toFixed(6)},{" "}
                          {selectedVehicle.location.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Элементы управления картой */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <Button variant="secondary" size="icon" className="bg-white dark:bg-gray-800 shadow-md">
                    <LocateFixed className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="bg-white dark:bg-gray-800 shadow-md">
                    <Layers className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="bg-white dark:bg-gray-800 shadow-md">
                    <Route className="h-5 w-5" />
                  </Button>
                </div>

                {/* Информация о выбранном автомобиле */}
                {selectedVehicle && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base flex items-center">
                          <Car className="h-5 w-5 mr-2" />
                          {selectedVehicle.make} {selectedVehicle.model}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Статус
                            </p>
                            <p className="font-medium">
                              {selectedVehicle.status === "online" 
                                ? "В сети" 
                                : selectedVehicle.status === "offline"
                                ? "Не в сети"
                                : "На обслуживании"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Последнее обновление
                            </p>
                            <p className="font-medium">
                              {selectedVehicle.location
                                ? new Date(selectedVehicle.location.lastUpdated).toLocaleTimeString("ru-RU", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Неизвестно"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-3">
                          <Button size="sm" className="flex-1">
                            Проложить маршрут
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Подробнее
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Компоненты

interface VehicleSelectorProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: () => void;
}

const VehicleSelector = ({ vehicle, isSelected, onSelect }: VehicleSelectorProps) => {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Car className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {vehicle.make} {vehicle.model}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {vehicle.licensePlate}
          </p>
        </div>
        <div
          className={`h-2 w-2 rounded-full ${
            vehicle.status === "online"
              ? "bg-green-500"
              : vehicle.status === "maintenance"
              ? "bg-yellow-500"
              : "bg-gray-500"
          }`}
        ></div>
      </div>
    </div>
  );
};

interface SavedLocationProps {
  icon: React.ReactNode;
  name: string;
  address: string;
}

const SavedLocation = ({ icon, name, address }: SavedLocationProps) => {
  return (
    <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer">
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{address}</p>
      </div>
    </div>
  );
};

export default Map;
