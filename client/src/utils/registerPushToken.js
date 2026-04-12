// src/utils/registerPushToken.js
import { getPushToken } from "./firebase";
import { getDeviceInfo } from "./getDeviceInfo";
import { registerDevice } from "../data/deviceTokenServices";

export const registerPushToken = async (user_id) => {
  try {
    const permission = Notification.permission;
    if (permission !== "granted") return; 

    const pushToken = await getPushToken();
    if (!pushToken) return;

    const deviceInfo = getDeviceInfo();

    await registerDevice({
      user_id,
      push_token: pushToken,
      device_type: deviceInfo.device_type,
      device_info: JSON.stringify(deviceInfo),
    });

    console.log("✅ Token refreshed silently");
  } catch (err) {
    console.error("❌ Silent token refresh failed:", err);
  }
};