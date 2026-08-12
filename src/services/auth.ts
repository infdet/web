import xior from 'xior';

import type User from '#types/User';
import type { AuthPayload, AuthResponse } from '#types/User';

xior.defaults.baseURL = import.meta.env.VITE_API_URL;

xior.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export async function register(params: RegisterParams): Promise<AuthPayload> {
  const res = await xior.post<AuthResponse>('/auth/register', params);
  return res.data.data;
}

export async function login(params: LoginParams): Promise<AuthPayload> {
  const res = await xior.post<AuthResponse>('/auth/login', params);
  return res.data.data;
}

export async function logout(): Promise<void> {
  await xior.post('/account/logout');
}

export async function getProfile(): Promise<User> {
  const res = await xior.get<{ data: User }>('/account/profile');
  return res.data.data;
}
