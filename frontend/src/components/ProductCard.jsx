import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled.div`
  border: 1px solid #eee;
  padding: 1rem;
  text-align: center;
  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const ProductCard = ({ product }) => (
  <Card>
    <img src={product.image || 'placeholder.jpg'} alt={product.name} style={{ width: '100%' }} />
    <h3>{product.name}</h3>
    <p>${product.price}</p>
    <Link to={`/product/${product.id}`}>View Details</Link>
  </Card>
);

export default ProductCard;