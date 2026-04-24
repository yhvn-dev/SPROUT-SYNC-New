import { useState, useContext } from "react";

import { usePlantData } from "../../hooks/plantContext.jsx";
import { useUser } from "../../hooks/userContext.jsx";
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { useDarkMode } from "../../hooks/useDarkmode.jsx";

import WaterLevelMonitoring from "./water_level_monitoring_logs.jsx";
import MoistureMonitoring from "./moisture_monitoring_logs.jsx";
import DeleteLogsModal from "./components/modal.jsx";

import { Sidebar } from "../../components/sidebar.jsx";
import { Db_Header } from "../../components/db_header.jsx";

import { Notif_Modal } from "../../components/notifModal.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { DeleteNotifModal } from "../../components/deleteNotifModal.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";

import * as readingsService from "../../data/readingsServices.jsx";
import { Menu } from "lucide-react";

export default function Irrigation_Monitoring_Logs() {
  const { user } = useUser();
  const {
    openDeleteNotifModal,
    setOpenDeleteNotifModal,
    selectedNotif,
    deleteMode,
    messageContext,
    setMessageContext,
  } = useContext(MessageContext);

  const isDark = useDarkMode();

  const [activePage, setActivePage] = useState("water");
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    mode: null,
    logType: null,
    log: null,
  });

  const openDeleteOne = (logType, log) =>
    setDeleteModal({ open: true, mode: "delete-one", logType, log });

  const openDeleteAll = (logType) =>
    setDeleteModal({ open: true, mode: "delete-all", logType, log: null });

  const closeDeleteModal = () =>
    setDeleteModal({ open: false, mode: null, logType: null, log: null });

  const { readings = [], loadReadings, loadNotifs } = usePlantData();

  const moistureReadings = readings.filter(r => [5, 6, 7].includes(r.sensor_id));
  const waterLevelReadings = readings.filter(r => r.sensor_id === 8);

  const handleDeleteConfirm = async () => {
    const { mode, logType, log } = deleteModal;

    try {
      if (logType === "water-level") {
        if (mode === "delete-all") {
          await readingsService.deleteAllReadingsByType("ultra_sonic");
          await loadReadings();
          setMessageContext("All water level logs deleted.");
        } else {
          await readingsService.deleteReading(log.reading_id);
          await loadReadings();
          setMessageContext("Water level data deleted.");
        }
      }

      if (logType === "moisture") {
        if (mode === "delete-all") {
          await readingsService.deleteAllReadingsByType("moisture");
          await loadReadings();
          setMessageContext("All moisture logs deleted.");
        } else {
          await readingsService.deleteReading(log.reading_id);
          await loadReadings();
          setMessageContext("Soil Moisture log deleted.");
        }
      }

    } catch (err) {
      console.error("Delete failed:", err?.message || err);
      setMessageContext("Something went wrong. Please try again.");
    } finally {
      closeDeleteModal();
    }
  };

  const PAGES = [
    {
      id: "water",
      label: "Water Level",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0c0 0-5 6-5 10a5 5 0 0010 0C17 8 12 2 12 2z" />
        </svg>
      ),
      component: (
        <WaterLevelMonitoring
          waterLevelReadings={waterLevelReadings}
          onDeleteOne={(log) => openDeleteOne("water-level", log)}
          onDeleteAll={() => openDeleteAll("water-level")}
          isDark={isDark}
        />
      ),
    },
    {
      id: "moisture",
      label: "Soil Moisture",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      component: (
        <MoistureMonitoring
          moistureReadings={moistureReadings}
          onDeleteOne={(log) => openDeleteOne("moisture", log)}
          onDeleteAll={() => openDeleteAll("moisture")}
          isDark={isDark}
        />
      ),
    },
  ];

  const current = PAGES.find(p => p.id === activePage);
  if (!user) return <div>Loading...</div>;

  return (
    <section className={`con_main w-full min-h-screen overflow-hidden flex flex-col md:grid md:grid-cols-[15fr_85fr] md:grid-rows-[auto_1fr] gap-4 relative transition-colors duration-300
      ${isDark
        ? "bg-[var(--metal-dark1)]"
        : "bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]"
      }`}>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`cursor-pointer menu_button md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-lg shadow-lg transition-colors duration-300
          ${isDark ? "bg-[var(--metal-dark1)] text-white" : "bg-white text-gray-800"}`}>
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block md:row-span-full`}>
        <Sidebar user={user} setLogoutOpen={setLogoutOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Main content */}
      <div className="md:col-start-2 flex flex-col gap-4 pb-4">
        <Db_Header setNotifOpen={setNotifOpen} />

        <div className="w-full max-w-full sm:max-w-7xl mx-auto space-y-4 px-4 sm:px-0">

          {/* Tab Nav */}
          <div className={`rounded-3xl p-4 shadow-sm w-full transition-colors duration-300
            ${isDark ? "bg-[var(--metal-dark1)] border border-white/10" : "bg-white"}`}>
            <nav className="flex items-center gap-2 w-full">
              {PAGES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  className={`cursor-pointer flex-1 flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${activePage === p.id
                      ? "bg-[#027e69] text-white shadow-sm"
                      : isDark
                        ? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}>
                  <span className={activePage === p.id ? "text-white" : isDark ? "text-gray-500" : "text-gray-400"}>
                    {p.icon}
                  </span>
                  {p.label}
                </button>
              ))}
            </nav>
          </div>

         <div className={`rounded-3xl shadow-sm p-6 transition-colors duration-300
            ${isDark
              ? "bg-[var(--metal-dark1)] border border-white/10"
              : "bg-white border border-gray-100"
            }`}>
          {current?.component}
          </div>



        </div>
      </div>

      {/* Modals */}
      {deleteModal.open && (
        <DeleteLogsModal
          mode={deleteModal.mode}
          log={deleteModal.log}
          logType={deleteModal.logType}
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteModal}
        />
      )}

      {openDeleteNotifModal && (
        <DeleteNotifModal
          isOpen={openDeleteNotifModal}
          selectedNotif={selectedNotif}
          deleteMode={deleteMode}
          onClose={() => setOpenDeleteNotifModal(false)}
          loadNotifs={loadNotifs}
        />
      )}

      {isNotifOpen && <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />}
      {logoutOpen && <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />}

      {messageContext && (
        <FloatSuccessMsg txt={messageContext} clearMsg={() => setMessageContext("")} />
      )}

    </section>
  );
}