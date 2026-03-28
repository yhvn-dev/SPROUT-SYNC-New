import { createContext, useState, useEffect } from "react";
import * as esp32Services from "../data/esp32Services";

export const ESP32Context = createContext();

export function ESP32Provider({ children }) {
  const [ESP32Status, setESP32Status] = useState(null);
  const [valveStatus, setValveStatus] = useState([]);

  useEffect(() => {
    getESP32Status();
    getValveStatus(); // ✅ fetch on load
    const interval = setInterval(() => {
      getESP32Status();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function getESP32Status() {
    try {
      const esp32Status = await esp32Services.getESP32Status();
      setESP32Status(esp32Status);
    } catch (err) {
      console.error(err);
    }
  }

  async function getValveStatus() {
    try {
      const res = await esp32Services.getAllValveStatus();
      console.log("VALVE STATUS",res)
      setValveStatus(res);
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <ESP32Context.Provider value={{ ESP32Status, setESP32Status, valveStatus, getValveStatus }}>
      {children}
    </ESP32Context.Provider>
  );
}