import { apiGet, apiPost } from '../api/client';

export async function login(email, password) {
  return apiPost('/auth/login', { email, password });
}

export async function register({ email, password, name, role }) {
  const body = { email, password, name };
  if (role) body.role = role;
  return apiPost('/auth/register', body);
}

export async function getMe() {
  return apiGet('/auth/me');
}

export async function getDemoUsers() {
  return apiGet('/auth/demo-users');
}
