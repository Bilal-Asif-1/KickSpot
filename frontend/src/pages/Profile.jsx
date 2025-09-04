import { useEffect, useState } from 'react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const ProfileWrapper = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  max-width: 400px;
  margin: 1rem 0;
`;

const profileSchema = yup.object({
  name: yup.string(),
  email: yup.string().email(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup.string().min(6).required(),
});

const Profile = () => {
  const [user, setUser] = useState(null);

  const { register: regProfile, handleSubmit: subProfile, setValue } = useForm({ resolver: yupResolver(profileSchema) });
  const { register: regPassword, handleSubmit: subPassword } = useForm({ resolver: yupResolver(passwordSchema) });

  useEffect(() => {
    api.get('/auth/profile').then(res => {
      setUser(res.data);
      setValue('name', res.data.name);
      setValue('email', res.data.email);
    });
  }, []);

  const updateProfile = async (data) => {
    try {
      await api.put('/auth/profile', data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const changePassword = async (data) => {
    try {
      await api.put('/auth/change-password', data);
      toast.success('Password changed');
    } catch (err) {
      toast.error('Change failed');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <ProfileWrapper>
      <h1>Profile</h1>
      <Form onSubmit={subProfile(updateProfile)}>
        <input {...regProfile('name')} />
        <input {...regProfile('email')} />
        <button type="submit">Update Profile</button>
      </Form>
      <Form onSubmit={subPassword(changePassword)}>
        <input type="password" placeholder="Current Password" {...regPassword('currentPassword')} />
        <input type="password" placeholder="New Password" {...regPassword('newPassword')} />
        <button type="submit">Change Password</button>
      </Form>
    </ProfileWrapper>
  );
};

export default Profile;