import React, { createContext, useContext, useState } from 'react';
import { Order } from '@/types';

type OrderContextType = {
  orders: Order[];
  activeOrder: Order | null;
  createOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setActiveOrder: (order: Order | null) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const createOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    setActiveOrder(order);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
    
    if (activeOrder?.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      activeOrder,
      createOrder,
      updateOrder,
      setActiveOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}