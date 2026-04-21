import { useState, useMemo } from "react";
import { FilterBtn, TableWrap, Tr, Td, Pager, Th, EmptyRow, SearchInput } from "./components/irrigation_monitoring_components";
import { Trash2 } from "lucide-react";
import ExcelDownloadBtn from "../../components/excelDownloadBtn.jsx";
import { useUser } from "../../hooks/userContext.jsx";

const PLANT_MAP = { 5: "Bokchoy", 6: "Pechay", 7: "Mustasa" };
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

function MoistureMonitoring({ moistureReadings = [], onDeleteOne, onDeleteAll }) {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const [plantFilter, setPlantFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    return moistureReadings.filter(r => {
      const plant = PLANT_MAP[r.sensor_id] || "";
      if (plantFilter !== "All" && plant !== plantFilter) return false;
      if (search && !fmtTs(r.recorded_at).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [moistureReadings, plantFilter, search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const onFilter = (f) => { setPlantFilter(f); setPage(1); };
  const onSearch = (v) => { setSearch(v); setPage(1); };

  const avg = (arr) => arr.length ? (arr.reduce((s, v) => s + parseFloat(v), 0) / arr.length).toFixed(1) : "—";
  const bk  = moistureReadings.filter(r => r.sensor_id === 5).map(r => r.value);
  const pc  = moistureReadings.filter(r => r.sensor_id === 6).map(r => r.value);
  const mt  = moistureReadings.filter(r => r.sensor_id === 7).map(r => r.value);

  const exportData = useMemo(() => {
    return filtered.map((r, i) => ({
      "#": i + 1,
      Timestamp: fmtTs(r.recorded_at),
      "Plant Groups": PLANT_MAP[r.sensor_id] || "Unknown",
      "Moisture (%)": parseFloat(r.value).toFixed(1),
      Status: getMoistureMeta(r.value).label,
    }));
  }, [filtered]);

  const exportFilename = `moisture-logs-${(plantFilter === "All" ? "all-plants" : plantFilter).toLowerCase()}`;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Plant Moisture Monitoring</h2>
          <p className="text-xs text-gray-400 mt-0.5">Soil sensor readings — real-time moisture data per plant</p>
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
          { label: "Bokchoy avg", value: `${avg(bk)}%`, color: "text-[#027e69]" },
          { label: "Pechay avg",  value: `${avg(pc)}%`, color: "text-[#009983]" },
          { label: "Mustasa avg", value: `${avg(mt)}%`, color: "text-teal-600"  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + Delete All */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Bokchoy", "Pechay", "Mustasa"].map(f => (
            <FilterBtn key={f} label={f} active={plantFilter === f} onClick={() => onFilter(f)} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={onSearch} placeholder="Search timestamp..." />

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

      {/* Table with overflow-x for mobile */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
        <div style={{ minWidth: "600px" }}>
          <TableWrap>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Timestamp</Th>
                <Th>Plant Group</Th>
                <Th>Moisture</Th>
                <Th>Status</Th>
                {isAdmin && <Th>Action</Th>}
              </tr>
            </thead>
            <tbody>
              {!paged.length ? <EmptyRow cols={isAdmin ? 6 : 5} /> : paged.map((r, index) => {
                const plant = PLANT_MAP[r.sensor_id] || "Unknown";
                const m     = getMoistureMeta(r.value);
                const val   = parseFloat(r.value);
                return (
                  <Tr key={r.reading_id}>
                    <Td className="text-xs text-gray-400 tabular-nums">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </Td>
                    <Td className="text-xs text-gray-400 tabular-nums">
                      {fmtTs(r.recorded_at)}
                    </Td>
                    <Td>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e1f5ee] text-[#085041]">
                        {plant}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${val >= 60 ? "bg-emerald-400" : val >= 35 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(val, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{val.toFixed(1)}%</span>
                      </div>
                    </Td>
                    <Td>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${m.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                        {m.label}
                      </span>
                    </Td>
                    {isAdmin && (
                      <Td>
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
              })}
            </tbody>
          </TableWrap>
        </div>
      </div>

      <Pager page={page} total={filtered.length} onPage={setPage} />
    </div>
  );
}

export default MoistureMonitoring;