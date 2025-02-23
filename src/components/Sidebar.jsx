import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Products',
      path: '/products',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: 'Users',
      path: '/users',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside 
      className={`${
        isExpanded ? 'w-64' : 'w-20'
      } transition-all duration-300 ease-in-out sticky top-0 left-0 h-screen flex flex-col bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-blue-800 bg-opacity-50 backdrop-blur-sm">
        {isExpanded && <span className="text-xl font-semibold tracking-wider">Business Pro</span>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-white text-blue-600 shadow-lg shadow-blue-900/30 scale-105'
                  : 'text-blue-100 hover:bg-blue-700/50 hover:scale-105'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isExpanded && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 bg-blue-800 bg-opacity-50 backdrop-blur-sm">
        {user ? (
          <div className={`flex ${isExpanded ? 'items-center space-x-3' : 'flex-col space-y-3'}`}>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              title="Logout"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
                  <p className="text-xs text-blue-200 truncate">{user.email}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <nav className="space-y-1">
            <Link
              to="/login"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === '/login'
                  ? 'bg-white text-blue-600 shadow-lg shadow-blue-900/30'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {isExpanded && <span className="ml-3">Login</span>}
            </Link>

            <Link
              to="/register"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === '/register'
                  ? 'bg-white text-blue-600 shadow-lg shadow-blue-900/30'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {isExpanded && <span className="ml-3">Register</span>}
            </Link>
          </nav>
        )}
      </div>
    </aside>
  );
}
