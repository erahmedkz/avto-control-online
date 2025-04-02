
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Lock, 
  Unlock, 
  Power, 
  PowerOff, 
  Thermometer, 
  Fan, 
  Radio, 
  ArrowUp, 
  ArrowDown,
  Headphones,
  Fuel
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  model: string;
  make?: string;
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

const VehicleControl = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [temperature, setTemperature] = useState(22);
  const [fanSpeed, setFanSpeed] = useState(1);
  const [volume, setVolume] = useState(5);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          toast.error("Идентификатор автомобиля не указан");
          navigate("/vehicles");
          return;
        }
        
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();
        
        if (error) {
          console.error("Error fetching vehicle:", error);
          toast.error("Не удалось загрузить данные автомобиля");
          navigate("/vehicles");
          return;
        }
        
        // Transform data to match Vehicle interface
        const vehicleData: Vehicle = {
          id: data.id,
          name: data.name,
          model: data.model,
          make: data.model.split(' ')[0],
          year: data.year,
          color: data.color || "Не указан",
          status: data.status || "offline",
          licensePlate: "А123БВ77",
          batteryLevel: Math.floor(Math.random() * 100),
          fuelLevel: Math.floor(Math.random() * 100),
          mileage: Math.floor(Math.random() * 50000),
          lastService: {
            date: new Date().toISOString(),
            type: "ТО-1"
          },
          image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop"
        };
        
        setVehicle(vehicleData);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Произошла ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicle();
  }, [id, user, navigate]);
  
  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    toast.success(`Автомобиль ${!isLocked ? 'заблокирован' : 'разблокирован'}`);
  };
  
  const handleEngineToggle = () => {
    if (isLocked) {
      toast.error("Разблокируйте автомобиль перед запуском двигателя");
      return;
    }
    
    setIsEngineOn(!isEngineOn);
    toast.success(`Двигатель ${!isEngineOn ? 'запущен' : 'остановлен'}`);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full py-20">
          <div className="animate-pulse text-gray-400 dark:text-gray-500">
            Загрузка данных автомобиля...
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!vehicle) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Автомобиль не найден
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Автомобиль с указанным идентификатором не найден или у вас нет доступа к нему.
          </p>
          <Button onClick={() => navigate("/vehicles")}>
            Вернуться к списку автомобилей
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Управление: {vehicle.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {vehicle.make} {vehicle.model}, {vehicle.year}, {vehicle.color}
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className={`px-3 py-1 text-sm font-medium rounded-full 
              ${isEngineOn 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`
            }>
              {isEngineOn ? 'Двигатель запущен' : 'Двигатель остановлен'}
            </div>
            <div className={`px-3 py-1 text-sm font-medium rounded-full 
              ${!isLocked 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`
            }>
              {isLocked ? 'Заблокирован' : 'Разблокирован'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Image */}
          <Card className="lg:col-span-1">
            <div className="h-48 overflow-hidden rounded-t-lg">
              <img
                src={vehicle.image || "https://via.placeholder.com/400x200"}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{vehicle.name}</CardTitle>
              <CardDescription>
                {vehicle.licensePlate}, {vehicle.status === 'online' ? 'В сети' : 'Не в сети'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Топливо:</span>
                  <span className="font-medium">{vehicle.fuelLevel}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Батарея:</span>
                  <span className="font-medium">{vehicle.batteryLevel}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button
                variant={isLocked ? "destructive" : "outline"}
                size="lg"
                className="flex-1"
                onClick={handleLockToggle}
              >
                {isLocked ? <Unlock className="mr-2 h-5 w-5" /> : <Lock className="mr-2 h-5 w-5" />}
                {isLocked ? "Разблокировать" : "Заблокировать"}
              </Button>
              <Button
                variant={isEngineOn ? "destructive" : "default"}
                size="lg"
                className="flex-1"
                onClick={handleEngineToggle}
                disabled={isLocked}
              >
                {isEngineOn ? <PowerOff className="mr-2 h-5 w-5" /> : <Power className="mr-2 h-5 w-5" />}
                {isEngineOn ? "Заглушить" : "Запустить"}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Controls */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="climate" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="climate">Климат</TabsTrigger>
                <TabsTrigger value="media">Мультимедиа</TabsTrigger>
                <TabsTrigger value="additional">Дополнительно</TabsTrigger>
              </TabsList>
              
              <TabsContent value="climate" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Климат-контроль</CardTitle>
                    <CardDescription>
                      Управление температурой и вентиляцией в салоне
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Thermometer className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Температура</span>
                        </div>
                        <div className="text-xl font-medium">{temperature}°C</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setTemperature(Math.max(16, temperature - 1))}
                          disabled={temperature <= 16 || isLocked}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-10 rounded-md relative">
                          <div 
                            className="absolute top-0 left-0 h-full bg-blue-500 rounded-md"
                            style={{ width: `${(temperature - 16) / (30 - 16) * 100}%` }}
                          ></div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setTemperature(Math.min(30, temperature + 1))}
                          disabled={temperature >= 30 || isLocked}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Fan className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Скорость вентилятора</span>
                        </div>
                        <div className="text-xl font-medium">{fanSpeed}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setFanSpeed(Math.max(0, fanSpeed - 1))}
                          disabled={fanSpeed <= 0 || isLocked}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-10 rounded-md relative">
                          <div 
                            className="absolute top-0 left-0 h-full bg-blue-500 rounded-md"
                            style={{ width: `${(fanSpeed) / 5 * 100}%` }}
                          ></div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setFanSpeed(Math.min(5, fanSpeed + 1))}
                          disabled={fanSpeed >= 5 || isLocked}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      disabled={isLocked}
                      onClick={() => {
                        toast.success(`Настройки климат-контроля обновлены`);
                      }}
                    >
                      Применить настройки
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="media" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Мультимедиа</CardTitle>
                    <CardDescription>
                      Управление аудиосистемой автомобиля
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Headphones className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Громкость</span>
                        </div>
                        <div className="text-xl font-medium">{volume}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setVolume(Math.max(0, volume - 1))}
                          disabled={volume <= 0 || isLocked}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-10 rounded-md relative">
                          <div 
                            className="absolute top-0 left-0 h-full bg-blue-500 rounded-md"
                            style={{ width: `${(volume) / 10 * 100}%` }}
                          ></div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setVolume(Math.min(10, volume + 1))}
                          disabled={volume >= 10 || isLocked}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Radio className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Источник</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant="outline" 
                          className={`${isLocked ? 'opacity-50' : ''}`}
                          disabled={isLocked}
                        >
                          Радио
                        </Button>
                        <Button 
                          variant="outline"
                          className={`${isLocked ? 'opacity-50' : ''}`}
                          disabled={isLocked}
                        >
                          Bluetooth
                        </Button>
                        <Button 
                          variant="outline"
                          className={`${isLocked ? 'opacity-50' : ''}`}
                          disabled={isLocked}
                        >
                          USB
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      disabled={isLocked}
                      onClick={() => {
                        toast.success(`Настройки мультимедиа обновлены`);
                      }}
                    >
                      Применить настройки
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="additional" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Дополнительные функции</CardTitle>
                    <CardDescription>
                      Прочие функции управления автомобилем
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        disabled={isLocked}
                        onClick={() => toast.success('Фары включены')}
                      >
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M2 12h2"></path><path d="M6 12h2"></path><path d="M10 12h2"></path>
                            <path d="M17.5 6.5L19 8"></path><path d="M17.5 17.5L19 16"></path>
                            <path d="M22 12h-4"></path><circle cx="14" cy="12" r="4"></circle>
                          </svg>
                        </div>
                        <span>Включить фары</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        disabled={isLocked}
                        onClick={() => toast.success('Обогрев сидений включен')}
                      >
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                          <Thermometer className="text-blue-500" />
                        </div>
                        <span>Обогрев сидений</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        disabled={isLocked}
                        onClick={() => toast.success('Автомобиль подаст звуковой сигнал')}
                      >
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                          </svg>
                        </div>
                        <span>Звуковой сигнал</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        disabled={isLocked}
                        onClick={() => toast.success('Багажник открыт')}
                      >
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                            <path d="M3 6h18"></path>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                          </svg>
                        </div>
                        <span>Открыть багажник</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleControl;
