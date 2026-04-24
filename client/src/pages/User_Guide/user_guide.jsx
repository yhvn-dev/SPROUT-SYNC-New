"use client";
import { useState, useContext, useCallback } from "react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { LogoutModal } from "../../components/logoutModal.jsx";
import RegisterDeviceModal from "../Dashboard/modals/registerDeviceModal.jsx";
import { Menu, X, BookOpen, ChevronRight, BarChart2, Sprout, Users, Bell, Wrench, AlertTriangle, LogOut, Leaf, Lock, HardDrive, Eye, ShieldCheck, Droplets } from "lucide-react";
import { useUser } from "../../hooks/userContext";
import Admin_guide from "./admin_guide.jsx";
import Farmer_guide from "./farmer_guide.jsx";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { DeleteNotifModal } from "../../components/deleteNotifModal.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { usePlantData } from "../../hooks/plantContext.jsx";
import { useDarkMode } from "../../hooks/useDarkmode.jsx";

const ADMIN_NAV = [
  { id: "dashboard",    label: "Dashboard",              icon: <BarChart2 size={14}/>,     color: "#027e69" },
  { id: "plants",       label: "Plant Management",       icon: <Sprout size={14}/>,        color: "#2d6a4f" },
  { id: "users",        label: "User Management",        icon: <Users size={14}/>,         color: "#027e69" },
  { id: "analytics",    label: "Analytics",              icon: <BarChart2 size={14}/>,     color: "#009983" },
  { id: "irrigation",   label: "Irrigation Monitoring",  icon: <Droplets size={14}/>,      color: "#0284c7" },
  { id: "archive",      label: "Batch History",          icon: <HardDrive size={14}/>,     color: "#2d6a4f" },
  { id: "inventory",    label: "Plants Inventory",       icon: <Leaf size={14}/>,          color: "#027e69" },
  { id: "passwords",    label: "Password Resets",        icon: <Lock size={14}/>,          color: "#009983" },
  { id: "alerts",       label: "Alerts",                 icon: <Bell size={14}/>,          color: "#2d6a4f" },
  { id: "hardware",     label: "Hardware & Setup",       icon: <Wrench size={14}/>,        color: "#027e69" },
  { id: "troubleshoot", label: "Troubleshooting",        icon: <AlertTriangle size={14}/>, color: "#009983" },
  { id: "logout",       label: "Logout",                 icon: <LogOut size={14}/>,        color: "#2d6a4f" },
];

const FARMER_NAV_IDS = ["dashboard", "analytics", "irrigation", "alerts", "hardware", "troubleshoot", "logout"];

function ManualSidebar({ role, activeSection, setActiveSection, isOpen, onClose, isDark }) {
  const isAdmin = role === "admin";
  const sections = isAdmin
    ? ADMIN_NAV
    : ADMIN_NAV.filter(s => FARMER_NAV_IDS.includes(s.id));
  const title = isAdmin ? "Admin Manual" : "Farmer Manual";

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 right-0 h-full w-56 shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        lg:static lg:translate-x-0 lg:shadow-none lg:border-l lg:z-auto
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        ${isDark
          ? "bg-[var(--metal-dark1)] border-white/10"
          : "bg-white border-[#c4ded0]"
        }
      `}>

        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3.5 border-b flex-shrink-0 transition-colors duration-300
          ${isDark ? "border-white/10 bg-white/5" : "border-[#c4ded0] bg-[#027e6910]"}`}>
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[#027e69]" />
            <span className="text-sm font-bold text-[#027e69] tracking-wide uppercase">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden p-1 rounded transition-colors
              ${isDark ? "hover:bg-white/10" : "hover:bg-[#c4ded040]"}`}
          >
            <X size={15} className={isDark ? "text-gray-400" : "text-gray-500"} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-3 pt-3 pb-1 flex-shrink-0">
          <span
            className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-full w-fit"
            style={{
              background: isAdmin ? "hsl(35,80%,93%)" : "hsl(180,2%,90%)",
              color:      isAdmin ? "hsl(35,80%,38%)" : "hsl(180,3%,29%)",
            }}
          >
            {isAdmin ? <ShieldCheck size={10}/> : <Eye size={10}/>}
            {isAdmin ? "Admin" : "Farmer"}
          </span>
        </div>

        {/* Nav links — scrollable area with dark scrollbar */}
        <nav
          className={`flex-1 overflow-y-auto py-2 px-2 transition-colors duration-300
            ${isDark ? "dark-scroll" : "light-scroll"}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDark ? "#3f3f46 transparent" : "#c4ded0 transparent",
          }}
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(s.id); onClose(); }}
              className={`
                w-full flex items-center justify-between text-left
                px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150
                ${activeSection === s.id
                  ? "text-white font-semibold shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
                    : "text-gray-600 hover:bg-[#f0faf5] hover:text-[#027e69]"
                }
              `}
              style={activeSection === s.id ? { background: s.color } : {}}
            >
              <div className="flex items-center gap-2">
                <span style={activeSection === s.id ? { color: "#fff" } : { color: s.color }}>
                  {s.icon}
                </span>
                {s.label}
              </div>
              {activeSection === s.id && <ChevronRight size={12} className="flex-shrink-0" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`px-4 py-3 border-t flex-shrink-0 transition-colors duration-300
          ${isDark ? "border-white/10" : "border-[#c4ded0]"}`}>
          <p className={`text-[9px] leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            SproutSync Manual · <span className="text-[#027e69]">sproutsync031@gmail.com</span>
          </p>
        </div>
      </aside>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function User_guide() {
  const { user, skippedRegister } = useUser();
  const { loadNotifs } = usePlantData();
  const {
    openDeleteNotifModal, setOpenDeleteNotifModal,
    selectedNotif, deleteMode,
    messageContext, setMessageContext,
  } = useContext(MessageContext);

  const isDark = useDarkMode();

  const [sidebarOpen,            setSidebarOpen]          = useState(false);
  const [manualSidebarOpen,      setManualSidebarOpen]    = useState(false);
  const [logoutOpen,             setLogoutOpen]           = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [notifOpen,              setNotifOpen]            = useState(false);
  const [activeSection,          setActiveSection]        = useState("dashboard");

  const clearMsg = useCallback(() => setMessageContext(""), [setMessageContext]);

  const renderGuide = () => {
    if (user?.role === "admin")  return <Admin_guide  activeSection={activeSection} />;
    if (user?.role === "farmer") return <Farmer_guide activeSection={activeSection} />;
    return null;
  };

  const showManual = user?.role === "admin" || user?.role === "farmer";

  return (
    <section className={`h-screen w-full overflow-hidden flex gap-4 flex-row transition-colors duration-300
      ${isDark ? "bg-[var(--metal-dark1)]" : "bg-[#eaf4ef]"}`}>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        ${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"}
        md:static md:flex md:flex-shrink-0 h-full
      `}>
        <Sidebar
          user={user}
          setLogoutOpen={setLogoutOpen}
          setSidebarOpen={setSidebarOpen}
          setRegisterModalVisible={setRegisterModalVisible}
        />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden mr-4">

        <div className="flex items-center flex-shrink-0 w-full">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex-shrink-0 ml-4 bg-white p-2.5 rounded-lg shadow"
          >
            <Menu size={20} className="text-[#027e69]" />
          </button>

          <div className="flex-1">
            <Db_Header notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
          </div>

          {showManual && (
            <button
              onClick={() => setManualSidebarOpen(true)}
              className="lg:hidden flex-shrink-0 mr-4 bg-white p-2.5 rounded-lg shadow"
              aria-label="Open manual navigation"
            >
              <BookOpen size={20} className="text-[#027e69]" />
            </button>
          )}
        </div>

        <div className="flex flex-1 min-h-0">
          <main
            className={`flex-1 min-w-0 overflow-y-auto transition-colors duration-300`}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: isDark ? "#3f3f46 transparent" : "#c4ded0 transparent",
            }}
          >
            {renderGuide()}
          </main>

          {showManual && (
            <ManualSidebar
              role={user?.role}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isOpen={manualSidebarOpen}
              onClose={() => setManualSidebarOpen(false)}
              isDark={isDark}
            />
          )}
        </div>
      </div>

      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}
      {notifOpen && (
        <Notif_Modal isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
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
      {isRegisterModalVisible && (
        <RegisterDeviceModal
          userData={user}
          onClose={() => setRegisterModalVisible(false)}
        />
      )}
      {messageContext && (
        <FloatSuccessMsg txt={messageContext} clearMsg={clearMsg} />
      )}
    </section>
  );
}

export default User_guide;