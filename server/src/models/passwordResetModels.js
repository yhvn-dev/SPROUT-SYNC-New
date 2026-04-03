import { query } from "../config/db.js";

// Create reset request
export const createResetRequest = async (user_id) => {
  const result = await query(
    `INSERT INTO password_reset_requests (user_id, status)
     VALUES ($1, 'Pending')
     RETURNING *`,
    [user_id]
  );
  return result.rows[0];
};

// Get all pending requests (for admin)
export const getPendingResetRequests = async () => {
  const result = await query(
    `SELECT pr.*, u.username, u.fullname, u.email
     FROM password_reset_requests pr
     JOIN users u ON pr.user_id = u.user_id
     WHERE pr.status = 'Pending'
     ORDER BY pr.requested_at DESC`
  );
  return result.rows;
};

// Get all requests (for admin — full history)
export const getAllResetRequests = async () => {
  const result = await query(
    `SELECT pr.*, u.username, u.fullname, u.email
     FROM password_reset_requests pr
     JOIN users u ON pr.user_id = u.user_id
     ORDER BY pr.requested_at DESC`
  );
  return result.rows;
};

// Get reset request by ID
export const getResetRequestById = async (request_id) => {
  const result = await query(
    `SELECT * FROM password_reset_requests WHERE request_id = $1`,
    [request_id]
  );
  return result.rows[0] || null;
};

// Complete reset request
export const completeResetRequest = async (request_id) => {
  const result = await query(
    `UPDATE password_reset_requests
     SET status = 'Completed', completed_at = NOW()
     WHERE request_id = $1
     RETURNING *`,
    [request_id]
  );
  return result.rows[0];
};

// Check if user has existing pending request
export const checkExistingRequest = async (user_id) => {
  const result = await query(
    `SELECT * FROM password_reset_requests
     WHERE user_id = $1 AND status = 'Pending'`,
    [user_id]
  );
  return result.rows[0] || null;
};


export const rejectResetRequest = async (request_id) => {
  const result = await query(
    `UPDATE password_reset_requests
     SET status = 'Rejected', completed_at = NOW()
     WHERE request_id = $1
     RETURNING *`,
    [request_id]
  );
  return result.rows[0];
};


  

export const deleteResetRequest = async (request_id) => {
  const result = await query(
    `DELETE FROM password_reset_requests
     WHERE request_id = $1
     RETURNING *`,
    [request_id]
  );
  return result.rows[0] || null;
};
