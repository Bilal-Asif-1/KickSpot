import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';
import styled from 'styled-components';

const Form = styled.form`
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #eee;
`;

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const Login = ({ setIsAuthenticated }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      setToken(res.data.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>
      <input placeholder="Email" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <input type="password" placeholder="Password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit">Login</button>
    </Form>
  );
};

export default Login;