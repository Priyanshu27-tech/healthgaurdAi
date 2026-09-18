import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healthguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local storage
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('healthguard_token');
        localStorage.removeItem('healthguard_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// Patient Endpoints
export const patientService = {
  getProfile: () => api.get('/patients/profile'),
  updateProfile: (data) => api.put('/patients/profile', data),
  getAssessments: () => api.get('/patients/assessments'),
  getAppointments: () => api.get('/patients/appointments'),
  getRecords: () => api.get('/patients/records'),
};

// Doctor Endpoints
export const doctorService = {
  getDoctors: () => api.get('/doctors'),
  getProfile: () => api.get('/doctors/profile'),
  updateProfile: (data) => api.put('/doctors/profile', data),
  getPatients: (params) => api.get('/doctors/patients', { params }),
  getPatientById: (id) => api.get(`/doctors/patients/${id}`),
  getAssessments: (params) => api.get('/doctors/assessments', { params }),
  getAssessmentById: (id) => api.get(`/doctors/assessments/${id}`),
  submitReview: (data) => api.post('/doctors/reviews', data),
  getAppointments: () => api.get('/doctors/appointments'),
};

// Assessment Endpoints
export const assessmentService = {
  submit: (data) => api.post('/assessments', data),
  getById: (id) => api.get(`/assessments/${id}`),
};

// Appointment Endpoints
export const appointmentService = {
  create: (data) => api.post('/appointments', data),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
};

// Medical Records Endpoints
export const recordService = {
  create: (data) => api.post('/records', data),
  getByPatient: (patientId) => api.get(`/records/${patientId}`),
};

// Notifications Endpoints
export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// Future ML Readiness Check
export const mlService = {
  getStatus: () => api.get('/predictions/status'),
};

export default api;
