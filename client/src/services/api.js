const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('crm_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateProfile: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  // Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  globalSearch: async (q) => {
    const res = await fetch(`${API_BASE}/dashboard/search?q=${encodeURIComponent(q)}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Contacts
  getContacts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/contacts?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getContact: async (id) => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createContact: async (contactData) => {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contactData)
    });
    return handleResponse(res);
  },

  updateContact: async (id, contactData) => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(contactData)
    });
    return handleResponse(res);
  },

  deleteContact: async (id) => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Deals
  getDeals: async () => {
    const res = await fetch(`${API_BASE}/deals`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createDeal: async (dealData) => {
    const res = await fetch(`${API_BASE}/deals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dealData)
    });
    return handleResponse(res);
  },

  updateDeal: async (id, dealData) => {
    const res = await fetch(`${API_BASE}/deals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(dealData)
    });
    return handleResponse(res);
  },

  updateDealStage: async (id, stage) => {
    const res = await fetch(`${API_BASE}/deals/${id}/stage`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stage })
    });
    return handleResponse(res);
  },

  deleteDeal: async (id) => {
    const res = await fetch(`${API_BASE}/deals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Tasks
  getTasks: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tasks?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createTask: async (taskData) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  updateTask: async (id, taskData) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  toggleTask: async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  deleteTask: async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Activities
  getContactActivities: async (contactId) => {
    const res = await fetch(`${API_BASE}/activities/contact/${contactId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createActivity: async (activityData) => {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData)
    });
    return handleResponse(res);
  },

  deleteActivity: async (id) => {
    const res = await fetch(`${API_BASE}/activities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Seed Demo Data
  seedDemoData: async () => {
    const res = await fetch(`${API_BASE}/seed/demo`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
