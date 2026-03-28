import { clients } from "../app.js";
import { updateValveStatus,getAllValveStatus } from "../models/esp32Models.js"; 


const sendToESP32 = (command) => {
  clients.forEach(client => {
    if (client.connected) {
      client.sendUTF(command);
    }
  });
};

export const getValveStatus = async (req, res) => {
  try {
    const valves = await getAllValveStatus();
    return res.status(200).json({ success: true, data: valves });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching valve status" });
  }
};



// ===== FORCE CLOSE / AUTO BOKCHOY VALVE =====
export const closeBokchoyGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    const command =
      action === "FORCE_OFF" ? "BOKCHOY_OFF" :
      action === "AUTO" ? "BOKCHOY_AUTO" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    await updateValveStatus('bokchoy', action === "AUTO", action === "FORCE_OFF");
    sendToESP32(command);

    res.status(200).json({ success: true, message: `Bokchoy valve set to "${action}"` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};




// ===== FORCE CLOSE / AUTO PECHAY VALVE =====
export const closePechayGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    const command =
      action === "FORCE_OFF" ? "PECHAY_OFF" :
      action === "AUTO" ? "PECHAY_AUTO" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    await updateValveStatus('pechay', action === "AUTO", action === "FORCE_OFF");
    sendToESP32(command);

    res.status(200).json({ success: true, message: `Pechay valve set to "${action}"` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};




// ===== FORCE CLOSE / AUTO MUSTASA VALVE =====
export const closeMustasaGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    const command =
      action === "FORCE_OFF" ? "MUSTASA_OFF" :
      action === "AUTO" ? "MUSTASA_AUTO" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    await updateValveStatus('mustasa', action === "AUTO", action === "FORCE_OFF");
    sendToESP32(command);

    res.status(200).json({ success: true, message: `Mustasa valve set to "${action}"` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};




// ===== FORCE CLOSE / AUTO ALL VALVES =====
export const closeAllGroups = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    if (action !== "FORCE_OFF" && action !== "AUTO") {
      return res.status(400).json({ message: "Invalid action" });
    }

    const suffix = action === "FORCE_OFF" ? "OFF" : "AUTO";
    const commands = [
      `BOKCHOY_${suffix}`,
      `PECHAY_${suffix}`,
      `MUSTASA_${suffix}`
    ];

    // ✅ I-save lahat sa DB + send sa ESP32
    await Promise.all([
      updateValveStatus('bokchoy', action === "AUTO", action === "FORCE_OFF"),
      updateValveStatus('pechay', action === "AUTO", action === "FORCE_OFF"),
      updateValveStatus('mustasa', action === "AUTO", action === "FORCE_OFF"),
    ]);
    commands.forEach(command => sendToESP32(command));

    res.status(200).json({ success: true, message: `All valves set to "${action}"` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command to ESP32" });
  }
};



// ===== SYSTEM POWER =====
export const systemPower = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    if (action !== "ON" && action !== "OFF") {
      return res.status(400).json({ message: "Invalid action. Use ON or OFF" });
    }

    sendToESP32(`SYSTEM_${action}`);
    res.status(200).json({ success: true, message: `System is now ${action}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending power command to ESP32" });
  }
};


