import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import http from '../api/http';
import Loader from '../components/Loader';
import { Search, Calendar, Plus, Edit2, Trash2, Clock, Goal, X, User, BookOpen } from 'lucide-react';

function formatTime(timeVal) {
  if (!timeVal) return '';
  if (Array.isArray(timeVal)) {
    const hours = String(timeVal[0]).padStart(2, '0');
    const minutes = String(timeVal[1]).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  if (typeof timeVal === 'string') {
    return timeVal.slice(0, 5);
  }
  return String(timeVal);
}

function formatDateForInput(dateVal) {
  if (!dateVal) return '';
  if (Array.isArray(dateVal)) {
    const year = dateVal[0];
    const month = String(dateVal[1]).padStart(2, '0');
    const day = String(dateVal[2]).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (typeof dateVal === 'string') {
    return dateVal;
  }
  return String(dateVal);
}

function formatDateForDisplay(dateVal) {
  if (!dateVal) return '';
  let dateStr = '';
  if (Array.isArray(dateVal)) {
    const year = dateVal[0];
    const month = String(dateVal[1]).padStart(2, '0');
    const day = String(dateVal[2]).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  } else if (typeof dateVal === 'string') {
    dateStr = dateVal;
  }
  
  if (dateStr) {
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return '';
}

export default function SesionesPage() {
  const [sesiones, setSesiones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);

  // Filters state
  const [usuarioFilter, setUsuarioFilter] = useState('');
  const [materiaFilter, setMateriaFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSesion, setEditingSesion] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Load all required data
  async function loadData() {
    setLoading(true);
    try {
      const [sesionesRes, usuariosRes, materiasRes] = await Promise.all([
        http.get('/sesiones'),
        http.get('/usuarios'),
        http.get('/materias')
      ]);
      setSesiones(sesionesRes.data);
      // Filter only active users and active subjects for selection
      setUsuarios(usuariosRes.data.filter(u => u.estado === 'ACTIVO'));
      setMaterias(materiasRes.data.filter(m => m.estado === 'ACTIVA'));
    } catch (error) {
      console.error('Error al cargar datos de sesiones de estudio', error);
      Swal.fire('Error', 'No se pudieron obtener los datos necesarios del servidor.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Open modal for creation
  function handleCreateOpen() {
    setEditingSesion(null);
    reset({
      usuarioId: '',
      materiaId: '',
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: '08:00',
      horaFin: '10:00',
      objetivo: '',
      estado: 'PENDIENTE'
    });
    setModalOpen(true);
  }

  // Open modal for editing
  function handleEditOpen(sesion) {
    setEditingSesion(sesion);
    reset({
      usuarioId: sesion.usuario?.id,
      materiaId: sesion.materia?.id,
      fecha: formatDateForInput(sesion.fecha),
      horaInicio: formatTime(sesion.horaInicio),
      horaFin: formatTime(sesion.horaFin),
      objetivo: sesion.objetivo,
      estado: sesion.estado
    });
    setModalOpen(true);
  }

  // Save session (Create or Update)
  async function onSubmit(values) {
    // Validate that end time is after start time
    if (values.horaInicio >= values.horaFin) {
      Swal.fire('Horario inválido', 'La hora de fin debe ser posterior a la hora de inicio.', 'warning');
      return;
    }

    // Prepare body: converting IDs to Numbers
    const body = {
      usuarioId: Number(values.usuarioId),
      materiaId: Number(values.materiaId),
      fecha: values.fecha,
      horaInicio: values.horaInicio.length === 5 ? `${values.horaInicio}:00` : values.horaInicio,
      horaFin: values.horaFin.length === 5 ? `${values.horaFin}:00` : values.horaFin,
      objetivo: values.objetivo,
      estado: values.estado
    };

    try {
      if (editingSesion) {
        await http.put(`/sesiones/${editingSesion.id}`, body);
        Swal.fire('¡Actualizada!', 'La sesión de estudio ha sido modificada con éxito.', 'success');
      } else {
        await http.post('/sesiones', body);
        Swal.fire('¡Programada!', 'La sesión de estudio ha sido creada con éxito.', 'success');
      }
      setModalOpen(false);
      // Reload sessions list
      const sesionesRes = await http.get('/sesiones');
      setSesiones(sesionesRes.data);
    } catch (error) {
      console.error('Error al guardar la sesión de estudio', error);
      const errMsg = error.response?.data?.message || 'Ocurrió un error al intentar guardar la sesión.';
      Swal.fire('Error', errMsg, 'error');
    }
  }

  // Delete session
  async function handleDelete(id) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer y cancelará/eliminará permanentemente la sesión!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await http.delete(`/sesiones/${id}`);
        Swal.fire('¡Eliminada!', 'La sesión de estudio ha sido eliminada.', 'success');
        const sesionesRes = await http.get('/sesiones');
        setSesiones(sesionesRes.data);
      } catch (error) {
        console.error('Error al eliminar sesión de estudio', error);
        Swal.fire('Error', 'No se pudo eliminar la sesión.', 'error');
      }
    }
  }

  // Clear filters
  function handleClearFilters() {
    setUsuarioFilter('');
    setMateriaFilter('');
    setEstadoFilter('');
  }

  // In-memory combined filtering
  const filteredSesiones = sesiones.filter((sesion) => {
    const matchesUser = usuarioFilter ? sesion.usuario?.id === Number(usuarioFilter) : true;
    const matchesMateria = materiaFilter ? sesion.materia?.id === Number(materiaFilter) : true;
    const matchesEstado = estadoFilter ? sesion.estado === estadoFilter : true;
    return matchesUser && matchesMateria && matchesEstado;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Sesiones de Estudio</h2>
          <p className="text-sm text-slate-400">Planifica y haz seguimiento a las clases y tutorías de los estudiantes.</p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-2xl bg-midnight-600 px-5 py-3 font-semibold text-white transition hover:bg-midnight-500 active:scale-95 shadow-lg shadow-midnight-500/20"
        >
          <Plus className="h-5 w-5" /> Programar Sesión
        </button>
      </div>

      {/* Panel de Filtros Combinados */}
      <div className="grid gap-4 sm:grid-cols-12 bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md">
        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
            Filtrar por Estudiante
          </label>
          <select
            value={usuarioFilter}
            onChange={(e) => setUsuarioFilter(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
          >
            <option value="">Todos los estudiantes</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
            Filtrar por Materia
          </label>
          <select
            value={materiaFilter}
            onChange={(e) => setMateriaFilter(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
          >
            <option value="">Todas las materias</option>
            {materias.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
            Filtrar por Estado
          </label>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PROGRESO">EN PROGRESO</option>
            <option value="FINALIZADA">FINALIZADA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-end">
          {(usuarioFilter || materiaFilter || estadoFilter) && (
            <button
              onClick={handleClearFilters}
              className="w-full rounded-2xl border border-white/10 hover:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Listado */}
      {loading && sesiones.length === 0 ? (
        <Loader />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-white/5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Estudiante</th>
                  <th className="px-6 py-4">Materia</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Horario</th>
                  <th className="px-6 py-4">Objetivo</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSesiones.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                      No se encontraron sesiones de estudio programadas.
                    </td>
                  </tr>
                ) : (
                  filteredSesiones.map((sesion) => (
                    <tr key={sesion.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-midnight-500/10 p-2 text-midnight-300">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {sesion.usuario?.nombres} {sesion.usuario?.apellidos}
                            </div>
                            <div className="text-xs text-slate-400">{sesion.usuario?.correo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-violet-400" />
                          <span className="font-medium text-white">{sesion.materia?.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {formatDateForDisplay(sesion.fecha)}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatTime(sesion.horaInicio)} - {formatTime(sesion.horaFin)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={sesion.objetivo}>
                        {sesion.objetivo}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            sesion.estado === 'FINALIZADA'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : sesion.estado === 'PENDIENTE'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : sesion.estado === 'EN_PROGRESO'
                              ? 'bg-midnight-500/10 text-midnight-300 border-midnight-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {sesion.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditOpen(sesion)}
                            title="Editar Sesión"
                            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(sesion.id)}
                            title="Eliminar Sesión"
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Registro / Edición */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {editingSesion ? 'Editar Sesión de Estudio' : 'Programar Sesión de Estudio'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {editingSesion ? 'Modifica los detalles del cronograma de estudio.' : 'Planifica una nueva sesión de aprendizaje.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Estudiante
                </label>
                <select
                  {...register('usuarioId', { required: true })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                >
                  <option value="">Selecciona un estudiante...</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombres} {u.apellidos} ({u.correo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Materia / Asignatura
                </label>
                <select
                  {...register('materiaId', { required: true })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                >
                  <option value="">Selecciona una materia...</option>
                  {materias.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre} - {m.categoria}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 grid-cols-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    {...register('fecha', { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    {...register('horaInicio', { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    {...register('horaFin', { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Objetivo del Estudio
                </label>
                <textarea
                  {...register('objetivo', { required: true })}
                  rows="3"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition resize-none"
                  placeholder="Ej. Repasar temas teóricos para examen final, resolver taller de integrales..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Estado de la Sesión
                </label>
                <select
                  {...register('estado', { required: true })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="EN_PROGRESO">EN PROGRESO</option>
                  <option value="FINALIZADA">FINALIZADA</option>
                  <option value="CANCELADA">CANCELADA</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-midnight-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-midnight-500 transition"
                >
                  {editingSesion ? 'Guardar Cambios' : 'Programar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}