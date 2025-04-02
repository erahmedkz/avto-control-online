
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    
    setLoading(true);

    try {
      const { error, data } = await signUp(email, password, name);
      
      if (error) {
        console.error("Registration error:", error);
        if (error.message.includes("already registered")) {
          toast.error("Пользователь с таким email уже зарегистрирован");
        } else {
          toast.error(error.message);
        }
      } else {
        console.log("Registration successful:", data);
        toast.success("Регистрация успешна! Теперь вы можете войти");
        
        // Переход на страницу входа
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      toast.error("Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-car-blue dark:text-blue-400 tracking-tight">АвтоКонтроль</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Создайте аккаунт для управления вашим автомобилем
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Регистрация
          </h2>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Имя
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Иван Петров"
                className="w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ivan@example.com"
                className="w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Телефон
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Пароль
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Подтверждение пароля
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-car-blue hover:bg-blue-600 transition-all duration-200 py-2 h-11"
              disabled={loading}
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-car-blue dark:text-blue-400 hover:underline font-medium">
                Войти
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
          <p>
            © 2023 АвтоКонтроль. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
