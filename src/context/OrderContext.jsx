import { createContext, useContext, useEffect, useState } from 'react';
import { fetchOrders, deleteOrder } from '../services/api';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // First try to load from localStorage
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        } else {
          const fetchedOrders = await fetchOrders();
          setOrders(fetchedOrders);
          // Save to localStorage
          localStorage.setItem('orders', JSON.stringify(fetchedOrders));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const addOrder = (newOrder) => {
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const removeOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return true;
    } catch (error) {
      console.error('Error removing order:', error);
      return false;
    }
  };

  const selectOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <OrderContext.Provider 
      value={{ 
        orders, 
        loading, 
        addOrder, 
        removeOrder, 
        selectedOrder, 
        selectOrder 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
