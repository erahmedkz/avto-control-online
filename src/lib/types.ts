
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  status: "online" | "offline" | "maintenance";
  fuelLevel: number;
  batteryLevel: number;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
  };
  doors: {
    locked: boolean;
    frontLeftOpen: boolean;
    frontRightOpen: boolean;
    rearLeftOpen: boolean;
    rearRightOpen: boolean;
    trunkOpen: boolean;
  };
  climate: {
    temperature: number;
    isOn: boolean;
  };
  engine: {
    isOn: boolean;
    rpm?: number;
    temperature?: number;
  };
  mileage: number;
  lastService?: {
    date: string;
    mileage: number;
    type: string;
  };
  image: string;
}

export interface Alert {
  id: string;
  vehicleId: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
  read: boolean;
}
