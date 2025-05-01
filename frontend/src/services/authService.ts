import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const getCurrentUser = async () => {
  const token = localStorage.getItem('access');
  if (!token) throw new Error('No user authenticated');

  
  const response = await axios.get(`${API_URL}/api/me/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/api/auth/login/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  localStorage.setItem('access', response.data.access);
  localStorage.setItem('refresh', response.data.refresh);
};

export const register = async ({ username, email, password, role }: { username: string, email: string, password: string, role: 'patient' | 'doctor' }) => {
  const response = await axios.post(
    `${API_URL}/api/auth/register/`,
    {
      full_name: username,
      email,
      password,
      role,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  localStorage.setItem('access', response.data.access);
  localStorage.setItem('refresh', response.data.refresh);
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};
