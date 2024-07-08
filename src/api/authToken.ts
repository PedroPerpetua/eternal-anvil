const AUTH_TOKEN_LS_KEY = 'authToken';

export function saveAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_LS_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_LS_KEY) ?? '';
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_LS_KEY);
}
