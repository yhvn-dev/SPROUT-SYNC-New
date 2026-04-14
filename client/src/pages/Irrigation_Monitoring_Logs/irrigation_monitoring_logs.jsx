import {useState} from "react";
import Watering_Logs from "./watering_monitoring_logs.jsx";
import WaterLevelMonitoring from "./water_level_monitoring_logs.jsx";
import MoistureMonitoring from "./moisture_monitoring_logs.jsx";

// ── Nav config ───────────────────────────────────────────────────────────────
const PAGES = [
  {
    id: "watering",
    label: "Watering Logs",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    component: <Watering_Logs />,
  },
  {
    id: "water",
    label: "Water Level",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0c0 0-5 6-5 10a5 5 0 0010 0C17 8 12 2 12 2z" />
      </svg>
    ),
    component: <WaterLevelMonitoring />,
  },
  {
    id: "moisture",
    label: "Crop Moisture",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    component: <MoistureMonitoring />,
  },
];




// ── Root App ─────────────────────────────────────────────────────────────────
export default function Irrigation_Monitoring_Logs() {
  const [activePage, setActivePage] = useState("watering");
  const current = PAGES.find(p => p.id === activePage);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      
      {/* Sidebar */}
      <div className="flex min-h-screen">
        <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm">
      
          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
          
            {PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePage(p.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left
                  ${activePage === p.id
                    ? "bg-[#027e69] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
              >
                <span className={activePage === p.id ? "text-white" : "text-gray-400"}>
                  {p.icon}
                </span>
                {p.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-300">v1.0.0 · Live data</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{current?.label}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
          </div>

          {/* Page content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {current?.component}
          </div>
        </main>
      </div>
    </div>
  );
}
