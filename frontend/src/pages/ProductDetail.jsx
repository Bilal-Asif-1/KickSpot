import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import productService from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data.product);
      } catch (err) {
        setError('Failed to fetch product details. Product not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading product details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-6 transition-colors duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft size={20} className="mr-2" /> Back to products
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden md:flex"
      >
        <div className="md:w-1/2">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-primary-600 text-xl font-semibold mb-4">${product.price?.toFixed(2) || 'N/A'}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center text-gray-700 text-sm mb-2">
              <span className="font-semibold mr-2">Category:</span> {product.category}
            </div>
            <div className="flex items-center text-gray-700 text-sm mb-4">
              <span className="font-semibold mr-2">Availability:</span> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
          <button
            className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
            disabled={product.stock === 0}
          >
            <ShoppingCart size={20} className="mr-2" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;