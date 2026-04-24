import { useState, useMemo } from "react";
import { FilterBtn, TableWrap, Tr, Td, Pager, Th, EmptyRow, SearchInput } from "./components/irrigation_monitoring_components";
import ExcelDownloadBtn from "../../components/excelDownloadBtn.jsx";
import { useUser } from "../../hooks/userContext.jsx";
import { useDarkMode } from "../../hooks/useDarkMode.jsx"; 

const PLANT_MAP = { 5: "Tray Group 1", 6: "Tray Group 2", 7: "Tray Group 3" };
const PAGE_SIZE = 8;

function fmtTs(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getMoistureMeta(v) {
  const n = parseFloat(v);
  if (n >= 60) return { label: "High",   color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" };
  if (n >= 35) return { label: "Medium", color: "bg-amber-100 text-amber-800",     dot: "bg-amber-400"   };
  return             { label: "Low",    color: "bg-red-100 text-red-800",           dot: "bg-red-500"     };
}

function MoistureMonitoring({ moistureReadings = [], onDeleteOne, onDeleteAll, isDark }) {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const [trayFilter, setTrayFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    return moistureReadings.filter(r => {
      const tray = PLANT_MAP[r.sensor_id] || "";
      if (trayFilter !== "All" && tray !== trayFilter) return false;
      if (search && !fmtTs(r.recorded_at).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [moistureReadings, trayFilter, search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const onFilter = (f) => { setTrayFilter(f); setPage(1); };
  const onSearch = (v) => { setSearch(v); setPage(1); };

  const avg = (arr) => arr.length ? (arr.reduce((s, v) => s + parseFloat(v), 0) / arr.length).toFixed(1) : "—";
  const tg1 = moistureReadings.filter(r => r.sensor_id === 5).map(r => r.value);
  const tg2 = moistureReadings.filter(r => r.sensor_id === 6).map(r => r.value);
  const tg3 = moistureReadings.filter(r => r.sensor_id === 7).map(r => r.value);

  const exportData = useMemo(() => {
    return filtered.map((r, i) => ({
      "#": i + 1,
      Timestamp: fmtTs(r.recorded_at),
      "Tray Group": PLANT_MAP[r.sensor_id] || "Unknown",
      "Moisture (%)": parseFloat(r.value).toFixed(1),
      Status: getMoistureMeta(r.value).label,
    }));
  }, [filtered]);

  const exportFilename = `moisture-logs-${(trayFilter === "All" ? "all-trays" : trayFilter.replace(/\s+/g, "-")).toLowerCase()}`;

  return (
    <div className={isDark ? "dark" : ""}>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: isDark ? "hsl(180, 100%, 85%)" : "#1f2937" }}
          >
            Plant Moisture Monitoring
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            Soil sensor readings — real-time moisture data per tray group
          </p>
        </div>
        <ExcelDownloadBtn
          data={exportData}
          filename={exportFilename}
          sheetName="Moisture Logs"
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Tray Group 1 avg", value: `${avg(tg1)}%`, lightColor: "text-[#027e69]" },
          { label: "Tray Group 2 avg", value: `${avg(tg2)}%`, lightColor: "text-[#009983]" },
          { label: "Tray Group 3 avg", value: `${avg(tg3)}%`, lightColor: "text-teal-600"  },
        ].map(s => (
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
            <p
              className="text-2xl font-bold mt-0.5"
              style={{ color: isDark ? "[var(--main-white)]" : undefined }}
            >
              {isDark ? s.value : <span className={s.lightColor}>{s.value}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Filters + Search + Delete All */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Tray Group 1", "Tray Group 2", "Tray Group 3"].map(f => (
            <FilterBtn
              key={f}
              label={f}
              active={trayFilter === f}
              onClick={() => onFilter(f)}
              isDark={isDark}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
        <SearchInput
            value={search}
            onChange={onSearch}
            placeholder="Search timestamp..."
            isDark={isDark}
          />

          {isAdmin && (
            <button
              onClick={onDeleteAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
              style={{ backgroundColor: "var(--color-danger-b)", color: "hsl(355, 100%, 30%)" }}>
              Delete All
            </button>
          )}
        </div>
      </div>

    <div className="overflow-y-auto max-h-[200px]">
      {/* Table */}
      <TableWrap isDark={isDark}>
        <thead>
          <tr>
            <Th isDark={isDark}>#</Th>
            <Th isDark={isDark}>Timestamp</Th>
            <Th isDark={isDark}>Tray Group</Th>
            <Th isDark={isDark}>Moisture</Th>
            <Th isDark={isDark}>Status</Th>
            {isAdmin && <Th isDark={isDark}>Action</Th>}
          </tr>
        </thead>
        <tbody>
          {!paged.length
            ? <EmptyRow cols={isAdmin ? 6 : 5} isDark={isDark} />
            : paged.map((r, index) => {
                const tray = PLANT_MAP[r.sensor_id] || "Unknown";
                const m    = getMoistureMeta(r.value);
                const val  = parseFloat(r.value);
                return (
                  <Tr key={r.reading_id} isDark={isDark}>
                    <Td isDark={isDark} className={`text-xs tabular-nums ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </Td>
                    <Td isDark={isDark} className={`text-xs tabular-nums ${isDark ? "text-[var(--main-white)]" : "text-gray-400"}`}>
                      {fmtTs(r.recorded_at)}
                    </Td>
                    <Td isDark={isDark}>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: isDark ? "hsl(180, 100%, 10%)" : "#e1f5ee",
                          color: isDark ? "hsl(180, 100%, 65%)" : "#085041",
                        }}
                      >
                        {tray}
                      </span>
                    </Td>
                    <Td isDark={isDark}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-20 h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: isDark ? "hsl(180, 30%, 15%)" : "#f3f4f6" }}
                        >
                          <div
                            className={`h-full rounded-full ${val >= 60 ? "bg-emerald-400" : val >= 35 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(val, 100)}%` }}
                          />
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: isDark ? "hsl(180, 100%, 85%)" : "#374151" }}
                        >
                          {val.toFixed(1)}%
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
                          style={{ backgroundColor: "var(--color-danger-b)", color: "hsl(355, 100%, 30%)" }}
                        >
                          Delete
                        </button>
                      </Td>
                    )}
                  </Tr>
                );
              })
          }
        </tbody>
      </TableWrap>

      </div>
      <Pager page={page} total={filtered.length} onPage={setPage} isDark={isDark} />
    </div>

  );
}


export default MoistureMonitoring;