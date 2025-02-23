
import SalesOverviewChart from "../components/dashboard/SalesOverviewChart";
import CategoryDistributionChart from "../components/dashboard/CategoryDistributionChart";
import SalesChannelChart from "../components/dashboard/SalesChannelChart";
import { CSVLink } from "react-csv"; // Import react-csv

const ExportButton = () => {
  const data = [
    { name: "Product 1", price: "$10", quantity: 5 },
    { name: "Product 2", price: "$15", quantity: 3 },
    
  ];

  return (
    <div className="mb-6">
      <CSVLink data={data} filename="export.csv">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
          Export data
        </button>
      </CSVLink>
    </div>
  );
};

export default function Dashboard() {
  return (
        
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <ExportButton />
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      
        {/* Sample dashboard cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-semibold text-gray-900">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-semibold text-gray-900">25</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-semibold text-gray-900">8</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
            <div className='grid grid-cols-30 lg:grid-cols-30 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
				 	<SalesChannelChart />
				     </div>
            </main>
      </div>
    </div>
  );
}
