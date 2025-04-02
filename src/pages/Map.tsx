
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Car, Search, LocateFixed } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  name: string;
  location: string | null;
}

interface LocationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: "vehicle" | "favorite" | "marker";
}

const Map = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [currentPosition, setCurrentPosition] = useState<{lat: number; lng: number} | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("vehicles")
          .select("id, name, location")
          .eq("user_id", user.id);
        
        if (error) throw error;
        
        setVehicles(data || []);
        
        // Generate mock location points for vehicles
        const mockPoints: LocationPoint[] = (data || []).map((vehicle, index) => ({
          id: vehicle.id,
          name: vehicle.name,
          latitude: 55.751244 + (Math.random() * 0.05 - 0.025),
          longitude: 37.618423 + (Math.random() * 0.05 - 0.025),
          type: "vehicle"
        }));
        
        // Add some favorite locations
        const favoriteLocations: LocationPoint[] = [
          {
            id: "fav-1",
            name: "Дом",
            latitude: 55.7558,
            longitude: 37.6173,
            type: "favorite"
          },
          {
            id: "fav-2",
            name: "Работа",
            latitude: 55.7439,
            longitude: 37.5630,
            type: "favorite"
          }
        ];
        
        setLocationPoints([...mockPoints, ...favoriteLocations]);
      } catch (error: any) {
        console.error("Ошибка при загрузке данных:", error);
        toast.error("Не удалось загрузить данные для карты");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
    
    // Get current user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Moscow
          setCurrentPosition({ lat: 55.751244, lng: 37.618423 });
        }
      );
    } else {
      // Default to Moscow if geolocation is not supported
      setCurrentPosition({ lat: 55.751244, lng: 37.618423 });
    }
  }, [user]);

  const addLocation = () => {
    if (!newLocationName || !currentPosition) return;
    
    const newPoint: LocationPoint = {
      id: `marker-${Date.now()}`,
      name: newLocationName,
      latitude: currentPosition.lat,
      longitude: currentPosition.lng,
      type: "marker"
    };
    
    setLocationPoints([...locationPoints, newPoint]);
    setNewLocationName("");
    toast.success("Новая локация добавлена");
  };

  const filteredLocations = locationPoints.filter(point => 
    point.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Карта</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Отслеживайте местоположение ваших автомобилей и сохраняйте важные места
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with controls */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Search className="mr-2 h-5 w-5 text-blue-500" />
                Поиск
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Найти место или автомобиль..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((point) => (
                      <div 
                        key={point.id}
                        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                        onClick={() => {
                          toast.info(`Позиция на карте: ${point.name}`);
                        }}
                      >
                        {point.type === "vehicle" ? (
                          <Car className="h-4 w-4 mr-2 text-blue-500" />
                        ) : point.type === "favorite" ? (
                          <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        <span>{point.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                      Нет результатов
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <LocateFixed className="mr-2 h-5 w-5 text-blue-500" />
                Добавить локацию
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Название места"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                />
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={addLocation}
                  disabled={!newLocationName || !currentPosition}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Добавить текущее место
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Car className="mr-2 h-5 w-5 text-blue-500" />
                Мои автомобили
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-opacity-30 border-t-blue-500 rounded-full mx-auto"></div>
                </div>
              ) : vehicles.length > 0 ? (
                <div className="space-y-2">
                  {vehicles.map((vehicle) => (
                    <div 
                      key={vehicle.id}
                      className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                      onClick={() => {
                        toast.info(`Переход к автомобилю: ${vehicle.name}`);
                      }}
                    >
                      <Car className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{vehicle.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  У вас пока нет автомобилей
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Map area */}
        <div className="md:col-span-3">
          <Card className="overflow-hidden h-[calc(100vh-12rem)]">
            <div className="relative h-full">
              {/* Map placeholder - will be replaced with actual map in real implementation */}
              <div 
                ref={mapContainerRef} 
                className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center"
              >
                <div className="text-center p-8">
                  <h3 className="text-lg font-medium mb-4">Интерактивная карта</h3>
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                    Здесь будет отображаться карта для отслеживания автомобилей и отмеченных мест.
                  </p>
                  
                  <div className="inline-flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>Автомобили</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Избранное</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Отметки</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      Координаты: {currentPosition ? `${currentPosition.lat.toFixed(6)}, ${currentPosition.lng.toFixed(6)}` : 'Определение...'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Controls overlay */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="bg-white dark:bg-gray-800 h-10 w-10 rounded-full shadow-md"
                  onClick={() => toast.info("Приближение карты")}
                >
                  <span className="text-lg font-bold">+</span>
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="bg-white dark:bg-gray-800 h-10 w-10 rounded-full shadow-md"
                  onClick={() => toast.info("Отдаление карты")}
                >
                  <span className="text-lg font-bold">-</span>
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="bg-white dark:bg-gray-800 h-10 w-10 rounded-full shadow-md"
                  onClick={() => toast.info("Показать текущее местоположение")}
                >
                  <LocateFixed className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;
