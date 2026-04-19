import { useState, useMemo, useEffect } from "react";
import { TableWrap, Tr, Td, Pager, Th, EmptyRow, SearchInput } from "./components/irrigation_monitoring_components";
import ExcelDownloadBtn from "../../components/excelDownloadBtn";

const PAGE_SIZE = 5;

function fmtTs(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function fmtDuration(secs) {
  if (!secs && secs !== 0) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function Watering_Logs({ wateringLogs = [], onDeleteOne, onDeleteAll }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log("Watering Logs sa component", wateringLogs);
  }, []);

  const filtered = useMemo(() => {
    return wateringLogs.filter(r => {
      if (search && !r.plant_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [wateringLogs, search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const onSearch = (v) => { setSearch(v); setPage(1); };

  const totalLogs     = wateringLogs.length;
  const totalDuration = wateringLogs.reduce((sum, r) => sum + (r.duration || 0), 0);
  const uniquePlants  = new Set(wateringLogs.map(r => r.plant_name)).size;

  const exportData = useMemo(() => {
    return filtered.map((r, i) => ({
      "#": i + 1,
      Timestamp: fmtTs(r.ts),
      "Plant Name": r.plant_name,
      "Duration (secs)": r.duration,
    }));
  }, [filtered]);

  const exportFilename = search
    ? `watering-logs-${search.toLowerCase().replace(/\s+/g, "-")}`
    : "watering-logs-all";

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Watering Logs</h2>
          <p className="text-xs text-gray-400 mt-0.5">Irrigation events — plant watering history and duration</p>
        </div>

        <ExcelDownloadBtn
          data={exportData}
          filename={exportFilename}
          sheetName="Watering Logs"
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Logs",     value: totalLogs,                    color: "text-[#027e69]"  },
          { label: "Unique Plants",  value: uniquePlants,                 color: "text-blue-600"   },
          { label: "Total Duration", value: fmtDuration(totalDuration),   color: "text-orange-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Delete All */}
      <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-2 mb-4">
        <SearchInput value={search} onChange={onSearch} placeholder="Search plant name..." />

        <button
          onClick={onDeleteAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
          style={{ backgroundColor: "var(--color-danger-b)", color: "#a30012" }}
        >
          Delete All
        </button>
      </div>

      {/* Table */}
      <TableWrap>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Timestamp</Th>
            <Th>Plant Name</Th>
            <Th>Duration</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {!paged.length ? <EmptyRow cols={5} /> : paged.map((r, index) => (
            <Tr key={r.watering_log_id}>
              <Td className="text-xs text-gray-400 tabular-nums">
                {(page - 1) * PAGE_SIZE + index + 1}
              </Td>
              <Td className="text-xs text-gray-400 tabular-nums">
                {fmtTs(r.ts)}
              </Td>
              <Td>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  🌿 {r.plant_name}
                </span>
              </Td>
              <Td>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {fmtDuration(r.duration)}
                </span>
              </Td>
              <Td>
                <button
                  onClick={() => onDeleteOne(r)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--color-danger-b)", color: "#a30012" }}
                >
                  🗑 Delete
                </button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>

      <Pager page={page} total={filtered.length} onPage={setPage} />
    </div>
  );
}




export default Watering_Logs;