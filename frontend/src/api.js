const API_URL = '/api';

async function request(path, options = {}) {
  const token = sessionStorage.getItem('adminToken');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Помилка сервера');
  }

  return data;
}

export const api = {
  checkAdmin: () => request('/admin/session'),
  logoutAdmin: () => request('/admin/logout', { method: 'POST' }),
  loginAdmin: (password) => request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),

  getProducts: () => request('/products'),
  addProduct: (product) => request('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),

  updateProduct: (id, product) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getOrders: () => request('/orders'),
  createOrder: (order) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
};
