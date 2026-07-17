import { mockUsuarios, mockMaterias, mockSesiones } from './mockData';

// Helper to simulate network latency
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

const http = {
  // Mock interceptors to prevent errors in any external usage
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },

  async get(url, config = {}) {
    await delay();
    const params = config.params || {};

    // 1. Usuarios
    if (url === '/usuarios') {
      const data = mockUsuarios.getAll(params.search);
      return { data };
    }
    if (url.startsWith('/usuarios/')) {
      const parts = url.split('/');
      const id = parts[2];
      const data = mockUsuarios.getById(id);
      return { data };
    }

    // 2. Materias
    if (url === '/materias') {
      const data = mockMaterias.getAll(params.nombre, params.categoria);
      return { data };
    }
    if (url.startsWith('/materias/')) {
      const parts = url.split('/');
      const id = parts[2];
      const data = mockMaterias.getById(id);
      return { data };
    }

    // 3. Sesiones
    if (url === '/sesiones') {
      const data = mockSesiones.getAll();
      return { data };
    }
    if (url.startsWith('/sesiones/')) {
      const parts = url.split('/');
      const id = parts[2];
      const data = mockSesiones.getById(id);
      return { data };
    }

    throw new Error(`Mock HTTP GET: Endpoint ${url} not found`);
  },

  async post(url, body) {
    await delay();

    // 1. Auth Login
    if (url === '/auth/login') {
      const list = mockUsuarios.getAll();
      // Try to find matching user by email
      const user = list.find(u => u.correo.toLowerCase() === body.correo.toLowerCase());
      
      if (!user) {
        const error = new Error('El usuario no existe.');
        error.response = { data: { message: 'El usuario con ese correo no está registrado.' } };
        throw error;
      }
      
      if (user.contraseña !== body.contraseña) {
        const error = new Error('Credenciales incorrectas.');
        error.response = { data: { message: 'La contraseña ingresada es incorrecta.' } };
        throw error;
      }

      if (user.estado === 'INACTIVO') {
        const error = new Error('Usuario inactivo.');
        error.response = { data: { message: 'Esta cuenta está inactiva. Contacta al administrador.' } };
        throw error;
      }

      return {
        data: {
          token: `mock-jwt-token-${user.id}`,
          usuario: user
        }
      };
    }

    // 2. Auth Register
    if (url === '/auth/register') {
      const list = mockUsuarios.getAll();
      const exists = list.some(u => u.correo.toLowerCase() === body.correo.toLowerCase());
      if (exists) {
        const error = new Error('El correo ya existe.');
        error.response = { data: { message: 'El correo electrónico ya está registrado.' } };
        throw error;
      }

      const newUser = mockUsuarios.create({
        nombres: body.nombres,
        apellidos: body.apellidos,
        correo: body.correo,
        contraseña: body.contraseña,
        rol: body.rol || 'ESTUDIANTE'
      });

      return {
        data: {
          token: `mock-jwt-token-${newUser.id}`,
          usuario: newUser
        }
      };
    }

    // 3. Usuarios CRUD
    if (url === '/usuarios') {
      const newUser = mockUsuarios.create(body);
      return { data: newUser };
    }

    // 4. Materias CRUD
    if (url === '/materias') {
      const newMateria = mockMaterias.create(body);
      return { data: newMateria };
    }

    // 5. Sesiones CRUD
    if (url === '/sesiones') {
      const newSesion = mockSesiones.create(body);
      return { data: newSesion };
    }

    throw new Error(`Mock HTTP POST: Endpoint ${url} not found`);
  },

  async put(url, body) {
    await delay();

    // 1. Usuarios
    if (url.startsWith('/usuarios/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      const action = parts[3]; // 'activate' or 'deactivate' or undefined

      if (action === 'activate') {
        const updated = mockUsuarios.toggleStatus(id, true);
        return { data: updated };
      }
      if (action === 'deactivate') {
        const updated = mockUsuarios.toggleStatus(id, false);
        return { data: updated };
      }
      
      const updated = mockUsuarios.update(id, body);
      return { data: updated };
    }

    // 2. Materias
    if (url.startsWith('/materias/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      const action = parts[3]; // 'activate' or 'deactivate' or undefined

      if (action === 'activate') {
        const updated = mockMaterias.toggleStatus(id, true);
        return { data: updated };
      }
      if (action === 'deactivate') {
        const updated = mockMaterias.toggleStatus(id, false);
        return { data: updated };
      }

      const updated = mockMaterias.update(id, body);
      return { data: updated };
    }

    // 3. Sesiones
    if (url.startsWith('/sesiones/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      const updated = mockSesiones.update(id, body);
      return { data: updated };
    }

    throw new Error(`Mock HTTP PUT: Endpoint ${url} not found`);
  },

  async delete(url) {
    await delay();

    // 1. Usuarios
    if (url.startsWith('/usuarios/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      mockUsuarios.delete(id);
      return { data: { success: true } };
    }

    // 2. Materias
    if (url.startsWith('/materias/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      mockMaterias.delete(id);
      return { data: { success: true } };
    }

    // 3. Sesiones
    if (url.startsWith('/sesiones/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      mockSesiones.delete(id);
      return { data: { success: true } };
    }

    throw new Error(`Mock HTTP DELETE: Endpoint ${url} not found`);
  }
};

export default http;