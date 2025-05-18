import axios from 'axios';

const API_BASE = 'http://localhost:5001';

export const register = (nombre, email, password) =>
  axios.post(`${API_BASE}/register`, { nombre, email, password });

export const login = (email, password) =>
  axios.post(`${API_BASE}/login`, { email, password });

