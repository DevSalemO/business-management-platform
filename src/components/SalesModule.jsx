import { useState } from 'react';
import OrderForm from './OrderForm';
import OrderList from './OrderList';

export default function SalesModule() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your orders, create new orders, and view order history.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            {showForm ? 'View Orders' : 'Create Order'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        {showForm ? <OrderForm /> : <OrderList />}
      </div>
    </div>
  );
}
