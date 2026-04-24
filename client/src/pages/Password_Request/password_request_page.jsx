import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { useState } from "react";
import * as passwordResetService from "../../data/passwordResetsServices";
import { Eye, EyeOff } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkmode.jsx";




function PasswordInput({ value, onChange, placeholder = "Enter new password", isDark }) {
  const [show, setShow] = useState(false);
  return (
    <div className="conb relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 pr-11 border-2 rounded-xl text-sm focus:border-[var(--sancgb)] focus:outline-none transition-colors
          ${isDark
            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
          }`}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition"
      >
        {show ? <EyeOff size={16} color="var(--sancgb)" /> : <Eye size={16} color="var(--sancgb)" />}
      </button>
    </div>
  );
}

function Action_Confirmation_Modal({ isOpen, onClose, actionMode, request, onRefresh }) {
  const isDark = useDarkMode();
  const [step, setStep] = useState("confirm");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !request) return null;

  const isApprove = actionMode === "approve";
  const isReject  = actionMode === "reject";
  const isDelete  = actionMode === "delete";

  const handleClose = () => {
    setStep("confirm");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    onClose();
  };

  const handleConfirm = async () => {
    if (isApprove) {
      setStep("password");
      return;
    }
    try {
      setLoading(true);
      if (isReject) {
        await passwordResetService.rejectPasswordReset(request.request_id);
      } else if (isDelete) {
        await passwordResetService.deletePasswordResetRequest(request.request_id);
      }
      if (onRefresh) await onRefresh(actionMode); // ✅ FIXED
      handleClose();
    } catch (err) {
      console.error("Error processing request:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
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
    try {
      setLoading(true);
      await passwordResetService.approvePasswordReset(request.request_id, newPassword);
      if (onRefresh) await onRefresh(actionMode); // ✅ FIXED
      handleClose();
    } catch (err) {
      console.error("Error approving request:", err);
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const iconBg = isApprove
    ? isDark ? "bg-[var(--sage-lighter)]/20" : "bg-[var(--sage-lighter)]"
    : isDelete
    ? "bg-[var(--color-danger-b-light)]"
    : "bg-[var(--color-danger-a-light)]";

  const icon = isApprove
    ? <ShieldCheck size={24} color="var(--sancgb)" />
    : isDelete
    ? <Trash2 size={24} color="var(--color-danger-b)" />
    : <ShieldX size={24} color="var(--color-danger-a)" />;

  const confirmBtnClass = isApprove
    ? "bg-[var(--sancgb)] hover:bg-[var(--sancgd)]"
    : isDelete
    ? "bg-[var(--color-danger-b)] hover:bg-[var(--color-danger-b-dark)]"
    : "bg-[var(--color-danger-a)] hover:bg-[var(--color-danger-a-dark)]";

  const confirmBtnLabel = loading
    ? "Processing..."
    : isApprove ? "Yes, Proceed"
    : isDelete  ? "Yes, Delete"
    : "Yes, Reject";

  const modalTitle = isApprove
    ? "Approve Password Reset"
    : isDelete ? "Delete Request"
    : "Reject Password Reset";

  const modalDesc = isApprove
    ? "Proceeding will allow you to set a new password for this user."
    : isDelete
    ? "This will permanently delete this request record. This action cannot be undone."
    : "This will reject the user's password reset request. They will need to submit a new one.";

  const modalBg       = isDark ? "bg-gray-900"   : "bg-white";
  const titleColor    = isDark ? "text-white"     : "text-gray-900";
  const descColor     = isDark ? "text-gray-400"  : "text-gray-500";
  const cancelBtn     = isDark
    ? "text-gray-300 hover:bg-gray-700"
    : "text-gray-700 hover:bg-gray-100";
  const closeBtn      = isDark
    ? "text-gray-400 hover:bg-gray-700"
    : "text-gray-500 hover:bg-gray-100";
  const requestCardBg = isDark
    ? "bg-gray-800 border-gray-600"
    : "bg-[var(--sage-lighter)] border-[var(--sage-medium)]";
  const requestLabel  = isDark ? "text-gray-500"  : "text-gray-400";
  const requestName   = isDark ? "text-[var(--sancgb)]" : "text-[var(--sancgb)]";
  const requestSub    = isDark ? "text-gray-400"  : "text-gray-500";
  const backBtn       = isDark
    ? "text-gray-300 hover:bg-gray-700"
    : "text-gray-700 hover:bg-gray-100";
  const labelColor    = isDark ? "text-gray-300"  : "text-[var(--sancgb)]";

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
          className={`password_reset_modal conb rounded-2xl shadow-2xl relative w-full max-w-[460px] ${modalBg}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={handleClose}
            className={`absolute top-5 right-5 p-2 rounded-lg transition-colors cursor-pointer ${closeBtn}`}
          >
            <X size={18} />
          </button>

          <div className="p-8">
            {step === "confirm" && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
                  <h2 className={`text-xl font-semibold ${titleColor}`}>{modalTitle}</h2>
                </div>

                <div className={`reset_pw_request_form rounded-xl p-4 mb-5 space-y-1 border ${requestCardBg}`}>
                  <p className={`text-xs mb-1 ${requestLabel}`}>Request from</p>
                  <p className={`text-base font-semibold ${requestName}`}>{request.fullname}</p>
                  <p className={`text-sm ${requestSub}`}>@{request.username}</p>
                  <p className={`text-sm ${requestSub}`}>{request.email}</p>
                </div>

                <p className={`text-sm mb-6 ${descColor}`}>{modalDesc}</p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className={`cursor-pointer px-5 py-2.5 rounded-xl transition-colors font-medium text-sm ${cancelBtn}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`cursor-pointer px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-colors disabled:opacity-50 ${confirmBtnClass}`}
                  >
                    {confirmBtnLabel}
                  </button>
                </div>
              </>
            )}

            {step === "password" && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-xl ${isDark ? "bg-[var(--sage-lighter)]/20" : "bg-[var(--sage-lighter)]"}`}>
                    <ShieldCheck size={24} color="var(--sancgb)" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-semibold ${titleColor}`}>Set New Password</h2>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      for {request.fullname}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                      New Password
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
                      placeholder="Enter new password"
                      isDark={isDark}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                      Confirm Password
                    </label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                      placeholder="Re-enter new password"
                      isDark={isDark}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={loading}
                    className={`cursor-pointer px-5 py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-50 ${backBtn}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    disabled={loading}
                    className="cursor-pointer px-5 py-2.5 rounded-xl bg-[var(--sancgb)] hover:bg-[var(--sancgd)] text-white font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Confirm & Approve"}
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

export default Action_Confirmation_Modal;