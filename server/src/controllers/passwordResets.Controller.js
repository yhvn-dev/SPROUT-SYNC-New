import * as resetModel from "../models/passwordResetModels.js";
import * as userModel from "../models/userModels.js";
import bcrypt from "bcrypt";
// ← crypto removed, hindi na kailangan

/* ================= REQUEST PASSWORD RESET (User) ================= */
export const requestPasswordReset = async (req, res) => {
  try {
    const { login } = req.body;
    if (!login) return res.status(400).json({ message: "Username or email is required" });

    const user = await userModel.getUserByUsernameOrEmail(login);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const existing = await resetModel.checkExistingRequest(user.user_id);
    if (existing) {
      return res.status(400).json({
        message: "You already have a pending reset request. Please wait for admin to reset your password."
      });
    }

    const request = await resetModel.createResetRequest(user.user_id);
    res.status(201).json({
      message: "Password reset request sent. Please wait for admin to reset your password.",
      data: request
    });

  } catch (err) {
    console.error("Error requesting password reset:", err);
    res.status(500).json({ message: "Error requesting password reset" });
  }
};

/* ================= GET PENDING REQUESTS (Admin) ================= */
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await resetModel.getPendingResetRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error getting reset requests:", err);
    res.status(500).json({ message: "Error getting reset requests" });
  }
};

/* ================= GET ALL REQUESTS (Admin) ================= */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await resetModel.getAllResetRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error getting all reset requests:", err);
    res.status(500).json({ message: "Error getting all reset requests" });
  }
};




/* ================= APPROVE & RESET PASSWORD (Admin) ================= */
export const resetPasswordByAdmin = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { password } = req.body; // ← galing sa modal ng admin

    // Validation
    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Password is required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const resetRequest = await resetModel.getResetRequestById(request_id);
    if (!resetRequest) return res.status(404).json({ message: "Request not found" });

    if (resetRequest.status !== "Pending") {
      return res.status(400).json({ message: "Request is no longer pending" });
    }

    const { user_id } = resetRequest;

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updateUserPassword(user_id, hashedPassword);
    await userModel.updateFirstTimeLogin(user_id, true);
    await resetModel.completeResetRequest(request_id); // status → "Completed"

    res.status(200).json({ message: "Password reset successfully." });

  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
};




/* ================= REJECT PASSWORD RESET (Admin) ================= */
export const rejectPasswordReset = async (req, res) => {
  try {
    const { request_id } = req.params;

    const resetRequest = await resetModel.getResetRequestById(request_id);
    if (!resetRequest) return res.status(404).json({ message: "Request not found" });

    if (resetRequest.status !== "Pending") {
      return res.status(400).json({ message: "Request is no longer pending" });
    }

    await resetModel.rejectResetRequest(request_id); // status → "Rejected"

    res.status(200).json({ message: "Request rejected successfully." });

  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ message: "Error rejecting request" });
  }
};