import { useState } from "react";
import {
  ChevronDown, ChevronUp, Wifi, WifiOff, Droplet,
  BarChart2, Bell, HardDrive, AlertTriangle, CheckCircle,
  Clock, LogOut, BookOpen, Eye
} from "lucide-react";

const MOISTURE_COLORS = {
  dry:     { bg: "hsl(355,100%,95%)", text: "hsl(355,100%,45%)", border: "hsl(355,100%,80%)" },
  optimal: { bg: "hsl(125,60%,94%)",  text: "hsl(125,60%,28%)",  border: "hsl(125,60%,72%)" },
  wet:     { bg: "hsl(35,100%,94%)",  text: "hsl(35,80%,40%)",   border: "hsl(35,70%,78%)"  },
};
const STAGE_PILL = { bg: "hsl(135,50%,92%)", text: "hsl(135,50%,22%)", border: "hsl(135,50%,72%)" };

const SECTIONS = [
  {
    id: "dashboard",
    icon: <BarChart2 size={16} />,
    label: "Dashboard",
    color: "#027e69",
    description: "Your main control center. Monitor all active trays, sensor readings, plant batches, and system status in real time.",
    subsections: [
      {
        title: "Nursery Overview",
        body: "The top card shows the system name and the live ESP32/watering system status — a green pulse means online, red means offline.",
        visual: "esp32",
      },
      {
        title: "Tray Groups",
        body: "Each tray group is a collapsible card. Click the row to expand and see all trays inside. Each tray shows its moisture sensor reading with a color-coded status badge.",
        visual: "moisture",
      },
      {
        title: "Plant Batches",
        body: "The right panel lists all active batches. Each card shows growth stage (green pill), harvest status (colored dot + text), and seedling counts.",
        visual: "batch",
      },
    ],
  },
  {
    id: "analytics",
    icon: <BarChart2 size={16} />,
    label: "Analytics",
    color: "#009983",
    description: "Track seedling stats, growth trends, moisture averages, water level history, and batch performance over time.",
    subsections: [
      {
        title: "Overview Section",
        body: "Shows: Total Active Seedlings, Active Grown, Active Dead, Active Replanted, average moisture from 3 representative plants, and latest water drum level.",
        visual: "stats",
      },
      {
        title: "Seedling Stats & History",
        body: "Displays data from harvested (deleted) batches. Monitor weekly growth progress and status percentage distribution charts.",
      },
    ],
  },
  {
    id: "alerts",
    icon: <Bell size={16} />,
    label: "Alerts",
    color: "#2d6a4f",
    description: "SproutSync sends real-time notifications to keep you informed of critical events.",
    subsections: [
      {
        title: "Alert Types",
        body: "You will receive alerts for: Low Moisture (auto-watering triggered), Low Water Level (refill drum), System Offline (check power/Wi-Fi), Harvest Schedule, and Device Registered.",
        visual: "alerts",
      },
    ],
  },
  {
    id: "hardware",
    icon: <HardDrive size={16} />,
    label: "Hardware & Setup",
    color: "#027e69",
    description: "Physical setup, powering on the system, and hardware maintenance guidelines.",
    subsections: [
      {
        title: "Physical Setup",
        body: "Plug SproutSync into a power outlet. Place each soil moisture sensor in the center of its tray. Position the ultrasonic sensor on top of the water drum. Turn on the pocket Wi-Fi.",
        steps: [
          "Plug in power supply",
          "Place moisture sensors in tray centers",
          "Mount ultrasonic sensor on drum",
          "Turn on pocket Wi-Fi",
        ],
      },
      {
        title: "Powering On",
        body: "Press the power switch. Wait for sensors to initialize. Confirm the online indicator light turns green.",
        steps: [
          "Press power switch",
          "Wait for initialization",
          "Confirm green indicator",
        ],
      },
      {
        title: "Safety & Maintenance",
        body: "Keep electronics away from direct water. Clean moisture sensors regularly. Inspect wiring for corrosion. Keep the drum clean. Never operate during electrical storms.",
      },
    ],
  },
  {
    id: "troubleshoot",
    icon: <AlertTriangle size={16} />,
    label: "Troubleshooting",
    color: "#009983",
    description: "Quick fixes for common issues.",
    subsections: [
      {
        title: "System Not Watering",
        body: "Check water supply and pump. Verify current moisture sensor readings on the dashboard. Confirm power supply is stable.",
        steps: [
          "Check water supply & pump",
          "Review dashboard sensor values",
          "Confirm stable power",
        ],
      },
      {
        title: "No Data Displayed",
        body: "Check sensor connections on the container. Ensure the system is powered on. Verify internet on the pocket Wi-Fi.",
        steps: [
          "Check sensor cable connections",
          "Confirm system is powered",
          "Check Wi-Fi connection",
        ],
      },
      {
        title: "Website Not Accessible",
        body: "Check your internet connection. Refresh the browser. Try Chrome or Edge. URL: sprout-sync-phi.vercel.app",
        steps: [
          "Check internet connection",
          "Refresh browser",
          "Switch to Chrome/Edge",
        ],
      },
    ],
  },
  {
    id: "logout",
    icon: <LogOut size={16} />,
    label: "Logout",
    color: "#2d6a4f",
    description: "Safely end your session.",
    subsections: [
      {
        title: "Logging Out",
        body: "Click the Logout button in the sidebar. Choose to log out of this device only, or all devices at once.",
        steps: [
          "Click Logout in sidebar",
          "Choose: this device or all devices",
        ],
      },
    ],
  },
];

/* ─── MINI VISUALS ─── */
function MiniVisual({ type }) {
  if (type === "esp32")
    return (
      <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#c4ded0] mt-3">
        <Wifi size={20} className="text-[#027e69]" />
        <div>
          <p className="text-xs font-semibold text-gray-800 leading-none">
            Watering System Online
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Last updated: Just now
          </p>
        </div>
        <span className="ml-auto w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
      </div>
    );

  if (type === "moisture")
    return (
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          ["Dry", "dry", 18],
          ["Optimal", "optimal", 62],
          ["Wet", "wet", 91],
        ].map(([label, key, val]) => (
          <div
            key={key}
            className="rounded-xl p-2 text-center"
            style={{
              background: MOISTURE_COLORS[key].bg,
              border: `1px solid ${MOISTURE_COLORS[key].border}`,
            }}
          >
            <Droplet
              size={14}
              style={{ color: MOISTURE_COLORS[key].text }}
              className="mx-auto mb-1"
            />
            <p
              className="text-[10px] font-bold"
              style={{ color: MOISTURE_COLORS[key].text }}
            >
              {val}%
            </p>
            <p
              className="text-[9px]"
              style={{ color: MOISTURE_COLORS[key].text }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    );

  if (type === "batch")
    return (
      <div className="mt-3 bg-white rounded-xl p-3 border border-[#c4ded0] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">Growth Stage:</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: STAGE_PILL.bg,
              color: STAGE_PILL.text,
              border: `1px solid ${STAGE_PILL.border}`,
            }}
          >
            Seedling
          </span>
        </div>
        {[
          ["Due Tomorrow", "hsl(35,100%,50%)"],
          ["Due Now", "hsl(220,74%,62%)"],
          ["Past Due", "hsl(353,70%,60%)"],
        ].map(([s, c]) => (
          <div key={s} className="flex items-center gap-2">
            <Clock size={11} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">Harvest:</span>
            <span
              className="flex items-center gap-1 text-[10px] font-medium"
              style={{ color: c }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: c }}
              />
              {s}
            </span>
          </div>
        ))}
      </div>
    );

  if (type === "stats")
    return (
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {[
          ["Seedlings", "248", "#25a244"],
          ["Grown", "182", "#208b3a"],
          ["Dead", "14", "hsl(355,100%,45%)"],
          ["Replants", "12", "hsl(35,80%,40%)"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            className="rounded-lg p-2 text-center bg-white border border-[#c4ded0]"
          >
            <p className="text-sm font-bold" style={{ color: c }}>
              {v}
            </p>
            <p className="text-[9px] text-gray-500">{l}</p>
          </div>
        ))}
      </div>
    );

  if (type === "alerts")
    return (
      <div className="mt-3 space-y-1.5">
        {[
          [AlertTriangle, "Low Moisture", "Auto-watering triggered", "hsl(355,100%,45%)", "hsl(355,100%,95%)"],
          [AlertTriangle, "Low Water Level", "Refill drum soon", "hsl(35,80%,40%)", "hsl(35,100%,94%)"],
          [WifiOff, "System Offline", "Check power & Wi-Fi", "hsl(220,2%,43%)", "hsl(0,0%,94%)"],
          [CheckCircle, "Harvest Ready", "Batch due today", "hsl(125,60%,28%)", "hsl(125,60%,94%)"],
        ].map(([Icon, title, sub, color, bg]) => (
          <div
            key={title}
            className="flex items-start gap-2 rounded-lg px-3 py-2"
            style={{ background: bg }}
          >
            <Icon size={13} style={{ color, marginTop: 1 }} />
            <div>
              <p className="text-[10px] font-semibold" style={{ color }}>
                {title}
              </p>
              <p className="text-[9px] text-gray-500">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    );

  return null;
}

/* ─── STEP LIST ─── */
function StepList({ steps }) {
  return (
    <ol className="mt-2 space-y-1">
      {steps.map((s, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#027e69] text-white text-[9px] flex items-center justify-center font-bold mt-0.5">
            {i + 1}
          </span>
          <span className="text-[11px] text-gray-600 leading-relaxed">{s}</span>
        </li>
      ))}
    </ol>
  );
}

/* ─── SECTION CARD ─── */
function SectionCard({ section }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="rounded-2xl overflow-hidden border border-[#c4ded0] bg-white shadow-sm">
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{
          background: `${section.color}12`,
          borderBottom: "1px solid #c4ded030",
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: section.color }}
        >
          <span style={{ color: "#fff" }}>{section.icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{section.label}</p>
          <p className="text-[10px] text-gray-500 leading-tight">
            {section.description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-[#e8f3ed]">
        {section.subsections.map((sub, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-[#f5faf7] transition-colors"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span className="text-xs font-medium text-gray-700">
                {sub.title}
              </span>
              {openIdx === i ? (
                <ChevronUp size={13} className="text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown
                  size={13}
                  className="text-gray-400 flex-shrink-0"
                />
              )}
            </button>
            {openIdx === i && (
              <div className="px-4 pb-3">
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {sub.body}
                </p>
                {sub.steps && <StepList steps={sub.steps} />}
                {sub.visual && <MiniVisual type={sub.visual} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
function Farmer_guide({ activeSection }) {
  const currentSection =
    SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <section className="w-full min-h-full bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] p-4 md:p-6">

      {/* Page Title */}
      <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-[#c4ded0] mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#027e69" }}
        >
          <BookOpen size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900 leading-none">
            Farmer Guide — SproutSync
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Reference for monitoring and hardware features
          </p>
        </div>
        <span
          className="ml-auto flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: "hsl(180,2%,90%)",
            color: "hsl(180,3%,29%)",
          }}
        >
          <Eye size={11} />
          Farmer
        </span>
      </div>

      {/* Section Card */}
      {currentSection && (
        <SectionCard key={currentSection.id} section={currentSection} />
      )}

      {/* Footer */}
      <div className="mt-4 rounded-xl border border-[#c4ded0] bg-white px-4 py-3 flex items-start gap-2">
        <CheckCircle
          size={13}
          className="text-[#027e69] mt-0.5 flex-shrink-0"
        />
        <p className="text-[10px] text-gray-500 leading-relaxed">
          For additional support, contact the SproutSync team at{" "}
          <span className="text-[#027e69] font-medium">
            sproutsync031@gmail.com
          </span>{" "}
          or visit{" "}
          <span className="text-[#027e69] font-medium">
            sprout-sync-phi.vercel.app
          </span>
        </p>
      </div>
    </section>
  );
}

export default Farmer_guide;