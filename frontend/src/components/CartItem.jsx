import styled from 'styled-components';

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`;

const CartItem = ({ item, onRemove, onQuantityChange }) => (
  <Item>
    <div>
      <h4>{item.name}</h4>
      <p>Size: {item.size}</p>
      <p>Quantity: <input type="number" value={item.quantity} onChange={(e) => onQuantityChange(item.id, e.target.value)} min="1" /></p>
    </div>
    <div>
      <p>${item.price * item.quantity}</p>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  </Item>
);

export default CartItem;