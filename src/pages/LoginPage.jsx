import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import http from '../api/http';
import { setAuthSession } from '../utils/storage';
import { Sparkles, User, Shield } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { correo: '', contraseña: '' }
  });


  async function onSubmit(values) {
    try {
      if (isRegistering) {
        // Register flow
        const { data } = await http.post('/auth/register', {
          ...values,
          rol: values.rol || 'ESTUDIANTE'
        });
        setAuthSession(data.token, data.usuario);
        Swal.fire('¡Registro exitoso!', 'Tu cuenta ha sido creada y has iniciado sesión.', 'success');
        navigate('/');
      } else {
        // Login flow
        const { data } = await http.post('/auth/login', {
          correo: values.correo,
          contraseña: values.contraseña
        });
        setAuthSession(data.token, data.usuario);
        navigate('/');
      }
    } catch (error) {
      console.error('Error en autenticación', error);
      const title = isRegistering ? 'Error de registro' : 'Error de autenticación';
      const msg = error.response?.data?.message || (isRegistering 
        ? 'No se pudo completar el registro. Verifica los datos o si el correo ya existe.'
        : 'Credenciales incorrectas o el servidor backend no responde.');
      Swal.fire(title, msg, 'error');
    }
  }

  function handleToggleMode() {
    setIsRegistering(!isRegistering);
    reset({
      nombres: '',
      apellidos: '',
      correo: '',
      contraseña: '',
      rol: 'ESTUDIANTE'
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-slate-950/20 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-white/20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-midnight-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-midnight-300">
            <Sparkles className="h-3 w-3 animate-pulse" /> PMAP
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isRegistering ? 'Únete a la plataforma de aprendizaje PMAP' : 'Accede al Panel de Módulos del Software'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          {isRegistering && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Nombres
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition text-sm"
                  placeholder="Juan"
                  type="text"
                  {...register('nombres', { required: isRegistering })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Apellidos
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-midnight-500 focus:bg-white/10 transition text-sm"
                  placeholder="Pérez"
                  type="text"
                  {...register('apellidos', { required: isRegistering })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Correo Electrónico
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-midnight-500 focus:bg-white/10 transition text-sm"
              placeholder="correo@ejemplo.com"
              type="email"
              {...register('correo', { required: true })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Contraseña
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-midnight-500 focus:bg-white/10 transition text-sm"
              placeholder="••••••••"
              type="password"
              {...register('contraseña', { required: true, minLength: 6 })}
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Rol
              </label>
              <select
                {...register('rol', { required: isRegistering })}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-midnight-500 transition text-sm"
              >
                <option value="ESTUDIANTE">ESTUDIANTE</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-2xl bg-midnight-600 py-3.5 font-semibold text-white transition-all hover:bg-midnight-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-midnight-500/20 text-sm"
          >
            {isSubmitting 
              ? (isRegistering ? 'Creando cuenta...' : 'Iniciando sesión...') 
              : (isRegistering ? 'Registrarse' : 'Ingresar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleToggleMode}
            className="text-xs font-medium text-midnight-300 hover:text-midnight-200 transition"
          >
            {isRegistering 
              ? '¿Ya tienes una cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}
