import { mockUsuarios, mockMaterias, mockSesiones } from './mockData';

/**
 * Helper para simular latencia de red.
 * Devuelve una promesa que se resuelve tras el tiempo especificado.
 * 
 * @param {number} ms - Milisegundos de espera
 * @returns {Promise<void>}
 */
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Cliente HTTP simulado (Mock HTTP Client)
 * 
 * Reemplaza la instancia de Axios real para resolver todas las llamadas a endpoints 
 * de la API localmente, leyendo y guardando datos en localStorage a través del módulo mockData.
 */
const http = {
  // Mock de interceptores de Axios para evitar errores en llamadas heredadas o imports antiguos
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },

  /**
   * Simula peticiones GET para obtener listados o registros individuales.
   * 
   * @param {string} url - URL del endpoint
   * @param {Object} config - Configuración de la petición (incluyendo query params en config.params)
   * @returns {Promise<{data: *}>}
   */
  async get(url, config = {}) {
    await delay();
    const params = config.params || {};

    // --- Endpoints de Usuarios ---
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

    // --- Endpoints de Materias ---
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

    // --- Endpoints de Sesiones ---
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

    throw new Error(`Mock HTTP GET: Endpoint ${url} no encontrado`);
  },

  /**
   * Simula peticiones POST para crear registros y autenticar usuarios.
   * 
   * @param {string} url - URL del endpoint
   * @param {Object} body - Payload con los datos de creación o login
   * @returns {Promise<{data: *}>}
   */
  async post(url, body) {
    await delay();

    // --- Autenticación: Login ---
    if (url === '/auth/login') {
      const list = mockUsuarios.getAll();
      const user = list.find(u => u.correo.toLowerCase() === body.correo.toLowerCase());
      
      if (!user) {
        const error = new Error('El usuario no existe.');
        error.response = { data: { message: 'El correo electrónico no está registrado.' } };
        throw error;
      }
      
      if (user.contraseña !== body.contraseña) {
        const error = new Error('Contraseña incorrecta.');
        error.response = { data: { message: 'La contraseña ingresada es incorrecta.' } };
        throw error;
      }

      if (user.estado === 'INACTIVO') {
        const error = new Error('Usuario inactivo.');
        error.response = { data: { message: 'Tu cuenta de usuario está INACTIVA. Contacta al administrador.' } };
        throw error;
      }

      return {
        data: {
          token: `mock-jwt-token-${user.id}`,
          usuario: user
        }
      };
    }

    // --- Autenticación: Registro ---
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

    // --- Creación de Usuario ---
    if (url === '/usuarios') {
      const newUser = mockUsuarios.create(body);
      return { data: newUser };
    }

    // --- Creación de Materia ---
    if (url === '/materias') {
      const newMateria = mockMaterias.create(body);
      return { data: newMateria };
    }

    // --- Creación de Sesión ---
    if (url === '/sesiones') {
      const newSesion = mockSesiones.create(body);
      return { data: newSesion };
    }

    throw new Error(`Mock HTTP POST: Endpoint ${url} no encontrado`);
  },

  /**
   * Simula peticiones PUT para actualización de registros y activaciones de estado.
   * 
   * @param {string} url - URL del endpoint
   * @param {Object} body - Payload con los datos a actualizar
   * @returns {Promise<{data: *}>}
   */
  async put(url, body) {
    await delay();

    // --- Edición de Usuarios y Estados ---
    if (url.startsWith('/usuarios/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      const action = parts[3]; // 'activate' o 'deactivate'

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

    // --- Edición de Materias y Estados ---
    if (url.startsWith('/materias/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      const action = parts[3]; // 'activate' o 'deactivate'

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

    // --- Edición de Sesiones ---
    if (url.startsWith('/sesiones/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      const updated = mockSesiones.update(id, body);
      return { data: updated };
    }

    throw new Error(`Mock HTTP PUT: Endpoint ${url} no encontrado`);
  },

  /**
   * Simula peticiones DELETE para remoción de registros de la base de datos local.
   * 
   * @param {string} url - URL del endpoint
   * @returns {Promise<{data: {success: boolean}}>}
   */
  async delete(url) {
    await delay();

    // --- Borrar Usuario ---
    if (url.startsWith('/usuarios/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      mockUsuarios.delete(id);
      return { data: { success: true } };
    }

    // --- Borrar Materia ---
    if (url.startsWith('/materias/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      mockMaterias.delete(id);
      return { data: { success: true } };
    }

    // --- Borrar Sesión ---
    if (url.startsWith('/sesiones/')) {
      const parts = url.split('/');
      const id = Number(parts[2]);
      mockSesiones.delete(id);
      return { data: { success: true } };
    }

    throw new Error(`Mock HTTP DELETE: Endpoint ${url} no encontrado`);
  }
};

export default http;