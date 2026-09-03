// API Helper utility for FitStart Frontend
const API_BASE = 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('fitstart_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('fitstart_token', token);
  } else {
    localStorage.removeItem('fitstart_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  async register({ email, password, firstName, lastName }) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    if (res.token) setToken(res.token);
    return res;
  },

  async login({ email, password }) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) setToken(res.token);
    return res;
  },

  async googleAuth(data) {
    const res = await request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.token) setToken(res.token);
    return res;
  },

  async getCurrentUser() {
    return request('/auth/me');
  },

  async updateProfile(data) {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async verify2FALogin({ userId, code }) {
    const res = await request('/auth/2fa/verify-login', {
      method: 'POST',
      body: JSON.stringify({ userId, code })
    });
    if (res.token) setToken(res.token);
    return res;
  },

  async toggle2FA(enabled) {
    return request('/auth/2fa/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled })
    });
  },

  logout() {
    setToken(null);
  },

  // Assessments
  async getAssessments() {
    return request('/assessments');
  },

  async getAssessment(id) {
    return request(`/assessments/${id}`);
  },

  async createAssessment({ fitMao_report_data, parq_answers, assessed_date }) {
    return request('/assessments', {
      method: 'POST',
      body: JSON.stringify({ fitMao_report_data, parq_answers, assessed_date })
    });
  },

  async updateAssessment(id, data) {
    return request(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteAssessment(id) {
    return request(`/assessments/${id}`, {
      method: 'DELETE'
    });
  },

  // Results
  async getResults(profileId) {
    return request(`/results/${profileId}`);
  },

  async calculateResults(profileId, data = {}) {
    return request(`/results/${profileId}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Chat
  async sendChatMessage({ message, profileId, context }) {
    return request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, profileId, context })
    });
  },

  // Glossary
  async getGlossary() {
    return request('/glossary');
  }
};
