export type UserRole = 'customer' | 'courier' | 'admin';

export type User = {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  rating: number;
  vehicleType?: 'bike' | 'car' | 'foot';
  active: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type OrderStatus = 'pending' | 'searching_courier' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export type PackageSize = 'S' | 'M' | 'L' | 'XL';

export type Order = {
  id: string;
  customerId: string;
  courierId?: string;
  pickup: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    instructions: string;
  };
  dropoff: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    instructions: string;
  };
  package: {
    size: PackageSize;
    weight: number;
    description: string;
  };
  status: OrderStatus;
  price: number;
  distance: number;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  method: 'card' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  timestamp: Date;
};