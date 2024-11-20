import { api } from './api';
import type { User, AuthResponse } from './types';

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function signupUser(username: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', {
    username,
    email,
    password,
  });
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}