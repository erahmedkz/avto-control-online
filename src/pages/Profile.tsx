
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  Key,
  Save
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать минимум 2 символа",
  }),
  username: z.string().min(2, {
    message: "Имя пользователя должно содержать минимум 2 символа",
  }),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email",
  }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Пароль должен содержать минимум 8 символов",
  }),
  newPassword: z.string().min(8, {
    message: "Пароль должен содержать минимум 8 символов",
  }),
  confirmPassword: z.string().min(8, {
    message: "Пароль должен содержать минимум 8 символов",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface UserProfile {
  id: string;
  name: string | null;
  username: string;
  email: string;
  joined: string | null;
  avatar: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch profile from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfile(data as UserProfile);
          profileForm.reset({
            name: data.name || "",
            username: data.username || "",
            email: data.email || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error("Не удалось загрузить профиль");
        
        // Set default values from auth user
        if (user) {
          const defaultProfile = {
            id: user.id,
            name: user.user_metadata?.name || "",
            username: user.email?.split('@')[0] || "",
            email: user.email || "",
            joined: user.created_at,
            avatar: null
          };
          
          setProfile(defaultProfile);
          profileForm.reset({
            name: defaultProfile.name,
            username: defaultProfile.username,
            email: defaultProfile.email,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, profileForm]);

  async function onProfileSubmit(data: ProfileFormValues) {
    if (!user || !profile) return;
    
    try {
      setUpdating(true);
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          username: data.username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setProfile({
        ...profile,
        name: data.name,
        username: data.username,
      });
      
      toast.success("Профиль успешно обновлен");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Не удалось обновить профиль");
    } finally {
      setUpdating(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    try {
      setUpdating(true);
      
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      passwordForm.reset();
      toast.success("Пароль успешно обновлен");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error("Не удалось обновить пароль: " + error.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-opacity-30 border-t-primary rounded-full"></div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ваш профиль</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Управляйте вашими персональными данными и настройками
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80 rounded-t-lg h-32"></div>
              <div className="relative z-10 flex flex-col items-center pt-8">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 bg-white">
                  <AvatarImage src={profile?.avatar || ""} alt={profile?.name || ""} />
                  <AvatarFallback className="text-xl">
                    {profile?.name ? getInitials(profile.name) : profile?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold">{profile?.name || "Пользователь"}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{profile?.username}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Регистрация: {profile?.joined ? new Date(profile.joined).toLocaleDateString('ru-RU') : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Пользователь</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Settings Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Учетная запись</TabsTrigger>
              <TabsTrigger value="security">Безопасность</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                    Основная информация
                  </CardTitle>
                  <CardDescription>
                    Обновите ваши личные данные
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form id="profile-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Полное имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Иван Иванов" {...field} />
                            </FormControl>
                            <FormDescription>
                              Это имя будет отображаться в вашем профиле
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя пользователя</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormDescription>
                              Ваш уникальный идентификатор в системе
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="email@example.com" 
                                type="email" 
                                {...field} 
                                disabled 
                              />
                            </FormControl>
                            <FormDescription>
                              Ваш email адрес (нельзя изменить)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    form="profile-form"
                    disabled={updating || !profileForm.formState.isDirty}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updating ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-500" />
                    Смена пароля
                  </CardTitle>
                  <CardDescription>
                    Обновите пароль вашей учетной записи
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form id="password-form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Текущий пароль</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="••••••••" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Новый пароль</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="••••••••" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Минимум 8 символов
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Подтверждение пароля</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="••••••••" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    form="password-form"
                    disabled={updating || !passwordForm.formState.isDirty}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    {updating ? "Изменение..." : "Изменить пароль"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
