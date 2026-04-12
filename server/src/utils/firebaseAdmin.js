import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendPushNotification = async (pushToken, title, body, type = "info", status = "Low", data = {}) => {
  try {
    const message = {
      token: pushToken,
      notification: { title, body },
      data: { title, body, type, status, ...data },
      webpush: {
        headers: { Urgency: "high" },
        notification: {
          title,
          body,
          icon: "/favicon.ico",
        },
        fcmOptions: { link: "/dashboard" }
      }
    };
    const response = await admin.messaging().send(message);
    console.log("✅ FCM Sent:", response);
    return { success: true, response };

  } catch (err) {
    const isInvalidToken =
      err.errorInfo?.code === 'messaging/registration-token-not-registered' ||
      err.errorInfo?.code === 'messaging/invalid-registration-token';

    if (isInvalidToken) {
      console.warn(`⚠️ Stale token skipped: ${pushToken}`);
      return { success: false, shouldRemove: true, token: pushToken };
    }

    console.error("❌ FCM Error:", err);
    return { success: false, token: pushToken };
  }
};



