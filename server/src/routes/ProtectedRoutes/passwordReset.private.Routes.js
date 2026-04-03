
import express from "express";
import * as resetController from "../../controllers/passwordResets.Controller.js"
import {verifyAccessToken} from "../../middlewares/authMiddleware.js"

const router = express.Router();
    
    router.get("/get/all",verifyAccessToken,resetController.getAllRequests);
    router.get("/get/pending",verifyAccessToken,resetController.getPendingRequests);
    router.patch("/patch/reset/:request_id/approve", verifyAccessToken, resetController.resetPasswordByAdmin);
    router.patch("/patch/reset/:request_id/reject", verifyAccessToken, resetController.rejectPasswordReset);
    router.delete("/delete/reset-request/:request_id", verifyAccessToken, resetController.handleDeleteResetRequest);

export default router;
    
