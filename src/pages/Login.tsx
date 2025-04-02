
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        
        if (error.message === "Invalid login credentials") {
          toast.error("Неверный email или пароль");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email не подтвержден. Пожалуйста, проверьте вашу почту");
        } else {
          toast.error(error.message);
        }
      } else {
        // Успешный вход произойдет через onAuthStateChange в AuthProvider
        console.log("Login successful");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("Произошла ошибка при входе. Пожалуйста, попробуйте снова.");
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
            Управляйте вашим автомобилем с любой точки мира
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Вход в систему
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Пароль
                </label>
                <a href="#" className="text-sm text-car-blue dark:text-blue-400 hover:underline">
                  Забыли пароль?
                </a>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Нет учетной записи?{" "}
              <Link to="/register" className="text-car-blue dark:text-blue-400 hover:underline font-medium">
                Зарегистрироваться
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

export default Login;
