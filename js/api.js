/**
 * API Client - Backend communication layer
 */

const TOKEN_KEY = 'taskmanager_token';
const USER_KEY = 'taskmanager_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function getStoredUser() {
  try {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch { return null; }
}

function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

// Use full URL - critical when page is opened via file:// (double-click HTML)
function apiUrl(path) {
  if (typeof window === 'undefined') return path;
  const origin = window.location.origin;
  if (origin && (origin.startsWith('http://') || origin.startsWith('https://'))) {
    return origin + path;
  }
  return 'http://localhost:3000' + path; // fallback for file://
}

async function request(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : apiUrl(url);
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(fullUrl, config);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

// Auth API
export const authApi = {
  register: (data) => request('/api/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/api/auth/login', { method: 'POST', body: data }),
  getProfile: () => request('/api/auth/profile'),
  updateProfile: (data) => request('/api/auth/profile', { method: 'PATCH', body: data })
};

// Task API (requires login)
export const taskApi = {
  getAll: () => request('/api/tasks'),
  getById: (id) => request(`/api/tasks/${id}`),
  create: (task) => request('/api/tasks', { method: 'POST', body: task }),
  update: (id, updates) => request(`/api/tasks/${id}`, { method: 'PATCH', body: updates }),
  delete: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' })
};

export { getToken, setToken, getStoredUser, setStoredUser };
