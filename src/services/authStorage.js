export const AUTH_STORAGE_KEY = 'optintel_auth';

export function readStoredSession() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored);
    if (!session?.user || !session?.accessToken) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function writeStoredSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAccessToken() {
  return readStoredSession()?.accessToken ?? null;
}
