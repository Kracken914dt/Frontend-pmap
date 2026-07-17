import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import http from '../api/http';
import Loader from '../components/Loader';
import { Search, UserPlus, Edit2, Trash2, Shield, User, ToggleLeft, ToggleRight, X } from 'lucide-react';

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

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  // Load users
  async function fetchUsuarios(query = '') {
    setLoading(true);
    try {
      const { data } = await http.get('/usuarios', {
        params: query ? { search: query } : {}
      });
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios', error);
      Swal.fire('Error', 'No se pudieron cargar los usuarios del servidor.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsuarios(search);
  }, [search]);

  // Open modal for creation
  function handleCreateOpen() {
    setEditingUser(null);
    reset({
      nombres: '',
      apellidos: '',
      correo: '',
      contraseña: '',
      rol: 'ESTUDIANTE'
    });
    setModalOpen(true);
  }

  // Open modal for editing
  function handleEditOpen(user) {
    setEditingUser(user);
    reset({
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      contraseña: '', // empty by default
      rol: user.rol,
      estado: user.estado
    });
    setModalOpen(true);
  }

  // Save (Create or Update)
  async function onSubmit(values) {
    try {
      if (editingUser) {
        // Update request has: nombres, apellidos, correo, contraseña, rol, estado
        await http.put(`/usuarios/${editingUser.id}`, {
          ...values,
          contraseña: values.contraseña || null
        });
        Swal.fire('¡Actualizado!', 'El usuario ha sido modificado con éxito.', 'success');
      } else {
        // Create request has: nombres, apellidos, correo, contraseña, rol
        await http.post('/usuarios', values);
        Swal.fire('¡Creado!', 'El usuario ha sido registrado con éxito.', 'success');
      }
      setModalOpen(false);
      fetchUsuarios(search);
    } catch (error) {
      console.error('Error al guardar usuario', error);
      const errMsg = error.response?.data?.message || 'Ocurrió un error inesperado al procesar la solicitud.';
      Swal.fire('Error al guardar', errMsg, 'error');
    }
  }

  // Toggle activation status
  async function handleToggleStatus(user) {
    const isActivating = user.estado === 'INACTIVO';
    const endpoint = `/usuarios/${user.id}/${isActivating ? 'activate' : 'deactivate'}`;
    const actionText = isActivating ? 'activar' : 'desactivar';

    try {
      await http.put(endpoint);
      Swal.fire(
        isActivating ? '¡Activado!' : '¡Desactivado!',
        `El usuario ha sido ${isActivating ? 'activado' : 'desactivado'} con éxito.`,
        'success'
      );
      fetchUsuarios(search);
    } catch (error) {
      console.error(`Error al ${actionText} usuario`, error);
      Swal.fire('Error', `No se pudo cambiar el estado del usuario.`, 'error');
    }
  }

  // Delete user
  async function handleDelete(id) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer y eliminará permanentemente al usuario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await http.delete(`/usuarios/${id}`);
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado del sistema.', 'success');
        fetchUsuarios(search);
      } catch (error) {
        console.error('Error al eliminar usuario', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Gestión de Usuarios</h2>
          <p className="text-sm text-slate-400">Registra y controla el acceso de administradores y estudiantes.</p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-2xl bg-midnight-600 px-5 py-3 font-semibold text-white transition hover:bg-midnight-500 active:scale-95 shadow-lg shadow-midnight-500/20"
        >
          <UserPlus className="h-5 w-5" /> Registrar Usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar usuarios por nombre, apellido o correo electrónico..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-midnight-500 focus:bg-white/10 transition"
        />
      </div>

      {/* Listado */}
      {loading && usuarios.length === 0 ? (
        <Loader />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-white/5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Correo</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Fecha de Registro</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      No se encontraron usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          {usuario.nombres} {usuario.apellidos}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{usuario.correo}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            usuario.rol === 'ADMINISTRADOR'
                              ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                              : 'bg-midnight-500/10 text-midnight-300 border border-midnight-500/20'
                          }`}
                        >
                          {usuario.rol === 'ADMINISTRADOR' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            usuario.estado === 'ACTIVO'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {usuario.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDateTime(usuario.fechaRegistro)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(usuario)}
                            title={usuario.estado === 'ACTIVO' ? 'Desactivar Usuario' : 'Activar Usuario'}
                            className={`p-2 rounded-xl transition ${
                              usuario.estado === 'ACTIVO'
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-rose-400 hover:bg-rose-500/10'
                            }`}
                          >
                            {usuario.estado === 'ACTIVO' ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditOpen(usuario)}
                            title="Editar Usuario"
                            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(usuario.id)}
                            title="Eliminar Usuario"
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
              {editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {editingUser ? 'Modifica los datos del usuario en el sistema.' : 'Crea una nueva cuenta de acceso.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Nombres
                  </label>
                  <input
                    type="text"
                    {...register('nombres', { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    {...register('apellidos', { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  {...register('correo', { required: true })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Contraseña {editingUser && <span className="text-[10px] text-slate-500 font-normal lowercase">(dejar en blanco para mantener la actual)</span>}
                </label>
                <input
                  type="password"
                  {...register('contraseña', { required: !editingUser })}
                  placeholder={editingUser ? '••••••••' : ''}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Rol
                  </label>
                  <select
                    {...register('rol', { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                  >
                    <option value="ESTUDIANTE">ESTUDIANTE</option>
                    <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                  </select>
                </div>

                {editingUser && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Estado
                    </label>
                    <select
                      {...register('estado', { required: true })}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-midnight-500 transition"
                    >
                      <option value="ACTIVO">ACTIVO</option>
                      <option value="INACTIVO">INACTIVO</option>
                    </select>
                  </div>
                )}
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
                  {editingUser ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}