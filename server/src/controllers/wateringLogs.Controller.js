import * as WateringLogModel from '../models/wateringLogsModels.js';

/* =========================
   CREATE WATERING LOG
========================= */
export const createWateringLog = async (req, res) => {
  try {
    const { plant_name, started_at, ended_at, duration } = req.body;
    if (!plant_name || !started_at || !ended_at || duration === undefined) {
      return res.status(400).json({ message: "plant_name, started_at, ended_at, and duration are required." });
    }
    const log = await WateringLogModel.createWateringLog(plant_name, started_at, ended_at, duration);
    res.status(201).json(log);
  } catch (err) {
    console.error("CONTROLLER: Error creating watering log", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET ALL WATERING LOGS
========================= */
export const getAllWateringLogs = async (req, res) => {
  try {
    const logs = await WateringLogModel.getAllWateringLogs();
    res.status(200).json(logs);
  } catch (err) {
    console.error("CONTROLLER: Error fetching watering logs", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET WATERING LOG BY ID
========================= */
export const getWateringLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await WateringLogModel.getWateringLogById(id);
    if (!log) return res.status(404).json({ message: "Watering log not found." });
    res.status(200).json(log);
  } catch (err) {
    console.error("CONTROLLER: Error fetching watering log by ID", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET LOGS BY PLANT NAME
========================= */
export const getWateringLogsByPlantName = async (req, res) => {
  try {
    const { plant_name } = req.params;
    const logs = await WateringLogModel.getWateringLogsByPlantName(plant_name);
    res.status(200).json(logs);
  } catch (err) {
    console.error("CONTROLLER: Error fetching logs by plant name", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   UPDATE WATERING LOG
========================= */
export const updateWateringLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { plant_name, started_at, ended_at, duration } = req.body;
    if (!plant_name || !started_at || !ended_at || duration === undefined) {
      return res.status(400).json({ message: "plant_name, started_at, ended_at, and duration are required." });
    }
    const updated = await WateringLogModel.updateWateringLog(id, plant_name, started_at, ended_at, duration);
    if (!updated) return res.status(404).json({ message: "Watering log not found." });
    res.status(200).json(updated);
  } catch (err) {
    console.error("CONTROLLER: Error updating watering log", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


/* =========================
   DELETE WATERING LOG
========================= */
export const deleteWateringLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WateringLogModel.deleteWateringLog(id);
    if (!deleted) return res.status(404).json({ message: "Watering log not found." });
    res.status(200).json({ message: "Watering log deleted.", data: deleted });
  } catch (err) {
    console.error("CONTROLLER: Error deleting watering log", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   DELETE ALL WATERING LOGS
========================= */
export const deleteAllWateringLogs = async (req, res) => {
  try {
    const deleted = await WateringLogModel.deleteAllWateringLogs();
    if (!deleted || deleted.length === 0) return res.status(404).json({ message: "No watering logs found." });
    res.status(200).json({ message: "All watering logs deleted.", data: deleted });
  } catch (err) {
    console.error("CONTROLLER: Error deleting all watering logs", err);
    res.status(500).json({ message: "Internal server error" });
  }
};