import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email().required(),
});

const NotificationForm = ({ productId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      // Assume backend has /notifications/stock endpoint
      await api.post('/notifications/stock', { ...data, productId });
      toast.success(" You'll be notified ");
    } catch (err) {
      toast.error('Error signing up.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email" placeholder="Email" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit">Email me when in stock</button>
    </form>
  );
};

export default NotificationForm;