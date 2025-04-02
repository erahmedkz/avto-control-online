
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Типы для контекста аутентификации
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { session: Session | null; user: User | null } | null;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
};

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider mounted");
    
    // Устанавливаем слушатель изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Если событие выхода из системы - перенаправляем на страницу входа
        if (event === 'SIGNED_OUT') {
          navigate('/login');
          toast.success("Вы успешно вышли из системы");
        } else if (event === 'SIGNED_IN') {
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            navigate('/dashboard');
            toast.success("Вход выполнен успешно");
          }
        }
      }
    );

    // Проверяем текущую сессию
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session:", currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Функция для входа в систему
  const signIn = async (email: string, password: string) => {
    console.log("Attempting to sign in with:", email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log("Sign in result:", result);
    return result;
  };

  // Функция для регистрации
  const signUp = async (email: string, password: string, name: string) => {
    console.log("Attempting to sign up with:", email, name);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    console.log("Sign up result:", result);
    return result;
  };

  // Функция для выхода из системы
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Предоставляем контекст
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}

// Хук для перенаправления неавторизованных пользователей
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  return { user, loading };
}
