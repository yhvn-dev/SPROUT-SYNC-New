import { Trash2, AlertTriangle, X } from "lucide-react";

function DeleteLogsModal({ mode, log, logType, onConfirm, onCancel }) {
  const titles = {
    "watering": "Watering Log",
    "water-level": "Water Level Log",
    "moisture": "Moisture Log",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
        
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Header */}
        <div
          className="px-6 py-4 flex items-center gap-3 relative"
          style={{ backgroundColor: "var(--color-danger-b)" }}
        >
          <div className="p-2 rounded-full bg-white/40">
            <Trash2 size={18} style={{ color: "var(--color-danger-a)" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide" style={{ color: "hsl(355, 100%, 30%)" }}>
              {mode === "delete-all"
                ? `Delete All ${titles[logType]}s`
                : `Delete ${titles[logType]}`}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "hsl(355, 100%, 40%)" }}>
              This action cannot be undone.
            </p>
          </div>

          {/* X Button */}
          <button
            onClick={onCancel}
            className="cursor-pointer absolute top-3 right-4 p-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
          >
            <X size={14} style={{ color: "hsl(355, 100%, 30%)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-sm text-gray-600">
          {mode === "delete-all" ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "var(--color-danger-c)" }}
              >
                <AlertTriangle size={28} style={{ color: "var(--color-danger-a)" }} />
              </div>
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold" style={{ color: "var(--color-danger-a)" }}>
                  all {titles[logType]}s
                </span>
                ? This will permanently remove every record.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p>Are you sure you want to delete this record?</p>
              <div
                className="rounded-xl px-4 py-3 mt-2 space-y-1.5"
                style={{ backgroundColor: "var(--color-danger-c)" }}
              >
                {log && Object.entries(log).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-500 capitalize text-xs">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span
                      className="font-bold text-xs text-right"
                      style={{ color: "hsl(355, 100%, 40%)" }}
                    >
                      {typeof val === "string" && val.includes("T")
                        ? new Date(val).toLocaleString("en-PH")
                        : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={onCancel}
            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--color-danger-b)", color: "hsl(355, 100%, 40%)" }}>
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--color-danger-a)" }}>
            <Trash2 size={14} color="white" />
            {mode === "delete-all" ? "Delete All" : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}




export default DeleteLogsModal;