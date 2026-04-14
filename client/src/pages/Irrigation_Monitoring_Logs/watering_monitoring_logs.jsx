import { useState, useMemo } from "react";
import { FilterBtn, TableWrap, Tr, Td, Pager, Th, EmptyRow, SearchInput } from "./components/irrigation_monitoring_components";


const PAGE_SIZE = 5;

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtTs(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
}


const wateringData = [
  { id: 1,  ts: "2025-04-14T08:32:00", action: "ON",  mode: "AUTO",   reason: "Scheduled morning cycle" },
  { id: 2,  ts: "2025-04-14T08:47:00", action: "OFF", mode: "AUTO",   reason: "Cycle complete" },
  { id: 3,  ts: "2025-04-14T10:15:00", action: "ON",  mode: "MANUAL", reason: "Manual override by user" },
  { id: 4,  ts: "2025-04-14T10:22:00", action: "OFF", mode: "MANUAL", reason: "" },
  { id: 5,  ts: "2025-04-14T14:00:00", action: "ON",  mode: "AUTO",   reason: "Afternoon schedule" },
  { id: 6,  ts: "2025-04-14T14:20:00", action: "OFF", mode: "AUTO",   reason: "Cycle complete" },
  { id: 7,  ts: "2025-04-13T08:30:00", action: "ON",  mode: "AUTO",   reason: "Scheduled morning cycle" },
  { id: 8,  ts: "2025-04-13T08:45:00", action: "OFF", mode: "AUTO",   reason: "Cycle complete" },
  { id: 9,  ts: "2025-04-13T13:00:00", action: "ON",  mode: "MANUAL", reason: "Low moisture detected" },
  { id: 10, ts: "2025-04-13T13:15:00", action: "OFF", mode: "MANUAL", reason: "" },
  { id: 11, ts: "2025-04-12T08:30:00", action: "ON",  mode: "AUTO",   reason: "Scheduled morning cycle" },
  { id: 12, ts: "2025-04-12T08:50:00", action: "OFF", mode: "AUTO",   reason: "Cycle complete" },
]   


function Watering_Logs() {
  const [modeFilter, setModeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return wateringData.filter(r => {
      if (modeFilter !== "ALL" && r.mode !== modeFilter) return false;
      if (search && !fmtTs(r.ts).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [modeFilter, search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onFilter = (f) => { setModeFilter(f); setPage(1); };
  const onSearch = (v) => { setSearch(v); setPage(1); };
  const onCount  = wateringData.filter(r => r.action === "ON").length;
  const autoCount = wateringData.filter(r => r.mode === "AUTO").length;
  const manualCount = wateringData.filter(r => r.mode === "MANUAL").length;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">Watering Logs</h2>
        <p className="text-xs text-gray-400 mt-0.5">Irrigation events — action history with mode and status</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Events", value: wateringData.length, color: "text-[#027e69]" },
          { label: "AUTO cycles",  value: autoCount,           color: "text-blue-600" },
          { label: "MANUAL events",value: manualCount,         color: "text-orange-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex gap-1.5">
          {["ALL", "AUTO", "MANUAL"].map(f => (
            <FilterBtn key={f} label={f} active={modeFilter === f} onClick={() => onFilter(f)} />
          ))}
        </div>
        <SearchInput value={search} onChange={onSearch} placeholder="Search timestamp..." />
      </div>

      <TableWrap>
        <thead>
          <tr><Th>Timestamp</Th><Th>Action</Th><Th>Mode</Th><Th>Reason</Th></tr>
        </thead>
        <tbody>
          {!paged.length ? <EmptyRow cols={4} /> : paged.map(r => (
            <Tr key={r.id}>
              <Td className="text-xs text-gray-400 tabular-nums">{fmtTs(r.ts)}</Td>
              <Td>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                  ${r.action === "ON" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${r.action === "ON" ? "bg-emerald-500" : "bg-red-500"}`} />
                  {r.action}
                </span>
              </Td>
              <Td>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                  ${r.mode === "AUTO" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                  {r.mode}
                </span>
              </Td>
              <Td className="text-xs text-gray-400">{r.reason || "—"}</Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      <Pager page={page} total={filtered.length} onPage={setPage} />
    </div>
  );

}

export default Watering_Logs;