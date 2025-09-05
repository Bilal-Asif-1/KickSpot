import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg"
  >
    <img src={product.image || 'placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover mb-4 rounded-md" />
    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
    <p className="text-gray-700 mb-4">${product.price}</p>
    <Link to={`/product/${product.id}`} className="text-blue-600 hover:underline">View Details</Link>
  </motion.div>
);

export default ProductCard;