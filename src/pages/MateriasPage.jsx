import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import http from '../api/http';
import Loader from '../components/Loader';
import { Search, Plus, Edit2, Trash2, BookOpen, ToggleLeft, ToggleRight, X, Filter } from 'lucide-react';

function formatDateTime(dateTimeVal) {
  if (!dateTimeVal) return '';
  let dateStr = '';
  if (Array.isArray(dateTimeVal)) {
    const year = dateTimeVal[0];
    const month = String(dateTimeVal[1]).padStart(2, '0');
    const day = String(dateTimeVal[2]).padStart(2, '0');
    const hours = String(dateTimeVal[3] ?? 0).padStart(2, '0');
    const minutes = String(dateTimeVal[4] ?? 0).padStart(2, '0');
    dateStr = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  } else if (typeof dateTimeVal === 'string') {
    dateStr = dateTimeVal;
  } else {
    dateStr = String(dateTimeVal);
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function MateriasPage() {
  const [materias, setMaterias] = useState([]);
  const [nombreSearch, setNombreSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [categoriasList, setCategoriasList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Load materias
  async function fetchMaterias(nameQuery = '', categoryQuery = '') {
    setLoading(true);
    try {
      let params = {};
      if (nameQuery) {
        params.nombre = nameQuery;
      } else if (categoryQuery) {
        params.categoria = categoryQuery;
      }

      const { data } = await http.get('/materias', { params });
      setMaterias(data);

      // Extract unique categories for filter dropdown on initial load or general load
      if (!nameQuery && !categoryQuery) {
        const uniqueCategories = [...new Set(data.map(m => m.categoria))];
        setCategoriasList(uniqueCategories);
      }
    } catch (error) {
      console.error('Error cargando materias', error);
      Swal.fire('Error', 'No se pudieron cargar las materias del servidor.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMaterias(nombreSearch, categoriaFilter);
  }, [nombreSearch, categoriaFilter]);

  // Open modal for creation
  function handleCreateOpen() {
    setEditingMateria(null);
    reset({
      nombre: '',
      descripcion: '',
      categoria: ''
    });
    setModalOpen(true);
  }

  // Open modal for editing
  function handleEditOpen(materia) {
    setEditingMateria(materia);
    reset({
      nombre: materia.nombre,
      descripcion: materia.descripcion,
      categoria: materia.categoria,
      estado: materia.estado
    });
    setModalOpen(true);
  }

  // Save (Create or Update)
  async function onSubmit(values) {
    try {
      if (editingMateria) {
        await http.put(`/materias/${editingMateria.id}`, values);
        Swal.fire('¡Actualizada!', 'La materia ha sido modificada con éxito.', 'success');
      } else {
        await http.post('/materias', values);
        Swal.fire('¡Creada!', 'La materia ha sido registrada con éxito.', 'success');
      }
      setModalOpen(false);
      fetchMaterias(nombreSearch, categoriaFilter);
    } catch (error) {
      console.error('Error al guardar materia', error);
      const errMsg = error.response?.data?.message || 'Ocurrió un error inesperado al procesar la solicitud.';
      Swal.fire('Error al guardar', errMsg, 'error');
    }
  }

  // Toggle activation status
  async function handleToggleStatus(materia) {
    const isActivating = materia.estado === 'INACTIVA';
    const endpoint = `/materias/${materia.id}/${isActivating ? 'activate' : 'deactivate'}`;
    const actionText = isActivating ? 'activar' : 'desactivar';

    try {
      await http.put(endpoint);
      Swal.fire(
        isActivating ? '¡Activada!' : '¡Desactivada!',
        `La materia ha sido ${isActivating ? 'activada' : 'desactivada'} con éxito.`,
        'success'
      );
      fetchMaterias(nombreSearch, categoriaFilter);
    } catch (error) {
      console.error(`Error al ${actionText} materia`, error);
      Swal.fire('Error', `No se pudo cambiar el estado de la materia.`, 'error');
    }
  }

  // Delete materia
  async function handleDelete(id) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer y eliminará permanentemente la materia del sistema!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await http.delete(`/materias/${id}`);
        Swal.fire('¡Eliminada!', 'La materia ha sido eliminada del sistema.', 'success');
        fetchMaterias(nombreSearch, categoriaFilter);
      } catch (error) {
        console.error('Error al eliminar materia', error);
        Swal.fire('Error', 'No se pudo eliminar la materia.', 'error');
      }
    }
  }

  // Clear all filters
  function handleClearFilters() {
    setNombreSearch('');
    setCategoriaFilter('');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Gestión de Materias</h2>
          <p className="text-sm text-slate-400">Administra las materias y asignaturas disponibles para estudio.</p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-2xl bg-midnight-600 px-5 py-3 font-semibold text-white transition hover:bg-midnight-500 active:scale-95 shadow-lg shadow-midnight-500/20"
        >
          <Plus className="h-5 w-5" /> Nueva Materia
        </button>
      </div>

      {/* Buscadores y Filtros */}
      <div className="grid gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            value={nombreSearch}
            onChange={(e) => {
              setNombreSearch(e.target.value);
              setCategoriaFilter(''); // clear category filter if searching by name
            }}
            placeholder="Buscar por nombre de materia..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-midnight-500 focus:bg-white/10 transition"
          />
        </div>

        <div className="relative sm:col-span-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Filter className="h-5 w-5" />
          </span>
          <select
            value={categoriaFilter}
            onChange={(e) => {
              setCategoriaFilter(e.target.value);
              setNombreSearch(''); // clear search by name if filtering by category
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 py-3.5 pl-12 pr-4 text-white outline-none focus:border-midnight-500 transition appearance-none"
          >
            <option value="">Todas las Categorías</option>
            {categoriasList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {(nombreSearch || categoriaFilter) && (
          <button
            onClick={handleClearFilters}
            className="sm:col-span-2 rounded-2xl border border-white/10 hover:bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-300 transition"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Listado */}
      {loading && materias.length === 0 ? (
        <Loader />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-white/5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Materia</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Fecha de Creación</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {materias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      No se encontraron materias registradas.
                    </td>
                  </tr>
                ) : (
                  materias.map((materia) => (
                    <tr key={materia.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-midnight-500/10 p-2.5 text-midnight-300">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div className="font-semibold text-white">{materia.nombre}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate" title={materia.descripcion}>
                        {materia.descripcion}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {materia.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            materia.estado === 'ACTIVA'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {materia.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDateTime(materia.fechaCreacion)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(materia)}
                            title={materia.estado === 'ACTIVA' ? 'Desactivar Materia' : 'Activar Materia'}
                            className={`p-2 rounded-xl transition ${
                              materia.estado === 'ACTIVA'
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-rose-400 hover:bg-rose-500/10'
                            }`}
                          >
                            {materia.estado === 'ACTIVA' ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditOpen(materia)}
                            title="Editar Materia"
                            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(materia.id)}
                            title="Eliminar Materia"
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
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {editingMateria ? 'Editar Materia' : 'Nueva Materia'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {editingMateria ? 'Modifica los detalles de la asignatura.' : 'Crea una nueva asignatura de estudio.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Nombre de la Materia
                </label>
                <input
                  type="text"
                  {...register('nombre', { required: true })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition"
                  placeholder="Ej. Programación Avanzada, Cálculo II..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  {...register('categoria', { required: true })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition"
                  placeholder="Ej. Tecnología, Ciencias, Idiomas, Humanidades..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Descripción
                </label>
                <textarea
                  {...register('descripcion', { required: true })}
                  rows="3"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition resize-none"
                  placeholder="Describe brevemente el contenido de esta materia..."
                />
              </div>

              {editingMateria && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Estado
                  </label>
                  <select
                    {...register('estado', { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                  >
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="INACTIVA">INACTIVA</option>
                  </select>
                </div>
              )}

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
                  {editingMateria ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}