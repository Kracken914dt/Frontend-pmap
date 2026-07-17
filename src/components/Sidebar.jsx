import { NavLink } from 'react-router-dom';
import { BookOpen, CalendarRange, LayoutDashboard, UserCircle, Users } from 'lucide-react';

const items = [
  { to: '/', label: 'Tablero Principal', icon: LayoutDashboard },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/materias', label: 'Materias', icon: BookOpen },
  { to: '/sesiones', label: 'Sesiones de Estudio', icon: CalendarRange },
  { to: '/perfil', label: 'Mi Perfil', icon: UserCircle }
];

export default function Sidebar() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                  isActive ? 'bg-midnight-500 text-white shadow-glow' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" /> {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}