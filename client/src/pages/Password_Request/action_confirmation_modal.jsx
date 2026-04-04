import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { useState } from "react";
import * as passwordResetService from "../../data/passwordResetsServices";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({ value, onChange, placeholder = "Enter new password" }) {
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
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition"
      >
        {show ? <EyeOff size={16} color="var(--sancgb)" /> : <Eye size={16} color="var(--sancgb)" />}
      </button>
    </div>
  );
}

function Action_Confirmation_Modal({ isOpen, onClose, actionMode, request, onRefresh }) {
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

  // ── CONFIRM BUTTON (Step 1)
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
      // ✅ await muna ang refresh bago isara ang modal
      await onRefresh?.();
      handleClose();
    } catch (err) {
      console.error("Error processing request:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── CONFIRM & APPROVE BUTTON (Step 2)
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
      // ✅ await muna ang refresh bago isara ang modal
      await onRefresh?.();
      handleClose();
    } catch (err) {
      console.error("Error approving request:", err);
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const iconBg = isApprove ? "bg-[var(--sage-lighter)]" : isDelete ? "bg-orange-50" : "bg-red-50";
  const icon   = isApprove
    ? <ShieldCheck size={24} color="var(--sancgb)" />
    : isDelete
    ? <Trash2 size={24} className="text-orange-500" />
    : <ShieldX size={24} className="text-red-500" />;

  const confirmBtnClass = isApprove
    ? "bg-[var(--sancgb)] hover:bg-[var(--sancgd)]"
    : isDelete
    ? "bg-orange-500 hover:bg-orange-600"
    : "bg-red-500 hover:bg-red-600";

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
            {/* ── STEP 1: CONFIRM */}
            {step === "confirm" && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
                  <h2 className="text-xl font-semibold text-gray-900">{modalTitle}</h2>
                </div>

                <div className="bg-[var(--sage-lighter)] rounded-xl p-4 mb-5 space-y-1 border border-[var(--sage-medium)]">
                  <p className="text-xs text-gray-400 mb-1">Request from</p>
                  <p className="text-base font-semibold text-[var(--sancgb)]">{request.fullname}</p>
                  <p className="text-sm text-gray-500">@{request.username}</p>
                  <p className="text-sm text-gray-500">{request.email}</p>
                </div>

                <p className="text-sm text-gray-500 mb-6">{modalDesc}</p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="cursor-pointer px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
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

            {/* ── STEP 2: SET PASSWORD (approve only) */}
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
                    <label className="block text-sm font-medium text-[var(--sancgb)] mb-1.5">New Password</label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--sancgb)] mb-1.5">Confirm Password</label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                      placeholder="Re-enter new password"
                    />
                  </div>
                  {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={loading}
                    className="cursor-pointer px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm disabled:opacity-50"
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