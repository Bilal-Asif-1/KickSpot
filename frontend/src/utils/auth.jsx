import jwtDecode from 'jwt-decode';

export const setToken = (token) => localStorage.setItem('token', token);

export const getToken = () => localStorage.getItem('token');

export const logout = () => localStorage.removeItem('token');

export const isAdmin = () => {
  const token = getToken();
  if (!token) return false;
  const decoded = jwtDecode(token);
  return decoded.role === 'admin'; // Assume your user model has role
};