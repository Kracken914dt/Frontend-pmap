import { getAuthUser } from '../utils/storage';
import { User, Shield, Mail, Calendar, CheckCircle } from 'lucide-react';

export default function PerfilPage() {
  const user = getAuthUser();

  // Get initials for avatar
  const initials = user
    ? `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase()
    : 'U';

  let registrationDate = 'N/A';
  if (user && user.fechaRegistro) {
    let dateStr = '';
    if (Array.isArray(user.fechaRegistro)) {
      const year = user.fechaRegistro[0];
      const month = String(user.fechaRegistro[1]).padStart(2, '0');
      const day = String(user.fechaRegistro[2]).padStart(2, '0');
      const hours = String(user.fechaRegistro[3] ?? 0).padStart(2, '0');
      const minutes = String(user.fechaRegistro[4] ?? 0).padStart(2, '0');
      dateStr = `${year}-${month}-${day}T${hours}:${minutes}:00`;
    } else if (typeof user.fechaRegistro === 'string') {
      dateStr = user.fechaRegistro;
    } else {
      dateStr = String(user.fechaRegistro);
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      registrationDate = d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }


  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Mi Perfil</h2>
        <p className="text-sm text-slate-400">Consulta los detalles de tu cuenta de usuario.</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl backdrop-blur-md">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-midnight-500/10 blur-3xl" />

        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left sm:items-start">
          {/* Avatar Initials */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-midnight-500 to-violet-600 text-3xl font-bold text-white shadow-lg border border-white/20 select-none">
            {initials}
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {user?.nombres} {user?.apellidos}
              </h3>
              <div className="mt-1.5 flex flex-wrap justify-center sm:justify-start gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.rol === 'ADMINISTRADOR'
                      ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                      : 'bg-midnight-500/10 text-midnight-300 border border-midnight-500/20'
                  }`}
                >
                  {user?.rol === 'ADMINISTRADOR' ? (
                    <Shield className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                  {user?.rol}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="h-3.5 w-3.5" /> {user?.estado}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3.5">
              <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-300">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Correo Electrónico</p>
                  <p className="text-sm font-medium">{user?.correo}</p>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-300">
                <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Fecha de Creación</p>
                  <p className="text-sm font-medium">{registrationDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}