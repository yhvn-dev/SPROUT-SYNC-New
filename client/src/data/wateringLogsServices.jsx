import api from '../utils/api.js';


/* =========================
   CREATE WATERING LOG
========================= */
export const createWateringLog = async (plant_name, duration) => {
  const response = await api.post('/wateringLogs/post', { plant_name, duration });
  return response.data;
};

/* =========================
   GET ALL WATERING LOGS
========================= */
export const getAllWateringLogs = async () => {
  const response = await api.get('/wateringLogs/get');
  return response.data;
};

/* =========================
   GET WATERING LOG BY ID
========================= */
export const getWateringLogById = async (id) => {
  const response = await api.get(`/wateringLogs/get/${id}`);
  return response.data;
};

/* =========================
   GET LOGS BY PLANT NAME
========================= */
export const getWateringLogsByPlantName = async (plant_name) => {
  const response = await api.get(`/wateringLogs/get/plant/${plant_name}`);
  return response.data;
};

/* =========================
   UPDATE WATERING LOG
========================= */
export const updateWateringLog = async (id, plant_name, duration) => {
  const response = await api.put(`/wateringLogs/put/${id}`, { plant_name, duration });
  return response.data;
};

/* =========================
   DELETE WATERING LOG BY ID
========================= */
export const deleteWateringLog = async (id) => {
  const response = await api.delete(`/wateringLogs/delete/${id}`);
  return response.data;
};

/* =========================
   DELETE ALL WATERING LOGS
========================= */
export const deleteAllWateringLogs = async () => {
  const response = await api.delete('/wateringLogs/delete/all');
  return response.data;
};