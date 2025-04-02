
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Settings,
  Calendar,
  Clock,
  Fuel,
  Map as MapIcon,
  BarChart3,
  Wrench,
  Check,
  AlertTriangle,
  History
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VehicleDetails {
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
  lastUpdate?: string;
}

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Partial<VehicleDetails>>({});

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Transform data for UI
          const vehicleData: VehicleDetails = {
            id: data.id,
            name: data.name,
            model: data.model,
            year: data.year,
            color: data.color || "Не указан",
            status: data.status || "offline",
            licensePlate: "А123БВ77", // Default
            batteryLevel: 85,
            fuelLevel: 65,
            mileage: 28500,
            lastService: {
              date: new Date().toISOString(),
              type: "ТО-1"
            },
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop",
            location: "Москва, ул. Ленина 12",
            lastUpdate: data.last_updated || new Date().toISOString()
          };
          
          setVehicle(vehicleData);
          setEditedVehicle(vehicleData);
        }
      } catch (error: any) {
        console.error("Error fetching vehicle details:", error);
        toast.error("Не удалось загрузить данные автомобиля", {
          action: {
            label: "Вернуться к списку",
            onClick: () => navigate("/vehicles")
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleDetails();
  }, [id, user, navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      saveVehicleChanges();
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVehicle({
      ...editedVehicle,
      [name]: value
    });
  };

  const saveVehicleChanges = async () => {
    if (!id || !user || !vehicle) return;
    
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({
          name: editedVehicle.name,
          model: editedVehicle.model,
          year: editedVehicle.year,
          color: editedVehicle.color,
          last_updated: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      setVehicle({
        ...vehicle,
        ...editedVehicle,
        lastUpdate: new Date().toISOString()
      });
      
      toast.success("Данные автомобиля обновлены");
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      toast.error("Не удалось обновить данные автомобиля");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-opacity-30 border-t-primary rounded-full"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center my-10">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Автомобиль не найден</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Запрашиваемый автомобиль не существует или у вас нет к нему доступа.</p>
        <Button onClick={() => navigate("/vehicles")}>
          Вернуться к списку автомобилей
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        {/* Vehicle Image & Primary Info */}
        <div className="md:w-1/3 mb-6 md:mb-0">
          <Card className="overflow-hidden">
            <div className="h-60 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              {vehicle.image ? (
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Car className="h-20 w-20 text-white/70" />
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Название</label>
                      <input
                        type="text"
                        name="name"
                        value={editedVehicle.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Модель</label>
                      <input
                        type="text"
                        name="model"
                        value={editedVehicle.model}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Год выпуска</label>
                      <input
                        type="number"
                        name="year"
                        value={editedVehicle.year}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Цвет</label>
                      <input
                        type="text"
                        name="color"
                        value={editedVehicle.color}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold">{vehicle.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{vehicle.model}, {vehicle.year}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(vehicle.status)}
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                        {vehicle.color}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Последнее обновление:
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(vehicle.lastUpdate!).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </>
                )}
                
                <div className="pt-4">
                  <Button 
                    onClick={handleEditToggle} 
                    className="w-full"
                  >
                    {isEditing ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Сохранить изменения
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Редактировать данные
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Details */}
        <div className="md:w-2/3">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="info">Информация</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="service">Обслуживание</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Car className="mr-2 h-5 w-5 text-blue-500" />
                    Основная информация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Гос. номер" value={vehicle.licensePlate || "Не указан"} />
                    <InfoItem label="Пробег" value={`${vehicle.mileage?.toLocaleString() || 0} км`} />
                    <InfoItem label="Статус" value={getStatusText(vehicle.status)} />
                    <InfoItem label="Местоположение" value={vehicle.location || "Не определено"} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Fuel className="mr-2 h-5 w-5 text-blue-500" />
                    Топливо и энергия
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem 
                      label="Уровень топлива" 
                      value={`${vehicle.fuelLevel || 0}%`}
                      progressValue={vehicle.fuelLevel || 0}
                    />
                    <InfoItem 
                      label="Заряд батареи" 
                      value={`${vehicle.batteryLevel || 0}%`}
                      progressValue={vehicle.batteryLevel || 0}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={() => navigate(`/control/${vehicle.id}`)}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Settings className="mr-2 h-5 w-5" />
                Перейти к управлению
              </Button>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                    Статистика использования
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Статистика поездок будет доступна после начала использования автомобиля в системе</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="service" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Wrench className="mr-2 h-5 w-5 text-blue-500" />
                    История обслуживания
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-l-2 border-blue-500 pl-4 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blue-500"></div>
                      <h3 className="text-lg font-medium">ТО-1</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date().toLocaleDateString('ru-RU')}
                      </p>
                      <p className="mt-2">
                        Плановое техническое обслуживание. Замена масла, фильтров.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                    Планирование обслуживания
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Button variant="outline" className="mb-2">
                      Запланировать ТО
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Следующее ТО рекомендуется через 5000 км или 3 месяца
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

function InfoItem({ 
  label, 
  value, 
  progressValue 
}: { 
  label: string; 
  value: string; 
  progressValue?: number 
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      {progressValue !== undefined && (
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "online":
      return <Badge className="bg-green-500">В сети</Badge>;
    case "offline":
      return <Badge variant="outline" className="text-gray-500">Не в сети</Badge>;
    case "Running":
      return <Badge className="bg-green-500">Запущен</Badge>;
    case "Parked":
      return <Badge variant="outline" className="text-gray-500">Припаркован</Badge>;
    case "Locked":
      return <Badge variant="outline" className="text-blue-500">Заблокирован</Badge>;
    case "maintenance":
      return <Badge variant="secondary" className="bg-yellow-500 text-white">На обслуживании</Badge>;
    default:
      return <Badge variant="outline">Неизвестно</Badge>;
  }
}

function getStatusText(status?: string): string {
  switch (status) {
    case "online":
      return "В сети";
    case "offline":
      return "Не в сети";
    case "Running":
      return "Запущен";
    case "Parked":
      return "Припаркован";
    case "Locked":
      return "Заблокирован";
    case "maintenance":
      return "На обслуживании";
    default:
      return "Неизвестно";
  }
}

export default VehicleDetail;
