import express from "express";
import * as resetController from "../../controllers/passwordResets.Controller.js"

const router = express.Router();

    router.post("/post/request", resetController.requestPasswordReset);

export default router;