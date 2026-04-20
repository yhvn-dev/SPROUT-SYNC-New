import { createContext, useState, useCallback } from "react";
import * as notifServices from "../data/notifsServices"; // ← i-adjust ang path

export const MessageContext = createContext();

export function MessagesProvider({ children }) {
  const [messageContext, setMessageContext] = useState("");
  const [openDeleteNotifModal, setOpenDeleteNotifModal] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState([]);
  const [deleteMode, setDeleteMode] = useState("");
  const [notifs, setNotifs] = useState([]); // ← dagdag

  const loadNotifs = useCallback(async () => {
    try {
      const data = await notifServices.getNotifs(); // ← i-adjust kung ano ang function mo
      setNotifs(data);
    } catch (err) {
      console.error("Error loading notifs", err);
    }
  }, []);

  return (
    <MessageContext.Provider value={{
      messageContext, setMessageContext,
      openDeleteNotifModal, setOpenDeleteNotifModal,
      selectedNotif, setSelectedNotif,
      deleteMode, setDeleteMode,
      notifs, setNotifs,
      loadNotifs, // ← expose na
    }}>
      {children}
    </MessageContext.Provider>
  );
}