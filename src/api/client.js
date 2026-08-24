const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.pathname + url.search;
}

async function handleResponse(response) {
  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(body.error?.message || body.message || 'Request failed');
  }
  return body.data;
}

export async function apiGet(path, params = {}) {
  const response = await fetch(buildUrl(path, params), {
    headers: { Accept: 'application/json' },
  });
  return handleResponse(response);
}

export async function apiPost(path, body = null, options = {}) {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(response);
}

export async function apiDelete(path) {
  const response = await fetch(buildUrl(path), {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  return handleResponse(response);
}

export async function apiUpload(path, file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiPost(path, formData);
}
