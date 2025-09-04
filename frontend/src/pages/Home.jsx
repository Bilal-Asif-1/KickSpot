import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?limit=4&sortBy=createdAt&sortOrder=DESC').then(res => setFeatured(res.data.data));
  }, []);

  return (
    <div>
      <h1>Welcome to Shoe Store</h1>
      <Grid>
        {featured.map(product => <ProductCard key={product.id} product={product} />)}
      </Grid>
    </div>
  );
};

export default Home;