import { useState, useMemo, useEffect } from "react";
import { FilterBtn, TableWrap, Tr, Td, Th, Pager, EmptyRow } from "./components/irrigation_monitoring_components";

const PAGE_SIZE = 5;

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtTs(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
}

const getWaterMeta = (level) => {
  if (level >= 60) return { label: "Normal",   color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" };
  if (level >= 30) return { label: "Low",      color: "bg-amber-100 text-amber-700",     dot: "bg-amber-500" };
  return             { label: "Critical", color: "bg-red-100 text-red-700",           dot: "bg-red-500" };
};

function WaterLevelMonitoring({ waterLevelReadings = [] }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return waterLevelReadings.filter((r) => {
      const level = parseFloat(r.value);
      if (statusFilter === "All") return true;
      return getWaterMeta(level).label === statusFilter;
    });
  }, [waterLevelReadings, statusFilter]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onFilter = (f) => { setStatusFilter(f); setPage(1); };

  const levels = waterLevelReadings.map(r => parseFloat(r.value));
  const avg = levels.length ? Math.round(levels.reduce((s, v) => s + v, 0) / levels.length) : 0;
  const min = levels.length ? Math.min(...levels) : 0;
  const max = levels.length ? Math.max(...levels) : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">Water Level Monitoring</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Ultrasonic sensor (sensor_id = 8) — tank level and status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Average Level", value: `${avg}%`, color: "text-[#027e69]" },
          { label: "Minimum Level", value: `${min}%`, color: "text-red-500" },
          { label: "Maximum Level", value: `${max}%`, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4">
        {["All", "Normal", "Low", "Critical"].map((f) => (
          <FilterBtn key={f} label={f} active={statusFilter === f} onClick={() => onFilter(f)} />
        ))}
      </div>

      {/* Table */}
      <TableWrap>
        <thead>
          <tr>
            <Th>Timestamp</Th>
            <Th>Water Level</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {!paged.length ? (
            <EmptyRow cols={3} />
          ) : (
            paged.map((r) => {
              const level = parseFloat(r.value);
              const m = getWaterMeta(level);
              return (
                <Tr key={r.reading_id}>
                  <Td className="text-xs text-gray-400 tabular-nums">
                    {fmtTs(r.recorded_at)}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            level >= 60 ? "bg-emerald-400" : level >= 30 ? "bg-amber-400" : "bg-red-400"
                          }`}
                          style={{ width: `${Math.min(level, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{level.toFixed(1)}%</span>
                    </div>
                  </Td>
                  <Td>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${m.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                      {m.label}
                    </span>
                  </Td>
                </Tr>
              );
            })
          )}
        </tbody>
      </TableWrap>

      {/* Pagination */}
      <Pager page={page} total={filtered.length} onPage={setPage} />
    </div>
  );
}

export default WaterLevelMonitoring;