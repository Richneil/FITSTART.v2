import { scoreMetrics } from './scoreMetrics.js';
import { GLOSSARY_TERMS } from '../data/glossary.js';

// API Helper utility for FitStart Frontend
const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:5000');

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

// Guest Assessment Storage Helpers
export function getPendingGuestAssessment() {
  try {
    const data = sessionStorage.getItem('fitstart_guest_assessment') || localStorage.getItem('fitstart_guest_assessment');
    return data ? JSON.parse(data) : null;
  } catch (_) {
    return null;
  }
}

export function setPendingGuestAssessment(assessmentData) {
  try {
    const str = JSON.stringify(assessmentData);
    sessionStorage.setItem('fitstart_guest_assessment', str);
    localStorage.setItem('fitstart_guest_assessment', str);
  } catch (_) {}
}

export function clearPendingGuestAssessment() {
  try {
    sessionStorage.removeItem('fitstart_guest_assessment');
    localStorage.removeItem('fitstart_guest_assessment');
  } catch (_) {}
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
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
  } catch (err) {
    // If it's a network error (server offline / connecting)
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netErr = new Error('Cannot connect to FitStart server. Please ensure the backend server is running on port 5000.');
      netErr.isNetworkError = true;
      throw netErr;
    }
    throw err;
  }
}

export const api = {
  // Auth
  async register({ email, password, firstName, lastName }) {
    const pendingAssessment = getPendingGuestAssessment();
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName,
        pendingAssessment
      })
    });
    if (res.token) {
      setToken(res.token);
      clearPendingGuestAssessment();
    }
    return res;
  },

  async login({ email, password }) {
    const pendingAssessment = getPendingGuestAssessment();
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password,
        pendingAssessment
      })
    });
    if (res.token) {
      setToken(res.token);
      clearPendingGuestAssessment();
    }
    return res;
  },

  async googleAuth(data) {
    const pendingAssessment = getPendingGuestAssessment();
    const res = await request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        pendingAssessment
      })
    });
    if (res.token) {
      setToken(res.token);
      clearPendingGuestAssessment();
    }
    return res;
  },

  async getCurrentUser() {
    return request('/api/auth/me');
  },

  async updateProfile(data) {
    return request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async verify2FALogin({ userId, code }) {
    const pendingAssessment = getPendingGuestAssessment();
    const res = await request('/api/auth/2fa/verify-login', {
      method: 'POST',
      body: JSON.stringify({ 
        userId, 
        code,
        pendingAssessment
      })
    });
    if (res.token) {
      setToken(res.token);
      clearPendingGuestAssessment();
    }
    return res;
  },

  async toggle2FA(enabled) {
    return request('/api/auth/2fa/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled })
    });
  },

  logout() {
    setToken(null);
  },

  // Assessments
  async getAssessments() {
    return request('/api/assessments');
  },

  async getAssessment(id) {
    if (id === 'guest') {
      const guestData = getPendingGuestAssessment();
      if (guestData) {
        return {
          profile: {
            id: 'guest',
            user_id: null,
            fitMao_report_data: guestData.fitMao_report_data,
            parq_answers: guestData.parq_answers,
            assessed_date: guestData.assessed_date || new Date().toISOString()
          }
        };
      }
    }
    return request(`/api/assessments/${id}`);
  },

  async createAssessment({ fitMao_report_data, parq_answers, assessed_date }) {
    try {
      const res = await request('/api/assessments', {
        method: 'POST',
        body: JSON.stringify({ fitMao_report_data, parq_answers, assessed_date })
      });
      return res;
    } catch (err) {
      // If offline or guest connection issue, save guest session locally
      const guestObj = {
        profile_id: 'guest',
        fitMao_report_data,
        parq_answers,
        assessed_date: assessed_date || new Date().toISOString(),
        isGuest: true
      };
      setPendingGuestAssessment(guestObj);
      return guestObj;
    }
  },

  async updateAssessment(id, data) {
    return request(`/api/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteAssessment(id) {
    return request(`/api/assessments/${id}`, {
      method: 'DELETE'
    });
  },

  // Results
  async getResults(profileId) {
    if (profileId === 'guest') {
      const guestData = getPendingGuestAssessment();
      if (guestData) {
        const calculation = scoreMetrics(guestData.fitMao_report_data, guestData.parq_answers);
        return {
          profile: {
            id: 'guest',
            user_id: null,
            fitMao_report_data: guestData.fitMao_report_data,
            parq_answers: guestData.parq_answers,
            assessed_date: guestData.assessed_date
          },
          result: {
            profile_id: 'guest',
            scored_metrics: calculation.scoredMetrics,
            main_focus: calculation.mainFocus,
            top_priorities: calculation.topPriorities,
            otherPriorities: calculation.otherPriorities,
            quickWins: calculation.quickWins,
            firstSteps: calculation.firstSteps,
            becauseYouToldUs: calculation.becauseYouToldUs,
            change_log: guestData.changeLog || []
          },
          isGuest: true
        };
      }
    }

    try {
      return await request(`/api/results/${profileId}`);
    } catch (err) {
      // Fallback to local guest data if available
      const guestData = getPendingGuestAssessment();
      if (guestData) {
        const calculation = scoreMetrics(guestData.fitMao_report_data, guestData.parq_answers);
        return {
          profile: {
            id: profileId,
            user_id: null,
            fitMao_report_data: guestData.fitMao_report_data,
            parq_answers: guestData.parq_answers,
            assessed_date: guestData.assessed_date
          },
          result: {
            profile_id: profileId,
            scored_metrics: calculation.scoredMetrics,
            main_focus: calculation.mainFocus,
            top_priorities: calculation.topPriorities,
            otherPriorities: calculation.otherPriorities,
            quickWins: calculation.quickWins,
            firstSteps: calculation.firstSteps,
            becauseYouToldUs: calculation.becauseYouToldUs,
            change_log: guestData.changeLog || []
          },
          isGuest: true
        };
      }
      throw err;
    }
  },

  async calculateResults(profileId, data = {}) {
    if (profileId === 'guest') {
      const guestData = getPendingGuestAssessment();
      if (guestData) {
        const calculation = scoreMetrics(guestData.fitMao_report_data, guestData.parq_answers);
        return {
          message: 'Guest calculation computed.',
          result: {
            profile_id: 'guest',
            scored_metrics: calculation.scoredMetrics,
            main_focus: calculation.mainFocus,
            top_priorities: calculation.topPriorities,
            otherPriorities: calculation.otherPriorities,
            quickWins: calculation.quickWins,
            firstSteps: calculation.firstSteps,
            becauseYouToldUs: calculation.becauseYouToldUs,
            change_log: data.changeLog || []
          },
          isGuest: true
        };
      }
    }

    try {
      return await request(`/api/results/${profileId}`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      const guestData = getPendingGuestAssessment();
      if (guestData) {
        const calculation = scoreMetrics(guestData.fitMao_report_data, guestData.parq_answers);
        return {
          message: 'Calculated results fallback.',
          result: {
            profile_id: profileId,
            scored_metrics: calculation.scoredMetrics,
            main_focus: calculation.mainFocus,
            top_priorities: calculation.topPriorities,
            otherPriorities: calculation.otherPriorities,
            quickWins: calculation.quickWins,
            firstSteps: calculation.firstSteps,
            becauseYouToldUs: calculation.becauseYouToldUs,
            change_log: data.changeLog || []
          },
          isGuest: true
        };
      }
      throw err;
    }
  },

  // Chat
  async sendChatMessage({ message, profileId, context }) {
    return request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, profileId, context })
    });
  },

  // Glossary
  async getGlossary() {
    try {
      return await request('/api/glossary');
    } catch (_) {
      return { glossary: GLOSSARY_TERMS };
    }
  }
};
