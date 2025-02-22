import { useEffect, useState } from 'react';
import { fetchOrderById } from '../services/api';

export default function OrderDetails({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await fetchOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-6">
          <div className="border-b pb-4">
            <h4 className="text-lg font-medium text-gray-900">Order Information</h4>
            <p className="mt-2 text-sm text-gray-600">Order #{order.id}</p>
            <p className="text-sm text-gray-600">
              Date: {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div className="border-b pb-4">
            <h4 className="text-lg font-medium text-gray-900">Customer Information</h4>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Name: {order.user ? `${order.user.name.firstname} ${order.user.name.lastname}` : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Email: {order.user?.email || 'N/A'}</p>
              <p className="text-sm text-gray-600">
                Phone: {order.user?.phone || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900">Products</h4>
            <div className="mt-4 space-y-4">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 border-b last:border-0 pb-4"
                >
                  {product.details?.image && (
                    <img
                      src={product.details.image}
                      alt={product.details.title}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">
                      {product.details?.title || `Product #${product.productId}`}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Price: ${product.details?.price?.toFixed(2) || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">
                      Subtotal: ${((product.details?.price || 0) * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-xl font-bold text-primary-600">
                ${order.totalPrice?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
