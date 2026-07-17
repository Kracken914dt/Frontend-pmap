import { useEffect, useState } from 'react';
import http from '../api/http';
import { getAuthUser } from '../utils/storage';
import { Users, BookOpen, CalendarRange, Sparkles, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const user = getAuthUser();
  const [stats, setStats] = useState({ usuarios: 0, materias: 0, sesiones: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      let usuariosCount = 0;
      let materiasCount = 0;
      let sesionesCount = 0;

      try {
        const res = await http.get('/usuarios');
        if (res.data && Array.isArray(res.data)) {
          usuariosCount = res.data.length;
        }
      } catch (error) {
        console.error('Error al obtener usuarios para el tablero:', error);
      }

      try {
        const res = await http.get('/materias');
        if (res.data && Array.isArray(res.data)) {
          materiasCount = res.data.length;
        }
      } catch (error) {
        console.error('Error al obtener materias para el tablero:', error);
      }

      try {
        const res = await http.get('/sesiones');
        if (res.data && Array.isArray(res.data)) {
          sesionesCount = res.data.length;
        }
      } catch (error) {
        console.error('Error al obtener sesiones para el tablero:', error);
      }

      setStats({
        usuarios: usuariosCount,
        materias: materiasCount,
        sesiones: sesionesCount
      });
      setLoading(false);
    }
    fetchStats();
  }, []);


  return (
    <section className="space-y-8 animate-fade-in">
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-midnight-700 via-midnight-800 to-slate-950 p-8 md:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-midnight-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-pink-500/5 blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-midnight-100 backdrop-blur-md">
            <Sparkles className="h-3 w.3" /> Módulo de Administración Activo
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            ¡Bienvenido de nuevo, {user?.nombres ?? 'Usuario'}!
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300 leading-relaxed">
            Esta es la consola de control de PMAP. Aquí puedes administrar los perfiles de usuario, organizar el plan de materias y coordinar las sesiones de estudio en tiempo real.
          </p>
        </div>
      </div>

      {/* Contadores Estadísticos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Usuarios */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-midnight-500/10 blur-2xl group-hover:bg-midnight-500/20 transition-all duration-300" />
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-midnight-500/10 p-3 text-midnight-300">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> En Línea
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-400">Total Usuarios</h3>
            <p className="mt-1 text-4xl font-bold text-white tracking-tight">
              {loading ? '...' : stats.usuarios}
            </p>
          </div>
        </div>

        {/* Materias */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl group-hover:bg-violet-500/20 transition-all duration-300" />
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-400">Materias Activas</h3>
            <p className="mt-1 text-4xl font-bold text-white tracking-tight">
              {loading ? '...' : stats.materias}
            </p>
          </div>
        </div>

        {/* Sesiones */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl group-hover:bg-pink-500/20 transition-all duration-300" />
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-300">
              <CalendarRange className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-400">Sesiones de Estudio</h3>
            <p className="mt-1 text-4xl font-bold text-white tracking-tight">
              {loading ? '...' : stats.sesiones}
            </p>
          </div>
        </div>
      </div>

      {/* Secciones de Explicación */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white tracking-wide">Acceso Rápido a los Módulos</h3>
        <p className="text-sm text-slate-400 mt-1">Utiliza el menú lateral para acceder a la gestión detallada de cada módulo:</p>
        
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
            <h4 className="font-semibold text-white">Módulo Usuarios</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">Permite gestionar el registro de nuevos integrantes, modificar roles (Administrador/Estudiante), suspender o activar perfiles y eliminar cuentas.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
            <h4 className="font-semibold text-white">Módulo Materias</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">Organiza el pensum académico. Registra nuevas asignaturas categorizadas por áreas de estudio, valida nombres únicos y desactiva materias inactivas.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
            <h4 className="font-semibold text-white">Sesiones de Estudio</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">Planifica el calendario de estudio vinculando alumnos con materias específicas, definiendo metas y realizando un seguimiento del estado de cada sesión.</p>
          </div>
        </div>
      </div>
    </section>
  );
}