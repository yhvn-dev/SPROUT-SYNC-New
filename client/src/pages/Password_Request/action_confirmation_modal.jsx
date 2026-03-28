import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/* ── PASSWORD INPUT ─────────────────────────────────────────── */
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
        {show
          ? <EyeOff size={16} color="var(--sancgb)" />
          : <Eye size={16} color="var(--sancgb)" />
        }
      </button>
    </div>
  );
}

/* ── MAIN MODAL ─────────────────────────────────────────────── */
function Action_Confirmation_Modal({
  isOpen,
  onClose,
  actionMode,        // "approve" | "reject"
  request,           // the selected request object
  onHandleOpenModal, // callback after confirm: (request, newPassword?) => void
}) {
  const [step, setStep] = useState("confirm"); // "confirm" | "password"
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
      // Go to password step
      setStep("password");
    } else {
      // Reject — no password needed, fire directly
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
          {/* Close Button */}
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
                {/* Icon + Title */}
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

                {/* User Info Card */}
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

                {/* Actions */}
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

            {/* ── STEP 2: SET PASSWORD (approve only) ─────── */}
            {step === "password" && (
              <>
                {/* Icon + Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl bg-[var(--sage-lighter)]">
                    <ShieldCheck size={24} color="var(--sancgb)" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Set New Password</h2>
                    <p className="text-xs text-gray-400 mt-0.5">for {request.fullname}</p>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--sancgb)] mb-1.5">
                      New Password
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--sancgb)] mb-1.5">
                      Confirm Password
                    </label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="Re-enter new password"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                {/* Actions */}
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

export default Action_Confirmation_Modal;