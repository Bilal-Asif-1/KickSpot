import { useEffect, useState } from 'react';
import { productService } from '../services';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';


const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await productService.getAllProducts({
          limit: 4,
          sortBy: 'createdAt',
          sortOrder: 'DESC'
        });
        // Handle the response structure: { success: true, message: "...", data: { products: [...] } }
        const products = response.data?.products || response.products || response || [];
        setFeatured(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setFeatured([]);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div>
      <div className="relative h-96 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <h1 className="text-5xl font-bold mb-4">Discover Your Perfect Pair</h1>
          <p className="text-xl mb-8">Step into Style and Comfort</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Shop Now
          </motion.button>
        </motion.div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
      <h2 className="text-3xl font-bold text-center my-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {featured.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
};

export default Home;