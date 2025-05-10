import axios from 'axios';

const API_BASE = 'http://localhost:5002';

export const getTalleres = async () => {
  const response = await axios.get(`${API_BASE}/talleres`);
  return response.data;
};
