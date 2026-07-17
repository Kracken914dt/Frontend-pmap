export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="rounded-full border border-white/10 px-3 py-2 text-slate-300 disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-slate-400">{currentPage} / {totalPages}</span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="rounded-full border border-white/10 px-3 py-2 text-slate-300 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}