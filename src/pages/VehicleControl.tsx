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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Car,
  Lock,
  Unlock,
  Power,
  Thermometer,
  Fan,
  Lightbulb,
  Music,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  Siren,
} from "lucide-react";
import { Vehicle } from "@/lib/types";
import { getVehicle } from "@/lib/mock-data";

const VehicleControl = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [climate, setClimate] = useState({
    isOn: false,
    temperature: 20,
  });
  const [doors, setDoors] = useState({
    locked: true,
    frontLeftOpen: false,
    frontRightOpen: false,
    rearLeftOpen: false,
    rearRightOpen: false,
    trunkOpen: false,
  });
  const [engine, setEngine] = useState({
    isOn: false,
  });
  const [lights, setLights] = useState({
    isOn: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        if (!id) return;

        const vehicleData = getVehicle(id);

        if (vehicleData) {
          setVehicle(vehicleData);
          setClimate(vehicleData.climate);
          setDoors(vehicleData.doors);
          setEngine(vehicleData.engine);
          setLights({ isOn: false });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных автомобиля:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [id]);

  const handleToggleDoors = () => {
    const newState = { ...doors, locked: !doors.locked };
    setDoors(newState);
    
    toast({
      title: newState.locked ? "Двери заблокированы" : "Двери разблокированы",
      description: `Все двери ${newState.locked ? "заблокированы" : "разблокированы"} успешно`,
    });
  };

  const handleToggleEngine = () => {
    const newState = { ...engine, isOn: !engine.isOn };
    setEngine(newState);
    
    toast({
      title: newState.isOn ? "Двигатель запущен" : "Двигатель остановлен",
      description: `Двигатель успешно ${newState.isOn ? "запущен" : "остановлен"}`,
    });
  };

  const handleToggleClimate = () => {
    const newState = { ...climate, isOn: !climate.isOn };
    setClimate(newState);
    
    toast({
      title: newState.isOn ? "Климат-контроль включен" : "Климат-контроль выключен",
      description: `Установлена температура ${climate.temperature}°C`,
    });
  };

  const handleTemperatureChange = (value: number[]) => {
    const newTemp = value[0];
    setClimate({ ...climate, temperature: newTemp });
  };

  const handleToggleLights = () => {
    const newState = { ...lights, isOn: !lights.isOn };
    setLights(newState);
    
    toast({
      title: newState.isOn ? "Свет включен" : "Свет выключен",
      description: newState.isOn ? "Фары автомобиля включены" : "Фары автомобиля выключены",
    });
  };

  const handleHonk = () => {
    toast({
      title: "Сигнал активирован",
      description: "Сигнал автомобиля активирован на 2 секунды",
    });
  };

  const handleFindCar = () => {
    toast({
      title: "Поиск автомобиля",
      description: "Активирован режим поиска автомобиля",
    });
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
          <Link to={`/vehicles/${id}`} className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление: {vehicle.make} {vehicle.model}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основные функции</CardTitle>
                <CardDescription>
                  Управление ключевыми функциями автомобиля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ControlCard
                    title="Двери"
                    icon={doors.locked ? <Lock className="h-10 w-10" /> : <Unlock className="h-10 w-10" />}
                    status={doors.locked ? "Заблокированы" : "Разблокированы"}
                    statusColor={doors.locked ? "text-green-500" : "text-yellow-500"}
                    onToggle={handleToggleDoors}
                    buttonText={doors.locked ? "Разблокировать" : "Заблокировать"}
                    buttonVariant={doors.locked ? "outline" : "default"}
                  />

                  <ControlCard
                    title="Двигатель"
                    icon={<Power className="h-10 w-10" />}
                    status={engine.isOn ? "Запущен" : "Выключен"}
                    statusColor={engine.isOn ? "text-green-500" : "text-gray-500"}
                    onToggle={handleToggleEngine}
                    buttonText={engine.isOn ? "Выключить" : "Запустить"}
                    buttonVariant={engine.isOn ? "outline" : "default"}
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="climate">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="climate">Климат</TabsTrigger>
                <TabsTrigger value="lights">Освещение</TabsTrigger>
                <TabsTrigger value="media">Медиа</TabsTrigger>
                <TabsTrigger value="security">Безопасность</TabsTrigger>
              </TabsList>

              <TabsContent value="climate" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Климат-контроль</CardTitle>
                    <CardDescription>
                      Управление климатической системой автомобиля
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Thermometer className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium">Климат-контроль</span>
                      </div>
                      <Switch
                        checked={climate.isOn}
                        onCheckedChange={handleToggleClimate}
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Температура
                          </span>
                          <span className="font-medium">{climate.temperature}°C</span>
                        </div>
                        <Slider
                          defaultValue={[climate.temperature]}
                          min={16}
                          max={30}
                          step={0.5}
                          onValueChange={handleTemperatureChange}
                          disabled={!climate.isOn}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">16°C</span>
                          <span className="text-xs text-gray-500">30°C</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                          variant="outline"
                          className="flex items-center justify-center"
                          disabled={!climate.isOn}
                        >
                          <Fan className="h-5 w-5 mr-2" />
                          Вентиляция
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center"
                          disabled={!climate.isOn}
                        >
                          Обогрев стекол
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lights" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Освещение</CardTitle>
                    <CardDescription>
                      Управление системой освещения
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lightbulb 
                          className={`h-5 w-5 mr-2 ${lights.isOn ? "text-yellow-500" : "text-gray-600 dark:text-gray-300"}`} 
                        />
                        <span className="font-medium">Наружное освещение</span>
                      </div>
                      <Switch
                        checked={lights.isOn}
                        onCheckedChange={handleToggleLights}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center"
                        disabled={!lights.isOn}
                      >
                        Дальний свет
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center"
                        disabled={!lights.isOn}
                      >
                        Противотуманные
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center"
                        disabled={!lights.isOn}
                      >
                        Салон
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center"
                        disabled={!lights.isOn}
                      >
                        Габариты
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Медиа</CardTitle>
                    <CardDescription>
                      Управление аудиосистемой автомобиля
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <Music className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Медиа-система будет доступна в ближайшем обновлении
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Безопасность</CardTitle>
                    <CardDescription>
                      Функции безопасности и защиты автомобиля
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center"
                        onClick={handleHonk}
                      >
                        <Siren className="h-5 w-5 mr-2" />
                        Активировать сигнал
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center"
                        onClick={handleFindCar}
                      >
                        <MapPin className="h-5 w-5 mr-2" />
                        Найти автомобиль
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center md:col-span-2"
                      >
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Экстренный вызов
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Статус автомобиля
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatusItem
                  label="Двери"
                  value={doors.locked ? "Заблокированы" : "Разблокированы"}
                  isActive={doors.locked}
                />
                <StatusItem
                  label="Двигатель"
                  value={engine.isOn ? "Запущен" : "Выключен"}
                  isActive={engine.isOn}
                />
                <StatusItem
                  label="Климат-контроль"
                  value={climate.isOn ? `Включен (${climate.temperature}°C)` : "Выключен"}
                  isActive={climate.isOn}
                />
                <StatusItem
                  label="Освещение"
                  value={lights.isOn ? "Включено" : "Выключено"}
                  isActive={lights.isOn}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full flex items-center justify-center"
                  onClick={handleToggleDoors}
                >
                  {doors.locked ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Разблокировать двери
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Заблокировать двери
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleToggleEngine}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {engine.isOn ? "Выключить двигатель" : "Запустить двигатель"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Открыть багажник
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Журнал действий</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <LogItem
                    action="Вход в систему"
                    time={getTimeAgo(30)}
                  />
                  <LogItem
                    action="Запрос местоположения"
                    time={getTimeAgo(120)}
                  />
                  <LogItem
                    action="Двигатель включен"
                    time={getTimeAgo(180)}
                  />
                  <LogItem
                    action="Двери заблокированы"
                    time={getTimeAgo(185)}
                  />
                  <LogItem
                    action="Климат-контроль выключен"
                    time={getTimeAgo(240)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ControlCardProps {
  title: string;
  icon: React.ReactNode;
  status: string;
  statusColor: string;
  onToggle: () => void;
  buttonText: string;
  buttonVariant?: "default" | "outline";
}

const ControlCard = ({
  title,
  icon,
  status,
  statusColor,
  onToggle,
  buttonText,
  buttonVariant = "default",
}: ControlCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className={`text-sm ${statusColor} font-medium mt-1`}>{status}</p>
      </div>
      <Button
        onClick={onToggle}
        variant={buttonVariant}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  value: string;
  isActive: boolean;
}

const StatusItem = ({ label, value, isActive }: StatusItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className={`font-medium ${isActive ? "text-green-500" : "text-gray-500"}`}>
        {value}
      </span>
    </div>
  );
};

interface LogItemProps {
  action: string;
  time: string;
}

const LogItem = ({ action, time }: LogItemProps) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
      <span className="text-sm text-gray-800 dark:text-gray-200">{action}</span>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
};

function getTimeAgo(minutesAgo: number): string {
  if (minutesAgo < 60) {
    return `${minutesAgo} мин. назад`;
  } else {
    const hours = Math.floor(minutesAgo / 60);
    const minutes = minutesAgo % 60;
    return `${hours} ч. ${minutes > 0 ? `${minutes} мин.` : ""} назад`;
  }
}

export default VehicleControl;
