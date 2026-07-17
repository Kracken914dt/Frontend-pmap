import { LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ userName, onLogout }) {
  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-midnight-200">
            <Sparkles className="h-4 w-4" /> PMAP
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Panel de Control PMAP</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            {userName}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full bg-midnight-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-midnight-400"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>
    </header>
  );
}