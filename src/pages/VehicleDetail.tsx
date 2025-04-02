
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Car,
  Battery,
  Fuel,
  Gauge,
  Calendar,
  Thermometer,
  Lock,
  Unlock,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Vehicle, Alert } from "@/lib/types";
import { getVehicle, getAlertsByVehicle } from "@/lib/mock-data";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        if (!id) return;

        // В реальном приложении это будет API запрос
        const vehicleData = getVehicle(id);
        const vehicleAlerts = getAlertsByVehicle(id);

        if (vehicleData) {
          setVehicle(vehicleData);
          setAlerts(vehicleAlerts);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных автомобиля:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 dark:text-gray-500">Загрузка...</div>
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Автомобиль не найден
          </h2>
          <Link to="/vehicles">
            <Button>Вернуться к списку</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center mb-4">
          <Link to="/vehicles" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {vehicle.make} {vehicle.model}
          </h1>
          <StatusBadge status={vehicle.status} className="ml-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка с изображением и основной информацией */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="h-64 md:h-80 overflow-hidden">
                <img
                  src={vehicle.image || "https://via.placeholder.com/800x400"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Основная информация
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <InfoItem
                    icon={<Car className="h-5 w-5" />}
                    label="Модель"
                    value={`${vehicle.make} ${vehicle.model}`}
                  />
                  <InfoItem
                    icon={<Calendar className="h-5 w-5" />}
                    label="Год выпуска"
                    value={vehicle.year.toString()}
                  />
                  <InfoItem
                    icon={<Gauge className="h-5 w-5" />}
                    label="Пробег"
                    value={`${vehicle.mileage} км`}
                  />
                  <InfoItem
                    icon={<Car className="h-5 w-5" />}
                    label="Гос. номер"
                    value={vehicle.licensePlate}
                  />
                  <InfoItem
                    icon={<Calendar className="h-5 w-5" />}
                    label="Цвет"
                    value={vehicle.color}
                  />
                  <InfoItem
                    icon={<Lock className="h-5 w-5" />}
                    label="Статус дверей"
                    value={vehicle.doors.locked ? "Заблокированы" : "Открыты"}
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="status">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="status">Состояние</TabsTrigger>
                <TabsTrigger value="history">История</TabsTrigger>
                <TabsTrigger value="service">Обслуживание</TabsTrigger>
              </TabsList>
              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle>Текущее состояние</CardTitle>
                    <CardDescription>
                      Актуальная информация о состоянии автомобиля
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                          <Battery className="mr-2 h-5 w-5" />
                          Батарея
                        </h3>
                        <Progress value={vehicle.batteryLevel} className="h-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {vehicle.batteryLevel}% заряда
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                          <Fuel className="mr-2 h-5 w-5" />
                          Топливо
                        </h3>
                        <Progress value={vehicle.fuelLevel} className="h-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {vehicle.fuelLevel}% топлива
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                        Климат-контроль
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                          <Thermometer className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Температура
                            </p>
                            <p className="font-medium">
                              {vehicle.climate.temperature}°C
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Статус
                          </p>
                          <p className="font-medium">
                            {vehicle.climate.isOn ? "Включен" : "Выключен"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                        Двигатель
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Статус
                          </p>
                          <p className="font-medium">
                            {vehicle.engine.isOn ? "Запущен" : "Выключен"}
                          </p>
                        </div>
                        {vehicle.engine.temperature !== undefined && (
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                            <Thermometer className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Температура
                              </p>
                              <p className="font-medium">
                                {vehicle.engine.temperature}°C
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                        Состояние дверей
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DoorStatus
                          label="Передняя левая"
                          isOpen={vehicle.doors.frontLeftOpen}
                          isLocked={vehicle.doors.locked}
                        />
                        <DoorStatus
                          label="Передняя правая"
                          isOpen={vehicle.doors.frontRightOpen}
                          isLocked={vehicle.doors.locked}
                        />
                        <DoorStatus
                          label="Задняя левая"
                          isOpen={vehicle.doors.rearLeftOpen}
                          isLocked={vehicle.doors.locked}
                        />
                        <DoorStatus
                          label="Задняя правая"
                          isOpen={vehicle.doors.rearRightOpen}
                          isLocked={vehicle.doors.locked}
                        />
                        <DoorStatus
                          label="Багажник"
                          isOpen={vehicle.doors.trunkOpen}
                          isLocked={vehicle.doors.locked}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>История поездок</CardTitle>
                    <CardDescription>
                      Информация о недавних поездках
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                      История поездок будет доступна в ближайшем обновлении
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="service">
                <Card>
                  <CardHeader>
                    <CardTitle>Техническое обслуживание</CardTitle>
                    <CardDescription>
                      История и план технического обслуживания
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {vehicle.lastService ? (
                      <>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                            Последнее ТО
                          </h3>
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Дата
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  vehicle.lastService.date
                                ).toLocaleDateString("ru-RU")}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Пробег
                              </p>
                              <p className="font-medium">
                                {vehicle.lastService.mileage} км
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Тип
                              </p>
                              <p className="font-medium">
                                {vehicle.lastService.type}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                            Следующее ТО
                          </h3>
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Рекомендуемый пробег
                              </p>
                              <p className="font-medium">
                                {vehicle.lastService.mileage + 10000} км
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Осталось
                              </p>
                              <p className="font-medium">
                                {vehicle.lastService.mileage + 10000 - vehicle.mileage} км
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Нет информации о техническом обслуживании
                      </p>
                    )}

                    <div className="flex justify-center pt-4">
                      <Button>
                        Запланировать ТО
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Правая боковая колонка с местоположением и оповещениями */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Местоположение</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicle.location ? (
                  <>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Карта будет доступна в ближайшем обновлении
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Координаты
                        </p>
                        <p className="font-medium">
                          {vehicle.location.latitude.toFixed(6)},{" "}
                          {vehicle.location.longitude.toFixed(6)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Последнее обновление
                        </p>
                        <p className="font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(
                            vehicle.location.lastUpdated
                          ).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        На карте
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Нет данных о местоположении
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Оповещения</CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <AlertItem key={alert.id} alert={alert} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Нет активных оповещений
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/control/${vehicle.id}`} className="w-full">
                  <Button className="w-full">
                    Управление автомобилем
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  {vehicle.doors.locked ? "Разблокировать двери" : "Заблокировать двери"}
                </Button>
                <Button variant="outline" className="w-full">
                  Диагностика
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Компоненты

interface StatusBadgeProps {
  status: "online" | "offline" | "maintenance";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  let badgeProps = {};

  switch (status) {
    case "online":
      badgeProps = { className: "bg-green-500" };
      break;
    case "offline":
      badgeProps = { variant: "outline", className: "text-gray-500" };
      break;
    case "maintenance":
      badgeProps = { className: "bg-yellow-500" };
      break;
  }

  const statusText = {
    online: "В сети",
    offline: "Не в сети",
    maintenance: "На обслуживании",
  };

  return (
    <Badge {...badgeProps} className={className}>
      {statusText[status]}
    </Badge>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  return (
    <div className="flex items-start">
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

interface DoorStatusProps {
  label: string;
  isOpen: boolean;
  isLocked: boolean;
}

const DoorStatus = ({ label, isOpen, isLocked }: DoorStatusProps) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      <div className="flex items-center">
        {isLocked ? (
          <Lock className="h-4 w-4 text-green-500 mr-1.5" />
        ) : (
          <Unlock className="h-4 w-4 text-yellow-500 mr-1.5" />
        )}
        <p className="font-medium">
          {isOpen ? "Открыта" : isLocked ? "Заблокирована" : "Закрыта"}
        </p>
      </div>
    </div>
  );
};

interface AlertItemProps {
  alert: Alert;
}

const AlertItem = ({ alert }: AlertItemProps) => {
  const alertTypeIcons = {
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    error: <AlertTriangle className="h-5 w-5 text-red-500" />,
    info: <AlertTriangle className="h-5 w-5 text-blue-500" />,
  };

  const formattedDate = new Date(alert.timestamp).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start p-3 rounded-md ${
        alert.read ? "bg-transparent" : "bg-blue-50 dark:bg-blue-900/20"
      }`}
    >
      <div className="mr-3">{alertTypeIcons[alert.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{alert.message}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default VehicleDetail;
