import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center text-white bg-slate-950/20">
      <div className="max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-white/20">
        <div className="flex justify-center text-midnight-400">
          <AlertCircle className="h-16 w-16 animate-bounce" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-midnight-300">Error 404</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Página no encontrada</h2>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Lo sentimos, el recurso que estás buscando no existe en el sistema o ha sido trasladado permanentemente.
        </p>
        <Link
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-midnight-600 px-5 py-3 font-semibold text-white transition hover:bg-midnight-500 active:scale-95 shadow-lg shadow-midnight-500/20"
          to="/"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al Inicio
        </Link>
      </div>
    </div>
  );
}