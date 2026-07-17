export default function Modal({ open, title, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-glow">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}