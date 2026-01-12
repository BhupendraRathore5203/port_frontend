import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Public API calls
export const publicApi = {
  getHomeData: () => api.get('/public/home'),
  getRotatingTexts: () => api.get('/public/rotating-text'),
  getStats: () => api.get('/public/stats'),

  // Projects
  getProjects: (filters) => api.get('/public/projects', { params: filters }),
  getProject: (project_slug) => api.get(`/public/projects/${project_slug}`),

  // Technologies
  getTechnologies: (filters) => api.get('/public/technologies', { params: filters }),

  // Categories
  getCategories: () => api.get('/public/categories'),

  // Demos
  getDemos: () => api.get('/public/demos'),

  // Testimonials
  getTestimonials: () => api.get('/public/testimonials'),

  // Contact
  sendContactMessage: (data) => api.post('/public/contact', data),

  // Site Settings
  getSiteSettings: () => api.get('/public/settings'),
  getMaintenanceStatus: () => api.get('/public/settings/maintenance'),
  getThemeSettings: () => api.get('/public/settings/theme'),
  getSeoSettings: () => api.get('/public/settings/seo'),
  getSocialLinks: () => api.get('/public/settings/social'),
  getAllSettings: () => api.get('/public/settings/all'),

  // NEW: Experience
  getExperiences: (filters) => api.get('/public/experiences', { params: filters }),
  getExperience: (experience_id) => api.get(`/public/experiences/${experience_id}`),
  getFeaturedExperiences: () => api.get('/public/about/experience'),

  // NEW: Education
  getEducation: (filters) => api.get('/public/education', { params: filters }),
  getEducationDetail: (education_id) => api.get(`/public/education/${education_id}`),
  getFeaturedEducation: () => api.get('/public/about/education'),

  // NEW: Resume
  getResumes: () => api.get('/public/resumes'),
  getResume: (resume_id) => api.get(`/public/resumes/${resume_id}`),
  getPrimaryResume: () => api.get('/public/resumes/primary'),
  downloadResume: (resume_id) => {
    return api.get(`/public/resumes/${resume_id}/download`, {
      responseType: 'blob'
    });
  },
  getAboutResume: async () => {
    try {
      const response = await api.get('/public/about/cv');
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        // Return empty response instead of throwing error
        return { data: null };
      }
      throw error;
    }
  },

  downloadResumeFile: async (resume_id) => {
    try {
      const response = await api.get(`/public/resumes/${resume_id}/download`, {
        responseType: 'blob'
      });

      // Get filename from API response headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'resume.pdf'; // Default

      if (contentDisposition) {
        // Try to extract filename from the Content-Disposition header
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      console.error('Error downloading resume:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to download resume'
      };
    }
  },
};

export default api;