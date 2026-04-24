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
      className="flex items-center fixed top-5 left-1/2 -translate-x-1/2 z-50  gap-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm w-[360px] animate-slide-in"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}>


      <div
        className="p-1.5 rounded-lg shrink-0 mt-0.5"
        style={{ backgroundColor: colors.iconBg }}>
        <Icon size={16} style={{ color: colors.iconColor }} />
      </div>

      {/* Content */}
      <div className="flex items-center justify-center min-w-0">
        <p
          className="text-xs leading-snug"
          style={{ color: colors.text }}>
          {message}
        </p>
      </div>

      <div className="flex items-center justify-end bg-amber-300 w-[20%]">
          <button
          onClick={() => setNewNotifPopup(null)}
          className="cursor-pointer shrink-0 transition hover:opacity-70"
          style={{ color: colors.iconColor }}>
          <X size={14} />
        </button>     
      </div>
   

    </div>
  );

}

export default NotifPopup;