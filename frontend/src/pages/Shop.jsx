import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const Filters = styled.div`
  padding: 1rem;
  display: flex;
  gap: 1rem;
`;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const page = searchParams.get('page') || 1;
  const limit = 10;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const params = new URLSearchParams({ page, limit, search, category });
    api.get(`/products?${params.toString()}`).then(res => {
      setProducts(res.data.data);
      setPageCount(Math.ceil(res.data.total / limit));
    });
  }, [page, search, category]);

  const handlePageClick = (data) => {
    setSearchParams({ page: data.selected + 1, search, category });
  };

  return (
    <div>
      <h1>Shop</h1>
      <Filters>
        <input placeholder="Search" value={search} onChange={e => setSearchParams({ search: e.target.value, category })} />
        <select value={category} onChange={e => setSearchParams({ category: e.target.value, search })}>
          <option value="">All</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Boots">Boots</option>
          <option value="Casual">Casual</option>
        </select>
      </Filters>
      <Grid>
        {products.map(product => <ProductCard key={product.id} product={product} />)}
      </Grid>
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName="pagination"
      />
    </div>
  );
};

export default Shop;