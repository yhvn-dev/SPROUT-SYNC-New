// trayGroups.model.js
import { query } from "../config/db.js";

export const readTrayGroups = async () => {
  try {
    const sql = `
      SELECT 
        tg.tray_group_id,
        tg.tray_group_name,
        tg.min_moisture,
        tg.max_moisture,
        tg.is_watering,
        tg.location,
        tg.created_at,
        tg.updated_at,
        COUNT(s.sensor_id) AS sensor_count
      FROM tray_groups tg
      LEFT JOIN trays t ON t.tray_group_id = tg.tray_group_id
      LEFT JOIN sensors s ON s.tray_id = t.tray_id
      GROUP BY 
        tg.tray_group_id,
        tg.tray_group_name,
        tg.min_moisture,
        tg.max_moisture,
        tg.is_watering,
        tg.location,
        tg.created_at,
        tg.updated_at
      ORDER BY 
        LOWER(tg.tray_group_name) ASC
    `;
    const result = await query(sql);
    return result.rows;       
  } catch (error) {
    throw error;
  }
};


export const readTrayGroupById = async (tray_group_id) => {
  try {
    const sql = `SELECT * FROM tray_groups WHERE tray_group_id = $1`;
    const result = await query(sql, [tray_group_id]);
    return result.rows[0];       
  } catch (error) {
    throw error;
  }
};



export const createTrayGroups = async (trayGroupData) => {
  const { is_watering, location } = trayGroupData;

  try {
    const countResult = await query(`SELECT COUNT(*) FROM tray_groups`);
    const count = parseInt(countResult.rows[0].count, 10);
    const autoName = `Tray Group ${count + 1}`;

    const sql = `
      INSERT INTO tray_groups
      (tray_group_name, min_moisture, max_moisture, is_watering, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [autoName, 0, 0, is_watering ?? false, location];
    const insert = await query(sql, values);
    return insert.rows[0];

  } catch (error) {
    throw error;
  }
};


export const updateTrayGroups = async (trayGroupData, tray_group_id) => {
  const { is_watering, location } = trayGroupData;

  try {
    const existingQuery = await query(
      `SELECT tray_group_name FROM tray_groups WHERE tray_group_id = $1`,
      [tray_group_id]
    );

    const existingGroup = existingQuery.rows[0];
    if (!existingGroup) throw new Error("Tray group not found");

    const sql = `
      UPDATE tray_groups
      SET is_watering  = $1,
          location     = $2,
          updated_at   = NOW()
      WHERE tray_group_id = $3
      RETURNING *
    `;

    const values = [is_watering ?? false, location, tray_group_id];
    const updated = await query(sql, values);
    return updated.rows[0];

  } catch (error) {
    throw error;
  }
};


// ===== DELETE a tray group =====
export const deleteTrayGroups = async (tray_group_id) => {
  try {
    const sql = `DELETE FROM tray_groups WHERE tray_group_id = $1 RETURNING *`;
    const result = await query(sql, [tray_group_id]);
    return result.rows[0];        
  } catch (error) {
    throw error;
  }
};