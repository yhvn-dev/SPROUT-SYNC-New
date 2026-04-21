const PAGE_SIZE = 5;

export function Pager({ page, total, onPage, isDark }) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;
  return (
    <div className={`flex items-center justify-end gap-2 mt-3 text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}>
      <span>Page {page} of {pages}</span>
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`px-3 py-1 rounded border transition disabled:opacity-40 disabled:cursor-not-allowed
          ${isDark
            ? "border-gray-600 text-gray-300 hover:border-[#009983] hover:text-[#009983]"
            : "border-gray-200 hover:border-[#009983] hover:text-[#009983]"
          }`}
      >
        ← Prev
      </button>
      <button
        onClick={() => onPage(Math.min(pages, page + 1))}
        disabled={page === pages}
        className={`px-3 py-1 rounded border transition disabled:opacity-40 disabled:cursor-not-allowed
          ${isDark
            ? "border-gray-600 text-gray-300 hover:border-[#009983] hover:text-[#009983]"
            : "border-gray-200 hover:border-[#009983] hover:text-[#009983]"
          }`}
      >
        Next →
      </button>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, isDark }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:border-[#009983] w-52 transition
        ${isDark
          ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500"
          : "bg-white border-gray-200 text-gray-700 placeholder-gray-300"
        }`}
    />
  );
}

export function TableWrap({ children, isDark }) {
  return (
    <div className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? "border-gray-700" : "border-gray-100"}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, isDark }) {
  return (
    <th className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider border-b
      ${isDark
        ? "bg-gray-800 text-gray-400 border-gray-700"
        : "bg-gray-50 text-gray-400 border-gray-100"
      }`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "", isDark }) {
  return (
    <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"} ${className}`}>
      {children}
    </td>
  );
}

export function Tr({ children, isDark }) {
  return (
    <tr className={`border-b last:border-0 transition-colors duration-100
      ${isDark
        ? "border-gray-700 hover:bg-gray-700/50"
        : "border-gray-50 hover:bg-[#f0faf7]"
      }`}>
      {children}
    </tr>
  );
}

export function EmptyRow({ cols, isDark }) {
  return (
    <tr>
      <td colSpan={cols} className={`text-center py-10 text-sm ${isDark ? "text-gray-500" : "text-gray-300"}`}>
        No records found
      </td>
    </tr>
  );
}




export function FilterBtn({ label, active, onClick, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
        ${active
          ? "bg-[#027e69] text-white border-[#027e69] shadow-sm"
          : isDark
            ? "bg-gray-800 text-gray-400 border-gray-600 hover:border-[#009983] hover:text-[#009983]"
            : "bg-white text-gray-500 border-gray-200 hover:border-[#009983] hover:text-[#009983]"
        }`}
    >
      {label}
    </button>
  );
}