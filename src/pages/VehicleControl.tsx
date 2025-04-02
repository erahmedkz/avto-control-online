
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Power, Lock, Thermometer, Fan, LightbulbOff, Navigation, Zap, ArrowUpCircle } from "lucide-react";

const VehicleControl = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [engineStarted, setEngineStarted] = useState(false);
  const [doorsLocked, setDoorsLocked] = useState(true);
  const [temperature, setTemperature] = useState(22);
  const [lightsOn, setLightsOn] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchVehicle = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        if (data) {
          setVehicle(data);
          console.log("Loaded vehicle:", data);
          
          // Устанавливаем начальные значения на основе данных из БД
          setDoorsLocked(data.status === 'Locked' || data.status === 'Parked');
          setEngineStarted(data.status === 'Running');
        }
      } catch (error: any) {
        console.error("Error fetching vehicle:", error);
        toast.error("Ошибка загрузки данных автомобиля");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicle();
  }, [id, user]);

  const updateVehicleStatus = async (status: string) => {
    if (!id || !user) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status, last_updated: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating vehicle status:", error);
      toast.error("Ошибка обновления статуса автомобиля");
    }
  };

  const handleEngineToggle = () => {
    const newState = !engineStarted;
    setEngineStarted(newState);
    const status = newState ? 'Running' : 'Parked';
    updateVehicleStatus(status);
    toast.success(newState ? "Двигатель запущен" : "Двигатель остановлен");
  };

  const handleDoorsToggle = () => {
    const newState = !doorsLocked;
    setDoorsLocked(newState);
    const status = newState ? 'Locked' : 'Unlocked';
    updateVehicleStatus(status);
    toast.success(newState ? "Двери заблокированы" : "Двери разблокированы");
  };

  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
    toast.success(`Температура установлена на ${value}°C`);
  };

  const handleLightsToggle = () => {
    const newState = !lightsOn;
    setLightsOn(newState);
    toast.success(newState ? "Фары включены" : "Фары выключены");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-opacity-30 border-t-primary rounded-full"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center my-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Автомобиль не найден</h2>
        <p className="text-gray-600 dark:text-gray-400">Запрашиваемый автомобиль не существует или у вас нет к нему доступа.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{vehicle.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{vehicle.model}, {vehicle.year}</p>
      </div>

      <Tabs defaultValue="основное" className="w-full">
        <TabsList className="grid grid-cols-3 lg:w-[400px] mb-8">
          <TabsTrigger value="основное">Основное</TabsTrigger>
          <TabsTrigger value="климат">Климат</TabsTrigger>
          <TabsTrigger value="системы">Системы</TabsTrigger>
        </TabsList>

        <TabsContent value="основное" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Power className="text-primary" />
                  Двигатель
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Текущий статус: {engineStarted ? "Запущен" : "Остановлен"}</p>
                  <Button
                    className={`w-full py-6 text-lg flex items-center justify-center gap-2 ${
                      engineStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={handleEngineToggle}
                  >
                    <Power size={24} />
                    {engineStarted ? "Остановить" : "Запустить"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="text-primary" />
                  Двери
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Текущий статус: {doorsLocked ? "Заблокированы" : "Разблокированы"}</p>
                  <Button
                    className={`w-full py-6 text-lg flex items-center justify-center gap-2 ${
                      doorsLocked ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                    onClick={handleDoorsToggle}
                  >
                    <Lock size={24} />
                    {doorsLocked ? "Разблокировать" : "Заблокировать"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="климат" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="text-primary" />
                  Температура
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold mb-6">{temperature}°C</div>
                  <div className="flex gap-4 w-full justify-center">
                    <Button 
                      onClick={() => handleTemperatureChange(Math.max(16, temperature - 1))}
                      variant="outline"
                      className="text-xl w-12 h-12"
                    >
                      -
                    </Button>
                    <Button 
                      onClick={() => handleTemperatureChange(Math.min(30, temperature + 1))}
                      variant="outline"
                      className="text-xl w-12 h-12"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fan className="text-primary" />
                  Вентиляция
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-16">Слабая</Button>
                  <Button variant="outline" className="h-16">Средняя</Button>
                  <Button variant="outline" className="h-16">Сильная</Button>
                  <Button variant="outline" className="h-16">Авто</Button>
                  <Button variant="outline" className="h-16">Обдув</Button>
                  <Button variant="outline" className="h-16">Стекло</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="системы" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LightbulbOff className="text-primary" />
                  Освещение
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className={`w-full py-4 flex items-center justify-center gap-2 ${
                    lightsOn ? "bg-yellow-500 hover:bg-yellow-600" : "bg-slate-700 hover:bg-slate-800"
                  }`}
                  onClick={handleLightsToggle}
                >
                  {lightsOn ? "Выключить фары" : "Включить фары"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="text-primary" />
                  Местоположение
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full py-4">
                  Найти автомобиль
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-primary" />
                  Диагностика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full py-4">
                  Запустить проверку
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Статус соединения */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        Соединение установлено
        <span className="text-xs ml-2">Последнее обновление: {new Date(vehicle.last_updated).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default VehicleControl;
