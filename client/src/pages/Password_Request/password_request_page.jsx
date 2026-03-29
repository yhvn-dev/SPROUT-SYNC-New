"use client";
import { useEffect, useState, useCallback, useContext } from "react";
import { Menu, KeyRound, Search, Check, X, Clock,  } from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { useUser } from "../../hooks/userContext.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";
import { MessageContext } from "../../hooks/messageHooks.jsx";
import Action_Confirmation_Modal from "./action_confirmation_modal.jsx"; // ← i-adjust yung path




/* ── STATUS BADGE ───────────────────────────────────────────── */
function StatusBadge({ status }) {
  const styles = {
    Pending:  "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  const icons = {
    Pending:  <Clock size={11} />,
    Completed: <Check size={11} />,
    Rejected: <X size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {icons[status]} {status}
    </span>
  );
}

/* ── PASSWORD REQUEST TABLE ─────────────────────────────────── */
function PasswordRequestTable({ requests, onApprove, onReject }) {
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
      r.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      r.email.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
      {/* ── DESKTOP ───────────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-full">
        <div className="bg-white w-full p-4 flex items-center justify-start">
          <div className="w-1/2">
            <span className="text-3xl font-bold text-[var(--metal-dark5)]">Password Requests</span>
          </div>
          <div className="flex items-center justify-end w-1/2 gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-48"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <table className="w-full overflow-y-auto">
          <thead className="bg-[var(--sancgb)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--main-white)] uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--main-white)] uppercase tracking-wider">Username</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--main-white)] uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--main-white)] uppercase tracking-wider">Requested At</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--main-white)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--main-white)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((r, index) => (
              <tr
                key={r.request_id}
                className={`hover:bg-[#E8F3ED] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-[#027c68]">{r.fullname}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#027c68]">{r.username}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#027c68]">{r.email}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#027c68] text-center">
                  {new Date(r.requested_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {r.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => onApprove(r)}
                          className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--sancgb)] text-white shadow hover:shadow-md transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(r)}
                          className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--color-danger-a)] text-white shadow hover:shadow-md transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        {r.completed_at ? new Date(r.completed_at).toLocaleDateString() : "—"}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-16">
            <KeyRound size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No requests found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* ── MOBILE ────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="p-4 flex flex-col gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search user..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm w-full"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {filtered.map((r) => (
          <div
            key={r.request_id}
            className="border-b border-gray-200 p-4 hover:bg-[#E8F3ED] transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-[#027c68]">{r.fullname}</p>
              <StatusBadge status={r.status} />
            </div>
            <p className="text-xs text-gray-500">@{r.username}</p>
            <p className="text-xs text-gray-500">{r.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Requested: {new Date(r.requested_at).toLocaleDateString()}
            </p>
            {r.status === "Pending" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onApprove(r)}
                  className="cursor-pointer flex-1 text-xs px-2.5 py-1.5 rounded-md bg-[var(--sancgb)] text-white shadow hover:shadow-md transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(r)}
                  className="cursor-pointer flex-1 text-xs px-2.5 py-1.5 rounded-md bg-[var(--color-danger-a)] text-white shadow hover:shadow-md transition"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <KeyRound size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No requests found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ── MAIN PAGE ──────────────────────────────────────────────── */
export default function Password_Requests() {
  const { user, passwordRequests, loadPasswordRequests } = useUser();
  const { messageContext, setMessageContext } = useContext(MessageContext);

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    mode: null,
    request: null,
  });

  const clearMsg = useCallback(() => setMessageContext(""), []);

  useEffect(() => {
    loadPasswordRequests();
  }, []);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const handleApprove = (r) =>
    setActionModal({ isOpen: true, mode: "approve", request: r });

  const handleReject = (r) =>
    setActionModal({ isOpen: true, mode: "reject", request: r });

  const handleCloseActionModal = () =>
    setActionModal({ isOpen: false, mode: null, request: null });

  // ← Refresh + success message after modal action
  const handleRefresh = useCallback(async (mode) => {
    await loadPasswordRequests();
    setSuccessMsg(
      mode === "approve"
        ? "Password reset approved successfully!"
        : "Password reset rejected successfully!"
    );
  }, [loadPasswordRequests]);

  return (
    <section className="con_main grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr]
      grid-rows-[8vh_auto_auto]
      md:grid-rows-[8vh_auto_82vh] gap-4 h-screen w-full overflow-x-hidden
      overflow-y-auto md:overflow-hidden
      relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

      {/* MOBILE HAMBURGER */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="menu_button md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg"
      >
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
      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block`}>
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
      <main className="col-start-1 md:col-start-2 row-start-2 md:row-span-2 col-span-full conb bg-white overflow-hidden rounded-2xl">
        <div className="h-full overflow-y-auto rounded-2xl">
          <PasswordRequestTable
            requests={passwordRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </main>

      {/* MODALS */}
      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}
      {notifOpen && (
        <Notif_Modal isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      )}

      {/* ← FIXED: onRefresh na lang, wala nang onHandleOpenModal */}
      <Action_Confirmation_Modal
        isOpen={actionModal.isOpen}
        onClose={handleCloseActionModal}
        actionMode={actionModal.mode}
        request={actionModal.request}
        onRefresh={() => handleRefresh(actionModal.mode)}
      />

      {successMsg && <FloatSuccessMsg txt={successMsg} clearMsg={() => setSuccessMsg("")} />}
      {messageContext && <FloatSuccessMsg txt={messageContext} clearMsg={clearMsg} />}
    </section>
  );
}