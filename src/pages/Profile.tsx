
import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Key,
  Save
} from "lucide-react";
import { User as UserType } from "@/lib/types";

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Обновляем пользователя в localStorage
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Новый пароль и подтверждение не совпадают",
      });
      return;
    }
    
    if (passwordData.currentPassword !== "password") {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Текущий пароль указан неверно",
      });
      return;
    }
    
    // В реальном приложении здесь будет API запрос
    toast({
      title: "Пароль изменен",
      description: "Ваш пароль успешно обновлен",
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Профиль пользователя
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка с информацией о профиле */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Профиль</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Безопасность</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Уведомления</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Личная информация</CardTitle>
                    <CardDescription>
                      Обновите ваши личные данные и контактную информацию
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Иван Петров"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ivan@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить изменения
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Безопасность аккаунта</CardTitle>
                    <CardDescription>
                      Управляйте паролем и настройками безопасности
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Текущий пароль</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="********"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Новый пароль</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="********"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="********"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button type="submit">Изменить пароль</Button>
                      <Button variant="outline" type="button">
                        Отмена
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Двухфакторная аутентификация</CardTitle>
                    <CardDescription>
                      Повысьте безопасность вашего аккаунта с помощью двухфакторной аутентификации
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Shield className="h-8 w-8 text-yellow-500 mr-4" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Двухфакторная аутентификация
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Не настроена
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Настроить</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Настройки уведомлений</CardTitle>
                    <CardDescription>
                      Настройте какие уведомления вы хотите получать
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <NotificationSetting
                      title="Безопасность"
                      description="Уведомления о входе в аккаунт и изменениях безопасности"
                      defaultChecked={true}
                    />
                    <NotificationSetting
                      title="Автомобиль"
                      description="Уведомления о состоянии и событиях автомобиля"
                      defaultChecked={true}
                    />
                    <NotificationSetting
                      title="Обслуживание"
                      description="Напоминания о техобслуживании и проверках"
                      defaultChecked={true}
                    />
                    <NotificationSetting
                      title="Новости и обновления"
                      description="Новости о продуктах и функциях"
                      defaultChecked={false}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button>Сохранить настройки</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Правая колонка с профилем и дополнительной информацией */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {user?.phone || "Телефон не указан"}
                  </p>
                  <Button variant="outline" className="mt-4 w-full">
                    Изменить фото
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ваши автомобили</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  У вас 3 автомобиля
                </p>
                <Button variant="outline" className="w-full">
                  Управление автомобилями
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Доступ к аккаунту</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Key className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      API ключи
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Управляйте API ключами для доступа к системе
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Интеграции
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Подключите сторонние сервисы
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Настройки доступа
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

interface NotificationSettingProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
}

const NotificationSetting = ({
  title,
  description,
  defaultChecked = false,
}: NotificationSettingProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="rounded text-primary focus:ring-primary"
          id={`notification-${title}`}
        />
      </div>
    </div>
  );
};

export default Profile;
