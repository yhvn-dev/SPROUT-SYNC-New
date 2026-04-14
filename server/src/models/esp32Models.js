import { query } from "../config/db.js"



export const getValveStatus = async (name) => {
    const result = await query(
        'SELECT * FROM valve_status WHERE name = $1', [name]
    );
    return result.rows[0];
};


export const getAllValveStatus = async () => {
    const result = await query('SELECT * FROM valve_status');
    return result.rows;
};

export const updateValveStatus = async (name, status, force_close) => {
    await query(
        `UPDATE valve_status 
         SET status = $1, force_close = $2, updated_at = NOW() 
         WHERE name = $3`,
        [status, force_close, name]
    );
};

