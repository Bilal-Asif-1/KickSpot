import { useState, useEffect } from 'react';
import CartItem from '../components/CartItem';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const CartWrapper = styled.div`
  padding: 2rem;
`;

const Summary = styled.div`
  margin-top: 2rem;
  text-align: right;
`;

const Cart = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const changeQuantity = (id, qty) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: parseInt(qty) } : item));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = () => {
    // Integrate payment if added
    toast.info('Proceeding to checkout...');
  };

  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <CartWrapper>
      <h1>Cart</h1>
      {cart.map(item => <CartItem key={item.id} item={item} onRemove={removeItem} onQuantityChange={changeQuantity} />)}
      <Summary>
        <p>Subtotal: ${subtotal}</p>
        <p>Shipping: Calculated at checkout</p>
        <p>Taxes: Calculated at checkout</p>
        <button onClick={checkout}>Checkout</button>
        <button onClick={() => setCart([])}>Empty Cart</button>
      </Summary>
    </CartWrapper>
  );
};

export default Cart;