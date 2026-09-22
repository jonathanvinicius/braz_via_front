const TOKEN_KEY = 'brazvia.admin.token';

export type AdminUser = {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  cognitoSub: string;
  groups: string[];
};

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}
