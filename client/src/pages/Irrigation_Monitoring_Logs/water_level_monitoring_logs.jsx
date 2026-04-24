import { useState, useMemo } from "react";
import { FilterBtn, TableWrap, Tr, Td, Th, Pager, EmptyRow } from "./components/irrigation_monitoring_components";
import ExcelDownloadBtn from "../../components/excelDownloadBtn";
import { useUser } from "../../hooks/userContext.jsx";

const PAGE_SIZE = 5;

function fmtTs(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
}

const getWaterMeta = (level) => {
  if (level >= 60) return { label: "Normal",   color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" };
  if (level >= 30) return { label: "Low",      color: "bg-amber-100 text-amber-700",     dot: "bg-amber-500"   };
  return             { label: "Critical", color: "bg-red-100 text-red-700",           dot: "bg-red-500"     };
};

// ─── Custom FilterBtn with dark mode metal-dark4 unselected style ─────────────
function WaterFilterBtn({ label, active, onClick, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors`}
      style={
        active
          ? { backgroundColor: "var(--sancgb)", color: "#ffffff" }
          : isDark
            ? { backgroundColor: "var(--metal-dark4)", color: "var(--metal-dark1)" }
            : { backgroundColor: "#f3f4f6", color: "#6b7280" }
      }
    >
      {label}
    </button>
  );
}

function WaterLevelMonitoring({ waterLevelReadings = [], onDeleteOne, onDeleteAll, isDark }) {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

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

  const exportData = useMemo(() => {
    return filtered.map((r, i) => ({
      "#": i + 1,
      Timestamp: fmtTs(r.recorded_at),
      "Water Level (%)": parseFloat(r.value).toFixed(1),
      Status: getWaterMeta(parseFloat(r.value)).label,
    }));
  }, [filtered]);

  const exportFilename = `water-level-logs-${statusFilter.toLowerCase().replace(" ", "-")}`;

  return (
    <div className="overflow-y-auto max-h-[450px]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Water Level Monitoring
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Ultrasonic sensor (sensor_id = 8) — tank level and status
          </p>
        </div>
        <ExcelDownloadBtn
          data={exportData}
          filename={exportFilename}
          sheetName="Water Level Logs"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Average Level", value: `${avg}%`, color: "text-[var(--sancgd)]"   },
          { label: "Minimum Level", value: `${min}%`, color: "text-red-500"     },
          { label: "Maximum Level", value: `${max}%`, color: "text-emerald-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border px-4 py-3 shadow-sm"
            style={{
              backgroundColor: isDark ? "hsl(180, 100%, 10%)" : "#ffffff",
              borderColor: isDark ? "hsl(180, 60%, 18%)" : "#f3f4f6",
            }}
          >
            <p className={`text-[11px] uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-400"}`}>
              {s.label}
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + Delete All */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex gap-1.5">
          {["All", "Normal", "Low", "Critical"].map((f) => (
            <WaterFilterBtn
              key={f}
              label={f}
              active={statusFilter === f}
              onClick={() => onFilter(f)}
              isDark={isDark}
            />
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={onDeleteAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
            style={{ backgroundColor: "var(--color-danger-b)", color: "hsl(355, 100%, 30%)" }}
          >
            Delete All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-y-auto">
        <TableWrap isDark={isDark}>
          <thead>
            <tr>
              <Th isDark={isDark}>#</Th>
              <Th isDark={isDark}>Timestamp</Th>
              <Th isDark={isDark}>Water Level</Th>
              <Th isDark={isDark}>Status</Th>
              {isAdmin && <Th isDark={isDark}>Action</Th>}
            </tr>
          </thead>
          <tbody>
            {!paged.length ? (
              <EmptyRow cols={isAdmin ? 5 : 4} isDark={isDark} />
            ) : (
              paged.map((r, index) => {
                const level = parseFloat(r.value);
                const m = getWaterMeta(level);
                return (
                  <Tr key={r.reading_id} isDark={isDark}>
                    <Td isDark={isDark} className="text-xs tabular-nums">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </Td>
                    <Td isDark={isDark} className="text-xs tabular-nums">
                      {fmtTs(r.recorded_at)}
                    </Td>
                    <Td isDark={isDark}>
                      <div className="flex items-center gap-2">
                        <div className={`w-24 h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                          <div
                            className={`h-full rounded-full ${
                              level >= 60 ? "bg-emerald-400" : level >= 30 ? "bg-amber-400" : "bg-red-400"
                            }`}
                            style={{ width: `${Math.min(level, 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                          {level.toFixed(1)}%
                        </span>
                      </div>
                    </Td>
                    <Td isDark={isDark}>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${m.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                        {m.label}
                      </span>
                    </Td>
                    {isAdmin && (
                      <Td isDark={isDark}>
                        <button
                          onClick={() => onDeleteOne(r)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
                          style={{ backgroundColor: "var(--color-danger-b)", color: "hsl(355, 100%, 30%)" }}>
                          Delete
                        </button>
                      </Td>
                    )}
                  </Tr>
                );
              })
            )}
          </tbody>
        </TableWrap>
      </div>

      <Pager page={page} total={filtered.length} onPage={setPage} isDark={isDark} />
    </div>
    
  );
}



export default WaterLevelMonitoring;