import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Adjust port if needed

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getLocations = () => api.get('/locations');
export const createLocation = (data) => api.post('/locations', data);
export const updateLocation = (id, data) => api.put(`/locations/${id}`, data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);

export const getPopulationStats = () => api.get('/population');
export const updatePopulationStats = (data) => api.put('/population', data);

export const getServices = () => api.get('/services');
export const createServiceRequest = (data) => api.post('/services', data);
export const searchService = (nik) => api.get(`/services/search/${nik}`);
export const updateServiceStatus = (id, status) => api.post(`/services/${id}/status`, { id, status });

export const login = (credentials) => api.post('/auth/login', credentials);

export default api;
