"use client";
import { useEffect, useState, useCallback, useContext } from "react";
import { Menu, KeyRound, Search, Check, X, Clock, ShieldCheck, ShieldX, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { useUser } from "../../hooks/userContext.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";
import { MessageContext } from "../../hooks/messageHooks.jsx";

/* ── STATUS BADGE ───────────────────────────────────────────── */
function StatusBadge({ status }) {
  const styles = {
    Pending:  "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  const icons = {
    Pending:  <Clock size={11} />,
    Approved: <Check size={11} />,
    Rejected: <X size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {icons[status]} {status}
    </span>
  );
}

/* ── PASSWORD INPUT ─────────────────────────────────────────── */
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl text-sm focus:border-[var(--sancgb)] focus:outline-none transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
      >
        {show
          ? <EyeOff size={16} color="var(--sancgb)" />
          : <Eye size={16} color="var(--sancgb)" />
        }
      </button>
    </div>
  );
}

/* ── ACTION CONFIRMATION MODAL ──────────────────────────────── */
function Action_Confirmation_Modal({
  isOpen,
  onClose,
  actionMode,
  request,
  onHandleOpenModal,
}) {
  const [step, setStep] = useState("confirm");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!isOpen || !request) return null;

  const isApprove = actionMode === "approve";

  const handleClose = () => {
    setStep("confirm");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    onClose();
  };

  const handleConfirm = () => {
    if (isApprove) {
      setStep("password");
    } else {
      onHandleOpenModal(request, null);
      handleClose();
    }
  };

  const handlePasswordSubmit = () => {
    if (!newPassword.trim()) {
      setPasswordError("Password is required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    onHandleOpenModal(request, newPassword);
    handleClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl relative w-full max-w-[460px]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>

          <div className="p-8">
            {/* ── STEP 1: CONFIRM ─────────────────────────── */}
            {step === "confirm" && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-xl ${isApprove ? "bg-[var(--sage-lighter)]" : "bg-red-50"}`}>
                    {isApprove
                      ? <ShieldCheck size={24} color="var(--sancgb)" />
                      : <ShieldX size={24} className="text-red-500" />
                    }
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isApprove ? "Approve Password Reset" : "Reject Password Reset"}
                  </h2>
                </div>

                <div className="bg-[var(--sage-lighter)] rounded-xl p-4 mb-5 space-y-1 border border-[var(--sage-medium)]">
                  <p className="text-xs text-gray-400 mb-1">Request from</p>
                  <p className="text-base font-semibold text-[var(--sancgb)]">{request.fullname}</p>
                  <p className="text-sm text-gray-500">@{request.username}</p>
                  <p className="text-sm text-gray-500">{request.email}</p>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  {isApprove
                    ? "Proceeding will allow you to set a new password for this user."
                    : "This will reject the user's password reset request. They will need to submit a new one."}
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="cursor-pointer px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`cursor-pointer px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-colors
                      ${isApprove
                        ? "bg-[var(--sancgb)] hover:bg-[var(--sancgd)]"
                        : "bg-red-500 hover:bg-red-600"
                      }`}
                  >
                    {isApprove ? "Yes, Proceed" : "Yes, Reject"}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 2: SET PASSWORD ─────────────────────── */}
            {step === "password" && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl bg-[var(--sage-lighter)]">
                    <ShieldCheck size={24} color="var(--sancgb)" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Set New Password</h2>
                    <p className="text-xs text-gray-400 mt-0.5">for {request.fullname}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--sancgb)] mb-1.5">
                      New Password
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--sancgb)] mb-1.5">
                      Confirm Password
                    </label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                      placeholder="Re-enter new password"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setStep("confirm")}
                    className="cursor-pointer px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="cursor-pointer px-5 py-2.5 rounded-xl bg-[var(--sancgb)] hover:bg-[var(--sancgd)] text-white font-medium text-sm transition-colors"
                  >
                    Confirm & Approve
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
              <option value="Approved">Approved</option>
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
            <option value="Approved">Approved</option>
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
export default function PasswordRequests() {
  const { user, passwordRequests, loadPasswordRequests } = useUser(); // ✅ from context
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

  // ✅ Load real data on mount
  useEffect(() => {
    loadPasswordRequests();
  }, [loadPasswordRequests]);

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

  const handleFinalAction = async (request, newPassword) => {
    try {
      if (newPassword) {
        // TODO: await yourApi.approvePasswordRequest(request.request_id, newPassword)
        setSuccessMsg(`Password reset approved for ${request.fullname}`);
      } else {
        // TODO: await yourApi.rejectPasswordRequest(request.request_id)
        setSuccessMsg(`Password reset rejected for ${request.fullname}`);
      }
      await loadPasswordRequests(); // ✅ reload from context after action
    } catch (err) {
      console.error("Action failed:", err);
      setSuccessMsg("Something went wrong. Please try again.");
    }
  };

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

      <Action_Confirmation_Modal
        isOpen={actionModal.isOpen}
        onClose={handleCloseActionModal}
        actionMode={actionModal.mode}
        request={actionModal.request}
        onHandleOpenModal={handleFinalAction}
      />

      {successMsg && <FloatSuccessMsg txt={successMsg} clearMsg={() => setSuccessMsg("")} />}
      {messageContext && <FloatSuccessMsg txt={messageContext} clearMsg={clearMsg} />}
    </section>



  );
}