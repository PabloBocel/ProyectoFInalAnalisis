import axios from 'axios';

const API_BASE = 'http://localhost:5003';

export const crearReserva = async (usuario, taller_id) => {
  return axios.post(`${API_BASE}/reservar`, {
    usuario,
    taller_id
  });
};
