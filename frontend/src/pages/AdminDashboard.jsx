import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
    api.get('/products').then(res => setProducts(res.data.data));
  }, []);

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <table>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td><button onClick={() => deleteUser(user.id)}>Delete</button></td>
          </tr>
        ))}
      </table>
      <h2>Products</h2>
      <table>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td><button>Edit</button></td>
            <td><button>Delete</button></td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default AdminDashboard;