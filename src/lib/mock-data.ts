
import { User, Vehicle, Alert } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    phone: '+7 (999) 234-56-78',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-02-20T14:45:00Z',
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: '1',
    make: 'Tesla',
    model: 'Model S',
    year: 2022,
    color: 'Черный',
    licensePlate: 'А123БВ77',
    status: 'online',
    fuelLevel: 0,
    batteryLevel: 78,
    location: {
      latitude: 55.753215,
      longitude: 37.622504,
      lastUpdated: '2023-08-17T15:23:00Z',
    },
    doors: {
      locked: true,
      frontLeftOpen: false,
      frontRightOpen: false,
      rearLeftOpen: false,
      rearRightOpen: false,
      trunkOpen: false,
    },
    climate: {
      temperature: 22,
      isOn: false,
    },
    engine: {
      isOn: false,
      temperature: 0,
    },
    mileage: 5240,
    lastService: {
      date: '2023-06-10T09:00:00Z',
      mileage: 5000,
      type: 'Плановое ТО',
    },
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
  },
  {
    id: '2',
    userId: '1',
    make: 'BMW',
    model: 'X5',
    year: 2021,
    color: 'Белый',
    licensePlate: 'В234ГД77',
    status: 'online',
    fuelLevel: 65,
    batteryLevel: 100,
    location: {
      latitude: 55.759747,
      longitude: 37.629359,
      lastUpdated: '2023-08-17T16:45:00Z',
    },
    doors: {
      locked: true,
      frontLeftOpen: false,
      frontRightOpen: false,
      rearLeftOpen: false,
      rearRightOpen: false,
      trunkOpen: false,
    },
    climate: {
      temperature: 20,
      isOn: false,
    },
    engine: {
      isOn: false,
      rpm: 0,
      temperature: 0,
    },
    mileage: 18750,
    lastService: {
      date: '2023-05-22T10:15:00Z',
      mileage: 18000,
      type: 'Плановое ТО',
    },
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
  },
  {
    id: '3',
    userId: '1',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    color: 'Серебристый',
    licensePlate: 'Г345ЕЖ77',
    status: 'maintenance',
    fuelLevel: 30,
    batteryLevel: 60,
    location: {
      latitude: 55.749056,
      longitude: 37.611471,
      lastUpdated: '2023-08-16T18:10:00Z',
    },
    doors: {
      locked: true,
      frontLeftOpen: false,
      frontRightOpen: false,
      rearLeftOpen: false,
      rearRightOpen: false,
      trunkOpen: false,
    },
    climate: {
      temperature: 21,
      isOn: false,
    },
    engine: {
      isOn: false,
      rpm: 0,
      temperature: 0,
    },
    mileage: 2350,
    lastService: {
      date: '2023-08-05T09:30:00Z',
      mileage: 2000,
      type: 'Первое ТО',
    },
    image: 'https://images.unsplash.com/photo-1599912027611-484b9fc447af',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'warning',
    message: 'Низкий заряд батареи (15%)',
    timestamp: '2023-08-17T12:32:00Z',
    read: false,
  },
  {
    id: '2',
    vehicleId: '2',
    type: 'info',
    message: 'Плановое ТО через 250 км',
    timestamp: '2023-08-17T09:15:00Z',
    read: true,
  },
  {
    id: '3',
    vehicleId: '3',
    type: 'error',
    message: 'Требуется техническое обслуживание',
    timestamp: '2023-08-16T18:05:00Z',
    read: false,
  },
];

// Вспомогательные функции для работы с моковыми данными
export function getUser(userId: string): User | undefined {
  return mockUsers.find(user => user.id === userId);
}

export function getVehicle(vehicleId: string): Vehicle | undefined {
  return mockVehicles.find(vehicle => vehicle.id === vehicleId);
}

export function getVehiclesByUser(userId: string): Vehicle[] {
  return mockVehicles.filter(vehicle => vehicle.userId === userId);
}

export function getAlertsByVehicle(vehicleId: string): Alert[] {
  return mockAlerts.filter(alert => alert.vehicleId === vehicleId);
}

export function getAllAlertsByUser(userId: string): Alert[] {
  const userVehicles = getVehiclesByUser(userId);
  const vehicleIds = userVehicles.map(vehicle => vehicle.id);
  return mockAlerts.filter(alert => vehicleIds.includes(alert.vehicleId));
}
