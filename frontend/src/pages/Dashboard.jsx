import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Dummy data for orders and favorites
  const dummyOrders = [
    { id: '1', date: '2023-01-15', total: 120.00, status: 'Delivered', items: 2 },
    { id: '2', date: '2023-02-20', total: 75.50, status: 'Processing', items: 1 },
  ];

  const dummyFavorites = [
    { id: 'prod1', name: 'Wireless Headphones', price: 99.99, imageUrl: 'https://via.placeholder.com/150' },
    { id: 'prod2', name: 'Smartwatch', price: 199.99, imageUrl: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8 text-gray-800"
      >
        Welcome, {user?.username || 'User'}!
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:w-1/4 bg-white rounded-lg shadow-md p-6"
        >
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${activeTab === 'profile' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <User size={20} className="mr-3" /> Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${activeTab === 'orders' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ShoppingBag size={20} className="mr-3" /> Orders
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${activeTab === 'favorites' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Heart size={20} className="mr-3" /> Favorites
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${activeTab === 'settings' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Settings size={20} className="mr-3" /> Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center p-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut size={20} className="mr-3" /> Logout
            </button>
          </nav>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:w-3/4 bg-white rounded-lg shadow-md p-6"
        >
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <p className="text-gray-700"><span className="font-semibold">Username:</span> {user?.username || 'N/A'}</p>
                <p className="text-gray-700"><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                <p className="text-gray-700"><span className="font-semibold">Phone:</span> {user?.phone || 'N/A'}</p>
                {/* Add more profile fields as needed */}
              </div>
              <button className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                Edit Profile
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>
              {dummyOrders.length === 0 ? (
                <p className="text-gray-600">You have no orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {dummyOrders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold">Order ID: {order.id}</p>
                      <p>Date: {order.date}</p>
                      <p>Total: ${order.total.toFixed(2)}</p>
                      <p>Status: {order.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Favorites</h2>
              {dummyFavorites.length === 0 ? (
                <p className="text-gray-600">You have no favorite products yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dummyFavorites.map(product => (
                    <Link to={`/products/${product.id}`} key={product.id} className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover mb-2 rounded-md" />
                      <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                      <p className="text-primary-600 font-bold">${product.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h2>
              <p className="text-gray-600">Settings options will be available here.</p>
              {/* Add settings forms/options here */}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;