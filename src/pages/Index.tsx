
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { 
  Lock, 
  Smartphone, 
  MapPin, 
  Thermometer, 
  Shield, 
  ChevronRight 
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Навигация */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-car-blue dark:text-blue-400">
                  АвтоКонтроль
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 dark:text-gray-300 hover:text-car-blue dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Войти
              </Link>
              <Link 
                to="/register" 
                className="bg-car-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
              >
                Регистрация
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Главный баннер */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Управляй своим автомобилем из любой точки мира
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                АвтоКонтроль — современная система удаленного управления и мониторинга вашего автомобиля
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 text-lg">
                    Начать бесплатно
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white px-6 py-3 text-lg">
                    Узнать больше
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd" 
                alt="Смартфон управляющий автомобилем" 
                className="rounded-lg shadow-lg max-w-full h-auto md:max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Основные преимущества */}
      <div id="features" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Ключевые возможности
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Что делает АвтоКонтроль незаменимым для вашего автомобиля
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Lock className="h-8 w-8 text-car-blue dark:text-blue-400" />}
              title="Безопасность"
              description="Удаленно блокируйте и разблокируйте двери автомобиля, включайте сигнализацию и получайте уведомления о несанкционированном доступе"
            />
            <FeatureCard 
              icon={<Smartphone className="h-8 w-8 text-car-blue dark:text-blue-400" />}
              title="Удобство"
              description="Управляйте климат-контролем, запускайте двигатель и контролируйте все функции автомобиля с вашего смартфона"
            />
            <FeatureCard 
              icon={<MapPin className="h-8 w-8 text-car-blue dark:text-blue-400" />}
              title="Геолокация"
              description="Всегда знайте, где находится ваш автомобиль, получайте уведомления при его перемещении"
            />
            <FeatureCard 
              icon={<Thermometer className="h-8 w-8 text-car-blue dark:text-blue-400" />}
              title="Контроль"
              description="Отслеживайте температуру двигателя, уровень топлива, заряд аккумулятора и другие важные параметры"
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-car-blue dark:text-blue-400" />}
              title="Защита"
              description="Дополнительный уровень защиты вашего автомобиля от угона и вандализма"
            />
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
              <Link to="/register" className="text-car-blue dark:text-blue-400 font-medium flex items-center group">
                <span>Все возможности</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Как это работает */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Как это работает
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Три простых шага для начала использования АвтоКонтроль
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Регистрация"
              description="Создайте учетную запись и настройте профиль пользователя"
            />
            <StepCard 
              number="02"
              title="Подключение"
              description="Добавьте ваш автомобиль в систему и установите контрольный модуль"
            />
            <StepCard 
              number="03"
              title="Управление"
              description="Наслаждайтесь полным контролем над вашим автомобилем из любого места"
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register">
              <Button className="bg-car-blue hover:bg-blue-600 text-white px-6 py-3 text-lg">
                Начать сейчас
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Отзывы */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Что говорят наши пользователи
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Алексей Иванов"
              role="Владелец Tesla Model S"
              content="АвтоКонтроль полностью изменил мой опыт владения автомобилем. Теперь я могу контролировать все аспекты моей Tesla через одно приложение."
              image="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <TestimonialCard 
              name="Елена Смирнова"
              role="Владелец BMW X5"
              content="Мне очень нравится функция предварительного прогрева автомобиля зимой. Экономит время и нервы по утрам."
              image="https://randomuser.me/api/portraits/women/44.jpg"
            />
            <TestimonialCard 
              name="Дмитрий Козлов"
              role="Владелец Mercedes-Benz"
              content="Система геолокации и уведомлений об изменении местоположения автомобиля дает мне душевное спокойствие, особенно когда я паркуюсь в новых местах."
              image="https://randomuser.me/api/portraits/men/67.jpg"
            />
          </div>
        </div>
      </div>
      
      {/* CTA секция */}
      <div className="bg-car-blue dark:bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Готовы к новому уровню контроля над вашим автомобилем?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Присоединяйтесь к тысячам довольных пользователей уже сегодня
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button className="bg-white text-car-blue hover:bg-blue-50 px-6 py-3 text-lg">
                  Начать бесплатно
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Подвал */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">АвтоКонтроль</h3>
              <p className="text-gray-400">
                Современная система удаленного управления и мониторинга вашего автомобиля
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Компания</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">О нас</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Карьера</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Блог</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Центр помощи</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Установка</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Обратная связь</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Правовая информация</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Условия использования</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Политика конфиденциальности</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Лицензии</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2023 АвтоКонтроль. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Компоненты для страницы

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
    </div>
  );
};

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard = ({ number, title, description }: StepCardProps) => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 text-car-blue dark:text-blue-400 text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  image: string;
}

const TestimonialCard = ({ name, role, content, image }: TestimonialCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6">
      <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{content}"</p>
      <div className="flex items-center">
        <img src={image} alt={name} className="h-12 w-12 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
