import { useState } from "react";
import { useUser } from "../../hooks/userContext";
import {
  Wifi, WifiOff, Droplet, Sprout, Users, BarChart2, Bell,
  Lock, Leaf, BookOpen, HardDrive, AlertTriangle, CheckCircle,
  Clock, Wrench, LogOut, ShieldCheck, Eye, ChevronDown, ChevronUp
} from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkmode";

/* ─── SECTION DATA ─── */
const SECTIONS = [
  {
    id: "dashboard",
    icon: <BarChart2 size={16}/>,
    label: "Dashboard",
    color: "#027e69",
    description: "Your main control center. Monitor all active trays, sensor readings, plant batches, and system status in real time.",
    subsections: [
      { title: "Nursery Overview", body: "The top card shows the system name and the live ESP32/watering system status — a green pulse means online, red means offline.", visual: "esp32" },
      { title: "Tray Groups", body: "Each tray group is a collapsible card. Click the row to expand and see all trays inside. Each tray shows its moisture sensor reading with a color-coded status badge.", visual: "moisture" },
      { title: "Plant Batches", body: "The right panel lists all active batches. Each card shows growth stage (green pill), harvest status (colored dot + text), and seedling counts.", visual: "batch" },
    ],
  },
  {
    id: "plants",
    icon: <Sprout size={16}/>,
    label: "Plant Management",
    color: "#2d6a4f",
    description: "Create and manage tray groups, assign trays, and track plant batch cycles from seeding to harvest.",
    subsections: [
      { title: "Adding a Tray Group", body: 'Click "Add Tray Group", fill in the plant type, nursery location, and moisture thresholds (min/max %), then click Save.', steps: ["Click 'Add Tray Group'","Set plant type & location","Set min/max moisture threshold","Click Save"] },
      { title: "Managing Batches", body: 'Click the ▼ arrow on any tray group to expand. Use "+ Batch" to start a new plant cycle. Delete batches when plants are harvested or removed.', steps: ["Expand a tray group","Click '+ Batch'","Fill in plant name & harvest days","Delete when harvested"] },
    ],
  },
  {
    id: "users",
    icon: <Users size={16}/>,
    label: "User Management",
    color: "#027e69",
    description: "Create, edit, and delete user accounts. Assign roles to control what each user can access.",
    subsections: [
      { title: "Creating a User", body: "Go to Users → Add New User. Fill in username, full name, email, phone, password, and select a role (Admin or Farmer). Click Save.", visual: "roles", steps: ["Sidebar → Users","Click 'Add New User'","Fill all fields","Select role → Save"] },
      { title: "Editing & Deleting", body: "Click Edit in the user table to modify fields, then Update. Click Delete and confirm the popup to remove a user permanently.", steps: ["Find user in table","Click Edit or Delete","Confirm changes"] },
    ],
  },
  {
    id: "analytics",
    icon: <BarChart2 size={16}/>,
    label: "Analytics",
    color: "#009983",
    description: "Track seedling stats, growth trends, moisture averages, water level history, and batch performance over time.",
    subsections: [
      { title: "Overview Section", body: "Shows: Total Active Seedlings, Active Grown, Active Dead, Active Replanted, average moisture from 3 representative plants, and latest water drum level.", visual: "stats" },
      { title: "Seedling Stats & History", body: "Displays data from harvested (deleted) batches. Monitor weekly growth progress and status percentage distribution charts." },
    ],
  },
  {
    id: "archive",
    icon: <HardDrive size={16}/>,
    label: "Batch History",
    color: "#2d6a4f",
    description: "View archived plant batches, track harvest totals, and delete old records from the batch history panel.",
    subsections: [
      { title: "Using Batch History", body: 'Open "Batch History" from the sidebar. View all harvested batches with their totals. Delete records that are no longer needed.', steps: ["Sidebar → Batch History","Browse harvested batches","Delete old records as needed"] },
    ],
  },
  {
    id: "inventory",
    icon: <Leaf size={16}/>,
    label: "Plants Inventory",
    color: "#027e69",
    description: "Maintain a catalog of plant types available for assignment to trays.",
    subsections: [
      { title: "Managing Plant Records", body: 'Click "Add Plants" to create a new plant entry. Edit via the table\'s Edit button; delete with the Delete button + confirm popup.', steps: ["Click 'Add Plants'","Fill plant details → Save","Edit or delete from table"] },
    ],
  },
  {
    id: "passwords",
    icon: <Lock size={16}/>,
    label: "Password Resets",
    color: "#009983",
    description: "Review and process user password reset requests.",
    subsections: [
      { title: "Processing Requests", body: "Go to Password Reset Management. Approve → create a new password. Reject → delete the request.", visual: "pwreset", steps: ["Open Password Reset Management","Review pending requests","Approve: set new password","Reject: delete request"] },
    ],
  },
  {
    id: "alerts",
    icon: <Bell size={16}/>,
    label: "Alerts",
    color: "#2d6a4f",
    description: "SproutSync sends real-time notifications to keep you informed of critical events.",
    subsections: [
      { title: "Alert Types", body: "You will receive alerts for: Low Moisture (auto-watering triggered), Low Water Level (refill drum), System Offline (check power/Wi-Fi), Harvest Schedule, and Device Registered.", visual: "alerts" },
    ],
  },
  {
    id: "hardware",
    icon: <Wrench size={16}/>,
    label: "Hardware & Setup",
    color: "#027e69",
    description: "Physical setup, powering on the system, and hardware maintenance guidelines.",
    subsections: [
      { title: "Physical Setup", body: "Plug SproutSync into a power outlet. Place each soil moisture sensor in the center of its tray. Position the ultrasonic sensor on top of the water drum. Turn on the pocket Wi-Fi.", steps: ["Plug in power supply","Place moisture sensors in tray centers","Mount ultrasonic sensor on drum","Turn on pocket Wi-Fi"] },
      { title: "Powering On", body: "Press the power switch. Wait for sensors to initialize. Confirm the online indicator light turns green.", steps: ["Press power switch","Wait for initialization","Confirm green indicator"] },
      { title: "Safety & Maintenance", body: "Keep electronics away from direct water. Clean moisture sensors regularly. Inspect wiring for corrosion. Keep the drum clean. Never operate during electrical storms." },
    ],
  },
  {
    id: "troubleshoot",
    icon: <AlertTriangle size={16}/>,
    label: "Troubleshooting",
    color: "#009983",
    description: "Quick fixes for common issues.",
    subsections: [
      { title: "System Not Watering", body: "Check water supply and pump. Verify current moisture sensor readings on the dashboard. Confirm power supply is stable.", steps: ["Check water supply & pump","Review dashboard sensor values","Confirm stable power"] },
      { title: "No Data Displayed", body: "Check sensor connections on the container. Ensure the system is powered on. Verify internet on the pocket Wi-Fi.", steps: ["Check sensor cable connections","Confirm system is powered","Check Wi-Fi connection"] },
      { title: "Website Not Accessible", body: "Check your internet connection. Refresh the browser. Try Chrome or Edge. URL: sprout-sync-phi.vercel.app", steps: ["Check internet connection","Refresh browser","Switch to Chrome/Edge"] },
    ],
  },
  {
    id: "logout",
    icon: <LogOut size={16}/>,
    label: "Logout",
    color: "#2d6a4f",
    description: "Safely end your session.",
    subsections: [
      { title: "Logging Out", body: "Click the Logout button in the sidebar. Choose to log out of this device only, or all devices at once.", steps: ["Click Logout in sidebar","Choose: this device or all devices"] },
    ],
  },
];

const FARMER_SECTION_IDS = ["dashboard", "analytics", "alerts", "hardware", "troubleshoot", "logout"];

/* ─── MOCK SENSOR DATA ─── */
const MOCK_SENSORS = [
  { label: "Dry",     value: 18, bgStyle: { backgroundColor: "hsl(355,100%,95%)" }, iconStyle: { color: "hsl(355,100%,45%)" } },
  { label: "Optimal", value: 62, bgStyle: { backgroundColor: "hsl(125,60%,94%)"  }, iconStyle: { color: "hsl(125,60%,28%)" } },
  { label: "Wet",     value: 91, bgStyle: { backgroundColor: "hsl(35,100%,94%)"  }, iconStyle: { color: "hsl(35,80%,40%)"  } },
];

/* ─── DARK MOCK SENSOR DATA ─── */
const MOCK_SENSORS_DARK = [
  { label: "Dry",     value: 18, bgStyle: { backgroundColor: "hsl(355,60%,20%)" }, iconStyle: { color: "hsl(355,100%,70%)" } },
  { label: "Optimal", value: 62, bgStyle: { backgroundColor: "hsl(125,40%,18%)" }, iconStyle: { color: "hsl(125,60%,55%)"  } },
  { label: "Wet",     value: 91, bgStyle: { backgroundColor: "hsl(35,60%,20%)"  }, iconStyle: { color: "hsl(35,90%,65%)"   } },
];

/* ─── MINI VISUALS ─── */
function MiniVisual({ type, isDark }) {

  const dm = {
    card:        isDark ? { background: "#1a2e25", border: "1px solid #2d4a3a" } : { background: "#ffffff", border: "1px solid #c4ded0" },
    cardBg:      isDark ? "#1a2e25" : "#ffffff",
    border:      isDark ? "#2d4a3a" : "#c4ded0",
    outerBg:     isDark ? "linear-gradient(135deg, #1a2e25, #0f1f18)" : "linear-gradient(135deg, #E8F3ED, #C4DED0)",
    textPrimary: isDark ? "#d1e8db" : "#1f2937",
    textMuted:   isDark ? "#6b8f7a" : "#6b7280",
    textTiny:    isDark ? "#4d7060" : "#9ca3af",
    divider:     isDark ? "#2d4a3a" : "#e8f3ed",
  };

  const sensors = isDark ? MOCK_SENSORS_DARK : MOCK_SENSORS;

  /* ── ESP32 ── */
  if (type === "esp32") return (
    <div className="flex items-center gap-3 rounded-xl p-3 mt-3" style={{ background: dm.cardBg, border: `1px solid ${dm.border}` }}>
      <Wifi size={20} color={isDark ? "#34d399" : "#027e69"} />
      <div>
        <p className="text-xs font-semibold leading-none" style={{ color: dm.textPrimary }}>Watering System Online</p>
        <p className="text-[10px] mt-0.5" style={{ color: dm.textMuted }}>Last updated: Just now</p>
      </div>
      <span className="ml-auto w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
    </div>
  );

  /* ── MOISTURE ── */
  if (type === "moisture") return (
    <div className="grid grid-cols-3 gap-2 mt-3">
      {sensors.map(({ label, value, bgStyle, iconStyle }) => (
        <div key={label} className="rounded-2xl p-3" style={{ background: dm.outerBg }}>
          <div className="rounded-xl p-3 shadow-sm" style={{ background: dm.cardBg }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={bgStyle}>
              <Droplet size={14} style={iconStyle} />
            </div>
            <p className="text-base font-bold text-center" style={{ color: dm.textPrimary }}>{value}%</p>
            <p className="text-[9px] text-center uppercase tracking-wide mb-1" style={{ color: dm.textMuted }}>Moisture</p>
            <div className="flex justify-center">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: `${iconStyle.color}25`, color: iconStyle.color }}>
                {label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── BATCH ── */
  if (type === "batch") return (
    <div className="mt-3 rounded-xl p-3 space-y-2" style={{ background: dm.cardBg, border: `1px solid ${dm.border}` }}>
      <div className="flex items-center gap-2">
        <span className="text-[11px]" style={{ color: dm.textMuted }}>Growth Stage:</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{
            background: isDark ? "hsl(135,30%,18%)" : "hsl(135,50%,92%)",
            color:      isDark ? "hsl(135,60%,55%)" : "hsl(135,50%,22%)",
            border:     `1px solid ${isDark ? "hsl(135,40%,28%)" : "hsl(135,50%,72%)"}`,
          }}>
          Seedling
        </span>
      </div>
      {[
        ["Due Tomorrow", isDark ? "hsl(35,100%,65%)"  : "hsl(35,100%,50%)"],
        ["Due Now",      isDark ? "hsl(220,74%,72%)"  : "hsl(220,74%,62%)"],
        ["Past Due",     isDark ? "hsl(353,70%,70%)"  : "hsl(353,70%,60%)"],
        ["Harvested",    isDark ? "hsl(125,60%,50%)"  : "hsl(125,60%,28%)"],
      ].map(([s, c]) => (
        <div key={s} className="flex items-center gap-2">
          <Clock size={11} color={dm.textMuted} />
          <span className="text-[11px]" style={{ color: dm.textMuted }}>Harvest:</span>
          <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: c }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: c }} />
            {s}
          </span>
        </div>
      ))}
    </div>
  );

  /* ── ROLES ── */
  if (type === "roles") return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {[
        { role: "Admin",  color: isDark ? "hsl(35,90%,65%)"  : "hsl(35,80%,70%)",  items: ["All permissions","Manage data","Manage users","Password resets"] },
        { role: "Farmer", color: isDark ? "hsl(180,15%,60%)" : "hsl(180,2%,43%)",  items: ["Monitor moisture","View analytics","Respond to alerts","View plant data"] },
      ].map(r => (
        <div key={r.role} className="rounded-xl p-3" style={{ background: dm.cardBg, border: `1px solid ${dm.border}` }}>
          <div className="flex items-center gap-1.5 mb-2">
            <ShieldCheck size={13} style={{ color: r.color }} />
            <span className="text-xs font-semibold" style={{ color: r.color }}>{r.role}</span>
          </div>
          {r.items.map(item => (
            <div key={item} className="flex items-center gap-1 mb-0.5">
              <CheckCircle size={9} style={{ color: r.color }} />
              <span className="text-[9px]" style={{ color: dm.textMuted }}>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  /* ── STATS ── */
  if (type === "stats") return (
    <div className="mt-3 grid grid-cols-4 gap-1.5">
      {[
        ["Seedlings", "248", isDark ? "#4ade80" : "#25a244"],
        ["Grown",     "182", isDark ? "#34d399" : "#208b3a"],
        ["Dead",      "14",  isDark ? "hsl(355,100%,70%)" : "hsl(355,100%,45%)"],
        ["Replants",  "12",  isDark ? "hsl(35,90%,65%)"  : "hsl(35,80%,40%)"],
      ].map(([l, v, c]) => (
        <div key={l} className="rounded-lg p-2 text-center" style={{ background: dm.cardBg, border: `1px solid ${dm.border}` }}>
          <p className="text-sm font-bold" style={{ color: c }}>{v}</p>
          <p className="text-[9px]" style={{ color: dm.textMuted }}>{l}</p>
        </div>
      ))}
    </div>
  );

  /* ── PASSWORD RESET ── */
  if (type === "pwreset") return (
    <div className="mt-3 space-y-2">
      {[
        ["jdelacruz", "Pending",   isDark ? { bg:"hsl(45,60%,18%)",  text:"hsl(45,90%,65%)",  border:"hsl(45,50%,28%)"  } : { bg:"#fef9c3", text:"#a16207", border:"#fde68a" }],
        ["mreyes",    "Completed", isDark ? { bg:"hsl(125,40%,14%)", text:"hsl(125,60%,50%)", border:"hsl(125,40%,25%)" } : { bg:"#dcfce7", text:"#166534", border:"#86efac" }],
      ].map(([u, s, clr]) => (
        <div key={u} className="flex items-center justify-between rounded-lg px-3 py-2"
          style={{ background: dm.cardBg, border: `1px solid ${dm.border}` }}>
          <span className="text-[11px] font-medium" style={{ color: dm.textPrimary }}>@{u}</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full border font-medium"
            style={{ background: clr.bg, color: clr.text, borderColor: clr.border }}>
            {s}
          </span>
        </div>
      ))}
    </div>
  );

  /* ── ALERTS ── */
  if (type === "alerts") return (
    <div className="mt-3 space-y-1.5">
      {[
        [AlertTriangle, "Low Moisture",    "Auto-watering triggered",
          isDark ? "hsl(355,100%,70%)" : "hsl(355,100%,45%)",
          isDark ? "hsl(355,60%,18%)"  : "hsl(355,100%,95%)"],
        [AlertTriangle, "Low Water Level", "Refill drum soon",
          isDark ? "hsl(35,90%,65%)"  : "hsl(35,80%,40%)",
          isDark ? "hsl(35,60%,16%)"  : "hsl(35,100%,94%)"],
        [WifiOff,       "System Offline",  "Check power & Wi-Fi",
          isDark ? "hsl(220,15%,65%)" : "hsl(220,2%,43%)",
          isDark ? "hsl(220,15%,18%)" : "hsl(0,0%,94%)"],
        [CheckCircle,   "Harvest Ready",   "Batch due today",
          isDark ? "hsl(125,60%,50%)" : "hsl(125,60%,28%)",
          isDark ? "hsl(125,40%,14%)" : "hsl(125,60%,94%)"],
      ].map(([Icon, title, sub, color, bg]) => (
        <div key={title} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{ background: bg }}>
          <Icon size={13} style={{ color, marginTop: 1 }} />
          <div>
            <p className="text-[10px] font-semibold" style={{ color }}>{title}</p>
            <p className="text-[9px]" style={{ color: dm.textMuted }}>{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return null;
}



/* ─── STEP LIST ─── */
function StepList({ steps, isDark }) {
  return (
    <ol className="mt-2 space-y-1">
      {steps.map((s, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="flex-shrink-0 w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center font-bold mt-0.5"
            style={{ background: isDark ? "#059669" : "#027e69" }}>
            {i + 1}
          </span>
          <span className="text-[11px] leading-relaxed" style={{ color: isDark ? "#9abfad" : "#4b5563" }}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

/* ─── SECTION CARD ─── */
function SectionCard({ section, isDark }) {
  const [openIdx, setOpenIdx] = useState(null);

  const dm = {
    cardBg:      isDark ? "#111f18" : "#ffffff",
    border:      isDark ? "#1e3328" : "#c4ded0",
    divider:     isDark ? "#1e3328" : "#e8f3ed",
    headerBg:    isDark ? `${section.color}22` : `${section.color}12`,
    headerBdr:   isDark ? `${section.color}30` : "#c4ded030",
    titleText:   isDark ? "#d1e8db" : "#1f2937",
    descText:    isDark ? "#5a8070" : "#6b7280",
    subTitle:    isDark ? "#b0d0be" : "#374151",
    hoverBg:     isDark ? "#162419" : "#f5faf7",
    chevron:     isDark ? "#4d7060" : "#9ca3af",
    bodyText:    isDark ? "#8aaf9a" : "#4b5563",
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: `1px solid ${dm.border}`, background: dm.cardBg }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2.5"
        style={{ background: dm.headerBg, borderBottom: `1px solid ${dm.headerBdr}` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: section.color }}>
          <span style={{ color: "#fff" }}>{section.icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: dm.titleText }}>{section.label}</p>
          <p className="text-[10px] leading-tight" style={{ color: dm.descText }}>{section.description}</p>
        </div>
      </div>

      {/* Subsections */}
      <div style={{ borderTop: `1px solid ${dm.divider}` }}>
        {section.subsections.map((sub, i) => (
          <div key={i} style={{ borderBottom: i < section.subsections.length - 1 ? `1px solid ${dm.divider}` : "none" }}>
            <button
              className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
              style={{ background: "transparent" }}
              onMouseEnter={e => e.currentTarget.style.background = dm.hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span className="text-xs font-medium" style={{ color: dm.subTitle }}>{sub.title}</span>
              {openIdx === i
                ? <ChevronUp size={13} style={{ color: dm.chevron, flexShrink: 0 }} />
                : <ChevronDown size={13} style={{ color: dm.chevron, flexShrink: 0 }} />
              }
            </button>
            {openIdx === i && (
              <div className="px-4 pb-3">
                <p className="text-[11px] leading-relaxed" style={{ color: dm.bodyText }}>{sub.body}</p>
                {sub.steps && <StepList steps={sub.steps} isDark={isDark} />}
                {sub.visual && <MiniVisual type={sub.visual} isDark={isDark} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
function Admin_guide({ activeSection }) {
  const { user } = useUser();
  const isDark = useDarkMode();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const visibleSections = isAdmin
    ? SECTIONS
    : SECTIONS.filter(s => FARMER_SECTION_IDS.includes(s.id));

  const currentSection =
    visibleSections.find(s => s.id === activeSection) || visibleSections[0];

  const dm = {
    cardBg:      isDark ? "#111f18" : "#ffffff",
    border:      isDark ? "#1e3328" : "#c4ded0",
    titleText:   isDark ? "#d1e8db" : "#111827",
    subText:     isDark ? "#4d7060" : "#9ca3af",
    footerText:  isDark ? "#5a8070" : "#6b7280",
    accentText:  isDark ? "#34d399" : "#027e69",
    adminPillBg: isDark ? "hsl(35,50%,18%)"  : "hsl(35,80%,93%)",
    adminPillTx: isDark ? "hsl(35,90%,65%)"  : "hsl(35,80%,38%)",
    farmerPillBg:isDark ? "hsl(180,10%,18%)" : "hsl(180,2%,90%)",
    farmerPillTx:isDark ? "hsl(180,15%,60%)" : "hsl(180,3%,29%)",
    iconAccent:  isDark ? "#059669" : "#027e69",
  };

  return (
    <section className="w-full min-h-full py-4" style={{ background: dm.pageBg }}>

      {/* Page Title */}
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm mb-4"
        style={{ background: dm.cardBg, border: `1px solid ${dm.border}` }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: dm.iconAccent }}>
          <BookOpen size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-none" style={{ color: dm.titleText }}>
            {isAdmin ? "Admin Guide" : "Farmer Guide"} — SproutSync
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: dm.subText }}>
            {isAdmin ? "Full reference for all system features" : "Reference for monitoring and hardware features"}
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: isAdmin ? dm.adminPillBg  : dm.farmerPillBg,
            color:      isAdmin ? dm.adminPillTx  : dm.farmerPillTx,
          }}>
          {isAdmin ? <ShieldCheck size={11} /> : <Eye size={11} />}
          {user?.role || "Viewer"}
        </span>
      </div>

      {/* Section Card */}
      {currentSection && (
        <SectionCard key={currentSection.id} section={currentSection} isDark={isDark} />
      )}

      {/* Footer */}
      <div className="mt-4 rounded-xl px-4 py-3 flex items-start gap-2"
        style={{ border: `1px solid ${dm.border}`, background: dm.cardBg }}>
        <CheckCircle size={13} style={{ color: dm.accentText, marginTop: 2, flexShrink: 0 }} />
        <p className="text-[10px] leading-relaxed" style={{ color: dm.footerText }}>
          For additional support, contact the SproutSync team at{" "}
          <span className="font-medium" style={{ color: dm.accentText }}>sproutsync031@gmail.com</span>
          {" "}or visit{" "}
          <span className="font-medium" style={{ color: dm.accentText }}>sprout-sync-phi.vercel.app</span>
          <span className="font-medium" style={{ color: dm.accentText }}>sprout-sync-phi.vercel.app</span>
        </p>
      </div>

    </section>
  );
}

export default Admin_guide;