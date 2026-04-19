import { query } from '../config/db.js';

/* =========================
   CREATE WATERING LOG
========================= */
export const createWateringLog = async (plant_name, duration) => {
  try {
    const { rows } = await query(
      `
      INSERT INTO watering_logs (plant_name, duration)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [plant_name, duration]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error creating watering log", err);
    throw err;
  }
};

/* =========================
   GET ALL WATERING LOGS
========================= */
export const getAllWateringLogs = async () => {
  try {
    const { rows } = await query(
      `SELECT * FROM watering_logs ORDER BY ts DESC`
    );
    return rows;
  } catch (err) {
    console.error("MODELS: Error fetching watering logs", err);
    throw err;
  }
};

/* =========================
   GET WATERING LOG BY ID
========================= */
export const getWateringLogById = async (watering_log_id) => {
  try {
    const { rows } = await query(
      `SELECT * FROM watering_logs WHERE watering_log_id = $1`,
      [watering_log_id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("MODELS: Error fetching watering log by ID", err);
    throw err;
  }
};

/* =========================
   GET LOGS BY PLANT NAME
========================= */
export const getWateringLogsByPlantName = async (plant_name) => {
  try {
    const { rows } = await query(
      `SELECT * FROM watering_logs WHERE plant_name = $1 ORDER BY ts DESC`,
      [plant_name]
    );
    return rows;
  } catch (err) {
    console.error("MODELS: Error fetching watering logs by plant name", err);
    throw err;
  }
};

/* =========================
   UPDATE WATERING LOG
========================= */
export const updateWateringLog = async (watering_log_id, plant_name, duration) => {
  try {
    const { rows } = await query(
      `
      UPDATE watering_logs
      SET plant_name = $1, duration = $2
      WHERE watering_log_id = $3
      RETURNING *;
      `,
      [plant_name, duration, watering_log_id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("MODELS: Error updating watering log", err);
    throw err;
  }
};




/* =========================
   DELETE WATERING LOG
========================= */
export const deleteWateringLog = async (watering_log_id) => {
  try {
    const { rows } = await query(
      `DELETE FROM watering_logs WHERE watering_log_id = $1 RETURNING *;`,
      [watering_log_id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("MODELS: Error deleting watering log", err);
    throw err;
  }
  
};





export const deleteALlWateringLogs = async () => {
  try {
    const { rows } = await query(
      `DELETE FROM watering_logs RETURNING *;`);
    return rows[0] || null;
  } catch (err) {
    console.error("MODELS: Error deleting watering log", err);
    throw err;
  }
};