"use client";
import { useEffect, useState, useContext, useCallback } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { usePlantData } from "../../hooks/plantContext.jsx";
import { useUser } from "../../hooks/userContext.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";
import { DeleteNotifModal } from "../../components/deleteNotifModal";
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { PlantModal } from "./modals/plantModal.jsx";
import { Plant_Inventory } from "./plant_inventory.jsx";

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function Plants() {
  const { user } = useUser();
  const { plants, loadPlants, loadNotifs } = usePlantData();
  const {
    openDeleteNotifModal,
    setOpenDeleteNotifModal,
    selectedNotif,
    deleteMode,
    messageContext,
    setMessageContext,
  } = useContext(MessageContext);

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [plantModal, setPlantModal] = useState({
    isOpen: false,
    mode: "insert",
    plant: null,
  });

  const clearMsg = useCallback(() => {
    setMessageContext("");
  }, []);


  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  return (
    <section className="con_main grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr]
      grid-rows-[8vh_auto_auto]
      md:grid-rows-[8vh_auto_82vh] gap-4 h-screen w-full overflow-x-hidden
      overflow-y-auto md:overflow-hidden
      relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="menu_button md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} className="text-[#027c68]" />
      </button>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"
        } md:static md:block`}>
        <Sidebar
          user={user}
          setLogoutOpen={setLogoutOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* HEADER */}
      <div className="col-start-1 col-span-full md:col-start-2">
        <Db_Header notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      </div>

      {/* MAIN CONTENT */}
      <main className="col-start-1 md:col-start-2 row-start-2  md:row-span-2 col-span-full conb bg-white overflow-hidden rounded-2xl">
        <Plant_Inventory setPlantModal={setPlantModal} />
      </main>

      {/* MODALS */}
      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}

  
      <PlantModal
        isOpen={plantModal.isOpen}
        onClose={() => {
          setPlantModal((prev) => ({ ...prev, isOpen: false }));
          setTimeout(() => {
            setPlantModal({ isOpen: false, mode: "insert", plant: null });
          }, 300);
        }}
        plantModalMode={plantModal.mode}
        selectedPlant={plantModal.plant}
        setSuccessMsg={setSuccessMsg}
        reloadPlants={loadPlants}
      />

      {openDeleteNotifModal && (
        <DeleteNotifModal
          isOpen={openDeleteNotifModal}
          selectedNotif={selectedNotif}
          deleteMode={deleteMode}
          onClose={() => setOpenDeleteNotifModal(false)}
          loadNotifs={loadNotifs}
        />
      )}

      {notifOpen && (
        <Notif_Modal
          isOpen={notifOpen}
          onClose={() => setNotifOpen(false)}
        />
      )}

      {successMsg && (
        <FloatSuccessMsg txt={successMsg} clearMsg={clearMsg} />
      )}

      {messageContext && (
        <FloatSuccessMsg txt={messageContext} clearMsg={clearMsg} />
      )}
    </section>



  );
}