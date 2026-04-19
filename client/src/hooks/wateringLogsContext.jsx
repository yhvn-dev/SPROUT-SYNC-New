import { createContext, useState, useEffect, useContext, useCallback } from "react";
import * as wateringLogService from "../data/wateringLogsServices";

export const WateringLogContext = createContext(null);

export function WateringLogProvider({ children }) {
  const [wateringLogs, setWateringLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const loadWateringLogs = useCallback(async () => {
    try {
      const res = await wateringLogService.getAllWateringLogs()
      setWateringLogs(res);
    } catch (err) {
      console.error("Error fetching watering logs:", err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    loadWateringLogs();
  }, []);

  const addWateringLog = async (plant_name, duration) => {
    try {
      const newLog = await wateringLogService.createWateringLog(plant_name, duration);
      setWateringLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      console.error("Error creating watering log:", err);
    }
  };

  const editWateringLog = async (id, plant_name, duration) => {
    try {
      const updated = await wateringLogService.updateWateringLog(id, plant_name, duration);
      setWateringLogs((prev) =>
        prev.map((log) => (log.watering_log_id === id ? updated : log))
      );
    } catch (err) {
      console.error("Error updating watering log:", err);
    }
  };

  const removeWateringLog = async (id) => {
    try {
      await wateringLogService.deleteWateringLog(id);
      setWateringLogs((prev) => prev.filter((log) => log.watering_log_id !== id));
    } catch (err) {
      console.error("Error deleting watering log:", err);
    }
  };

  const removeAllWateringLogs = async () => {
    try {
      await wateringLogService.deleteAllWateringLogs();
      setWateringLogs([]);
    } catch (err) {
      console.error("Error deleting all watering logs:", err);
    }
  };

  const loadLogsByPlantName = useCallback(async (plant_name) => {
    try {
      const res = await wateringLogService.getWateringLogsByPlantName(plant_name);
      setWateringLogs(res);
    } catch (err) {
      console.error("Error fetching logs by plant name:", err);
    }
  }, []);

  return (
    <WateringLogContext.Provider
      value={{
        wateringLogs,
        setWateringLogs,
        selectedLog,
        setSelectedLog,
        loadWateringLogs,
        addWateringLog,
        editWateringLog,
        removeWateringLog,
        removeAllWateringLogs,
        loadLogsByPlantName,
      }}
    >
      {children}
    </WateringLogContext.Provider>
  );
}

export const useWateringLog = () => {
  const context = useContext(WateringLogContext);
  if (!context) throw new Error("useWateringLog must be used within WateringLogProvider");
  return context;
};