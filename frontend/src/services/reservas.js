import axios from 'axios';

const API_BASE = 'http://localhost:5003';

export const crearReserva = async (usuario, taller_id) =>
  axios.post(`${API_BASE}/reservar`, { usuario, taller_id });

export const getReservas = async (usuario) =>
  axios.get(`${API_BASE}/reservas`, { params: { usuario } }).then(res => res.data);

export const cancelarReserva = async (id) =>
  axios.put(`${API_BASE}/reservas/${id}/cancelar`);

export const pagarReserva = async (id) =>
  axios.put(`${API_BASE}/reservas/${id}/pagar`);

