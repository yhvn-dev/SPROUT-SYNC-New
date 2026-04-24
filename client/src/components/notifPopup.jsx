import { X } from "lucide-react";
import { usePlantData } from "../hooks/plantContext.jsx";
import { getColorByStatus, getIconByType } from "../utils/colors.js"; 
import { useDarkMode } from "../hooks/useDarkmode.jsx";

function NotifPopup() {
  const { newNotifPopup, setNewNotifPopup } = usePlantData();
  const { isDark } = useDarkMode();

  if (!newNotifPopup) return null;

  const { status, type, message } = newNotifPopup;
  const colors = getColorByStatus(status, type, isDark);
  const Icon = getIconByType(type);

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm w-[360px] animate-slide-in"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      {/* Icon */}
      <div
        className="p-1.5 rounded-lg shrink-0 mt-0.5"
        style={{ backgroundColor: colors.iconBg }}
      >
        <Icon size={16} style={{ color: colors.iconColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: colors.badge.bg,
              color: colors.badge.text,
            }}
          >
            {colors.badge.label}
          </span>
        </div>

        <p
          className="text-xs leading-snug"
          style={{ color: colors.text }}
        >
          {message}
        </p>
      </div>


      <button
        onClick={() => setNewNotifPopup(null)}
        className="cursor-pointer shrink-0 transition hover:opacity-70"
        style={{ color: colors.iconColor }}>
        <X size={14} />
      </button>
    </div>
  );
}

export default NotifPopup;