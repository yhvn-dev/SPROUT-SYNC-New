import * as resetModel from "../models/passwordResetModels.js";
import * as userModel from "../models/userModels.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

// Admin gets all pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await resetModel.getPendingResetRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error getting reset requests:", err);
    res.status(500).json({ message: "Error getting reset requests" });
  }
};

// Admin gets all requests (full history)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await resetModel.getAllResetRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error getting all reset requests:", err);
    res.status(500).json({ message: "Error getting all reset requests" });
  }
};

// Admin resets password
export const resetPasswordByAdmin = async (req, res) => {
  try {
    const { request_id } = req.params;

    // Get request record — hindi na kailangan ng user_id from body
    const resetRequest = await resetModel.getResetRequestById(request_id);
    if (!resetRequest) return res.status(404).json({ message: "Request not found" });

    // Check if still pending
    if (resetRequest.status !== "Pending") {
      return res.status(400).json({ message: "Request is no longer pending" });
    }

    const { user_id } = resetRequest;

    // Generate cryptographically secure temp password
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user password + force first_time_login
    await userModel.updatePassword(user_id, hashedPassword);
    await userModel.updateFirstTimeLogin(user_id, true);

    // Mark request as completed
    await resetModel.completeResetRequest(request_id);

    res.status(200).json({
      message: "Password reset successfully",
      temp_password: tempPassword // ipapakita sa admin
    });

  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
};