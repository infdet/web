import xior from 'xior';

import type User from '#types/User';
import type { AuthPayload, AuthResponse } from '#types/User';

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

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function initAuthToken(): void {
  const token = getAuthToken();
  if (token) {
    setAuthHeader(token);
  }
}

export function setAuthToken(token: string): void {
  setAuthHeader(token);
  localStorage.setItem('authToken', token);
}

export function setAuthHeader(token: string): void {
  xior.defaults.headers['Authorization'] = `Bearer ${token}`;
}
