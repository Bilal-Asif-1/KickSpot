import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Form = styled.form`
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #eee;
`;

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register</h2>
      <input placeholder="Name" {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
      <input placeholder="Email" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <input type="password" placeholder="Password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit">Register</button>
    </Form>
  );
};

export default Register;