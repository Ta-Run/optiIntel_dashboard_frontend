import {
  clearStoredSession,
  getAccessToken,
} from '../services/authStorage';
import { showToast } from '../utils/toast';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/api/v1' : 'localhost:4566/api/v1');

const SILENT_ERROR_PATHS = ['/auth/login', '/auth/register'];

function buildUrl(path, params = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const pathname = `${API_BASE.replace(/\/$/, '')}${normalizedPath}`;
  const url = pathname.startsWith('http')
    ? new URL(pathname)
    : new URL(pathname, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function buildHeaders(extra = {}) {
  const headers = { Accept: 'application/json', ...extra };
  const token = getAccessToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function shouldShowErrorToast(path, status) {
  if (status === 401) return false;
  return !SILENT_ERROR_PATHS.some((silentPath) => path.startsWith(silentPath));
}

async function handleResponse(response, path = '') {
  let body = {};

  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (response.status === 401) {
    clearStoredSession();
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  if (!response.ok || body.success === false) {
    const message = body.error?.message || body.message || 'Request failed';

    if (shouldShowErrorToast(path, response.status)) {
      showToast(message, 'error');
    }

    throw new Error(message);
  }

  return body.data;
}

export async function apiGet(path, params = {}) {
  const response = await fetch(buildUrl(path, params), {
    headers: buildHeaders(),
  });
  return handleResponse(response, path);
}

export async function apiPost(path, body = null, options = {}) {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: buildHeaders({
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    }),
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(response, path);
}

export async function apiDelete(path) {
  const response = await fetch(buildUrl(path), {
    method: 'DELETE',
    headers: buildHeaders(),
  });
  return handleResponse(response, path);
}

export async function apiUpload(path, file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiPost(path, formData);
}
