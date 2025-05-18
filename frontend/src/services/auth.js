import axios from 'axios';

const API_BASE = 'http://localhost:5001';

export const register = (nombre, email, password) =>
  axios.post(`${API_BASE}/register`, { nombre, email, password });

export const login = (email, password) =>
  axios.post(`${API_BASE}/login`, { email, password });

export const actualizarPerfil = async (email, datos) => {
  return axios.put(`http://localhost:5001/usuarios/${email}`, datos);
};

export const obtenerPerfil = async (email) => {
  const res = await axios.get(`${API_BASE}/usuarios/${email}`);
  return res.data;
};


