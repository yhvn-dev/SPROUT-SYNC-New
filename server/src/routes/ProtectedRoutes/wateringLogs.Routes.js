import express from 'express';
import * as  wateringLogsController from '../../controllers/wateringLogs.Controller.js';
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

    router.post('/post/',wateringLogsController.createWateringLog);
    router.get('/get/',verifyAccessToken,wateringLogsController.getAllWateringLogs);
    router.get('/get/:id',verifyAccessToken,wateringLogsController.getWateringLogById);
    router.get('/get/plant/:plant_name',verifyAccessToken,wateringLogsController.getWateringLogsByPlantName);
    router.put('/put/:id',verifyAccessToken,wateringLogsController.updateWateringLog);
    router.delete('/delete/all',verifyAccessToken,wateringLogsController.deleteAllWateringLogs)
    router.delete('/delete/:id',verifyAccessToken,wateringLogsController.deleteWateringLog);

export default router;