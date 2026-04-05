import { useState } from 'react';
import * as passwordResetService from "../../../data/passwordResetsServices"

function ForgotPasswordModal({ isOpen, onClose }) {
  const [login, setLogin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login.trim()) {
      setError('Username or email is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
    
       await passwordResetService.requestPasswordReset(login.trim());

      setSuccess('Password reset request sent! Wait for admin approval.');
      setLogin('');
      
    } catch (err) {
      console.error('Reset error:', err);
      const msg = err.response?.data?.message || err.message || 'Request failed. Try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="conb bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-sage-lighter">
        {/* Header */}
        <div className="p-8 pb-4 border-b border-sage-medium">
          <h2 className="text-2xl font-bold text-sancga mb-2">Forgot Password?</h2>
          <p className="text-sage-medium text-sm leading-relaxed">
            Enter your username or email. Admin will reset it for you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-sancgb mb-2">
              Username or Email
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-sage-light focus:border-sage focus:ring-4 focus:ring-sage-lighter/50 bg-sage-lighter/50 text-sancga placeholder-sage-medium transition-all duration-200 text-base shadow-sm hover:shadow-md"
              placeholder="sproutsync031@gmail.com or username"
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 bg-red-50/50 px-3 py-2 rounded-lg border border-red-200">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-2 text-sm text-ptl-greend bg-ptl-greenc/20 px-3 py-2 rounded-lg border border-ptl-greenc/30 font-medium">
                {success}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer flex-1 px-6 py-3 rounded-xl font-medium text-sage-medium bg-sage-lighter/50 hover:bg-sage-lighter hover:shadow-md transition-all duration-200 border border-sage-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !login.trim()}
              className="cursor-pointer flex-1 px-6 py-3 rounded-xl font-medium bg-[var(--sancgb)] text-white bg-gradient-to-r from-ptl-greenc to-ptl-greend hover:from-ptl-greend hover:to-ptl-greene shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



export default ForgotPasswordModal;