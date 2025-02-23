import SalesOverviewChart from "../components/dashboard/SalesOverviewChart";
import CategoryDistributionChart from "../components/dashboard/CategoryDistributionChart";
import { CSVLink } from "react-csv"; 
import { useEffect, useState } from "react";
import axios from 'axios';

const API_URL = 'https://fakestoreapi.com';

const ExportButton = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch carts, products, and users data in parallel
        const [cartsResponse, productsResponse, usersResponse] = await Promise.all([
          axios.get(`${API_URL}/carts`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/users`)
        ]);

        const carts = cartsResponse.data;
        const products = productsResponse.data;
        const users = usersResponse.data;

        // Create lookup maps
        const productMap = products.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {});

        const userMap = users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        // Transform data for CSV export
        const salesRecords = [];
        
        carts.forEach(cart => {
          const user = userMap[cart.userId];
          const date = new Date(cart.date);

          cart.products.forEach(item => {
            const product = productMap[item.productId];
            if (product) {
              salesRecords.push({
                'Order Date': date.toLocaleDateString(),
                'Order ID': cart.id,
                'Customer Name': user ? `${user.name.firstname} ${user.name.lastname}` : 'Unknown',
                'Customer Email': user ? user.email : 'Unknown',
                'Product ID': product.id,
                'Product Name': product.title,
                'Category': product.category,
                'Unit Price': product.price.toFixed(2),
                'Quantity': item.quantity,
                'Total Amount': (product.price * item.quantity).toFixed(2)
              });
            }
          });
        });

        setSalesData(salesRecords);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const headers = [
    { label: 'Order Date', key: 'Order Date' },
    { label: 'Order ID', key: 'Order ID' },
    { label: 'Customer Name', key: 'Customer Name' },
    { label: 'Customer Email', key: 'Customer Email' },
    { label: 'Product ID', key: 'Product ID' },
    { label: 'Product Name', key: 'Product Name' },
    { label: 'Category', key: 'Category' },
    { label: 'Unit Price', key: 'Unit Price' },
    { label: 'Quantity', key: 'Quantity' },
    { label: 'Total Amount', key: 'Total Amount' }
  ];

  if (loading) {
    return (
      <button disabled className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed">
        Loading data...
      </button>
    );
  }

  return (
    <div className="mb-6">
      <CSVLink
        data={salesData}
        headers={headers}
        filename={`sales_data_${new Date().toISOString().split('T')[0]}.csv`}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 inline-flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Sales Data
      </CSVLink>
    </div>
  );
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        const products = response.data;
        
        // Calculate statistics
        const categories = new Set(products.map(product => product.category));
        const totalValue = products.reduce((sum, product) => sum + product.price, 0);

        setProducts(products);
        setStats({
          totalProducts: products.length,
          totalCategories: categories.size,
          totalValue: totalValue
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>

        <ExportButton />
        
        {/* Dashboard Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Products Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loading ? "Loading..." : stats.totalProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Categories Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loading ? "Loading..." : stats.totalCategories}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Value Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loading ? "Loading..." : `$${stats.totalValue.toFixed(2)}`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Sales Overview Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <SalesOverviewChart />
          </div>

          {/* Category Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <CategoryDistributionChart />
          </div>
        </div>
      </div>
    </div>
  );
}
