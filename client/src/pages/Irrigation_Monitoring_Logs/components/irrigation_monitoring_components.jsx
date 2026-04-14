
const PAGE_SIZE = 5;

export function Pager({ page, total, onPage }) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-400">
      <span>Page {page} of {pages}</span>
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded border border-gray-200 hover:border-[#009983] hover:text-[#009983] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>
      <button
        onClick={() => onPage(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="px-3 py-1 rounded border border-gray-200 hover:border-[#009983] hover:text-[#009983] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#009983] text-gray-700 w-52 placeholder-gray-300"
    />
  );
}

export function TableWrap({ children }) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>;
}

export function Tr({ children }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#f0faf7] transition-colors duration-100">
      {children}
    </tr>
  );
}

export function EmptyRow({ cols }) {
  return (
    <tr>
      <td colSpan={cols} className="text-center py-10 text-gray-300 text-sm">
        No records found
      </td>
    </tr>
  );
}


export function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
        ${active
          ? "bg-[#027e69] text-white border-[#027e69] shadow-sm"
          : "bg-white text-gray-500 border-gray-200 hover:border-[#009983] hover:text-[#009983]"
        }`}
    >
      {label}
    </button>
  );
}

