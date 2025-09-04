import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useState } from 'react';

const HeaderWrapper = styled.header`
  background: #fff;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.img`
  height: 40px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/shop?search=${search}`);
    }
  };

  return (
    <HeaderWrapper>
      <Link to="/"><Logo src="/assets/logo.png" alt="Shoe Store" /></Link>
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        {isAuthenticated && <Link to="/cart">Cart</Link>}
        {isAuthenticated ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Nav>
      <SearchInput 
        type="text" 
        placeholder="Search shoes..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        onKeyDown={handleSearch} 
      />
    </HeaderWrapper>
  );
};

export default Header;