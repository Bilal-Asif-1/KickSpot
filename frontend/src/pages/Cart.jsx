import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage on component mount
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  const updateLocalStorage = (updatedItems) => {
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = cartItems.map(item =>
      item._id === id ? { ...item, quantity: parseInt(newQuantity) } : item
    );
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8 text-gray-800"
      >
        Your Shopping Cart
      </motion.h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-gray-600 text-xl mt-10"
        >
          Your cart is empty. <Link to="/products" className="text-primary-600 hover:underline">Start shopping!</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
              >
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div className="flex-grow">
                  <Link to={`/products/${item._id}`} className="text-lg font-semibold text-gray-800 hover:text-primary-600">
                    {item.name}
                  </Link>
                  <p className="text-gray-600 text-sm">Category: {item.category}</p>
                  <p className="text-primary-600 font-bold mt-1">${item.price?.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    className="w-16 p-2 border border-gray-300 rounded-md text-center"
                  />
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal:</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 border-t border-gray-200 pt-4 mt-4">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
            <button
              className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="mt-4 w-full flex items-center justify-center text-primary-600 hover:text-primary-800 transition-colors duration-200">
              <ArrowLeft size={20} className="mr-2" /> Continue Shopping
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;