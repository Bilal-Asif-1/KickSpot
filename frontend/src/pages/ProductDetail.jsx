import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import SizeGuideModal from '../components/SizeGuideModal';
import NotificationForm from '../components/NotificationForm';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const DetailWrapper = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  @media (max-width: 768px) { flex-direction: column; }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const addToCart = () => {
    if (!selectedSize) return toast.error('Select size');
    // Add to localStorage cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...product, size: selectedSize, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart');
  };

  if (!product) return <p>Loading...</p>;

  return (
    <DetailWrapper>
      <img src={product.image || 'placeholder.jpg'} alt={product.name} style={{ width: '50%' }} />
      <div>
        <h1>{product.name}</h1>
        <p>${product.price}</p>
        <p>{product.description}</p>
        <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
          <option value="">Select Size</option>
          {product.sizes?.map(size => <option key={size} value={size}>{size}</option>)}
        </select>
        {product.stock > 0 ? (
          <button onClick={addToCart}>Add to Cart</button>
        ) : (
          <NotificationForm productId={id} />
        )}
        <button onClick={() => setShowSizeGuide(true)}>View Size Guide</button>
        {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
      </div>
    </DetailWrapper>
  );
};

export default ProductDetail;