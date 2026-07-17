export default function Table({ headers, children }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}