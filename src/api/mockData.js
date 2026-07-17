/**
 * @file mockData.js
 * @description Base de datos simulada en memoria y localStorage para el soporte de operaciones
 * CRUD autónomas sin requerir un backend activo ni bases de datos físicas.
 */

// Colección inicial de usuarios
const INITIAL_USUARIOS = [
  {
    id: 1,
    nombres: 'Diego',
    apellidos: 'Tique',
    correo: 'diego.tique@pmap.com',
    contraseña: '123456',
    rol: 'ADMINISTRADOR',
    estado: 'ACTIVO',
    fechaRegistro: [2026, 7, 16, 10, 0]
  },
  {
    id: 2,
    nombres: 'Ana',
    apellidos: 'Gómez',
    correo: 'ana.gomez@pmap.com',
    contraseña: '123456',
    rol: 'ESTUDIANTE',
    estado: 'ACTIVO',
    fechaRegistro: [2026, 7, 16, 11, 30]
  },
  {
    id: 3,
    nombres: 'Carlos',
    apellidos: 'Pérez',
    correo: 'carlos.perez@pmap.com',
    contraseña: '123456',
    rol: 'ESTUDIANTE',
    estado: 'ACTIVO',
    fechaRegistro: [2026, 7, 16, 12, 15]
  },
  {
    id: 4,
    nombres: 'Luisa',
    apellidos: 'Fernández',
    correo: 'luisa.f@pmap.com',
    contraseña: '123456',
    rol: 'ESTUDIANTE',
    estado: 'INACTIVO',
    fechaRegistro: [2026, 7, 15, 9, 0]
  }
];

// Colección inicial de materias
const INITIAL_MATERIAS = [
  {
    id: 1,
    nombre: 'Desarrollo de Software Web',
    descripcion: 'Clase de codificación de frontend y backend en JavaScript y Java.',
    categoria: 'Programación',
    estado: 'ACTIVA',
    fechaRegistro: [2026, 7, 16, 10, 0]
  },
  {
    id: 2,
    nombre: 'Bases de Datos Relacionales',
    descripcion: 'Modelado, normalización y consultas SQL utilizando PostgreSQL.',
    categoria: 'Bases de Datos',
    estado: 'ACTIVA',
    fechaRegistro: [2026, 7, 16, 10, 30]
  },
  {
    id: 3,
    nombre: 'Desarrollo de Aplicaciones Móviles',
    descripcion: 'Creación de aplicaciones nativas e híbridas usando React Native y SwiftUI.',
    categoria: 'Móvil',
    estado: 'ACTIVA',
    fechaRegistro: [2026, 7, 16, 11, 0]
  },
  {
    id: 4,
    nombre: 'Análisis y Diseño de Sistemas',
    descripcion: 'Metodologías ágiles, diagramas UML y modelado de requisitos.',
    categoria: 'Diseño',
    estado: 'INACTIVA',
    fechaRegistro: [2026, 7, 15, 14, 0]
  }
];

// Colección inicial de sesiones de estudio
const INITIAL_SESIONES = [
  {
    id: 1,
    usuarioId: 2,
    materiaId: 1,
    fecha: '2026-07-20',
    horaInicio: '08:00:00',
    horaFin: '10:00:00',
    objetivo: 'Comprender React Router y Hooks personalizados.',
    estado: 'PENDIENTE'
  },
  {
    id: 2,
    usuarioId: 3,
    materiaId: 2,
    fecha: '2026-07-21',
    horaInicio: '14:00:00',
    horaFin: '16:30:00',
    objetivo: 'Diseñar el esquema de base de datos para PMAP.',
    estado: 'EN_PROGRESO'
  },
  {
    id: 3,
    usuarioId: 2,
    materiaId: 3,
    fecha: '2026-07-22',
    horaInicio: '09:00:00',
    horaFin: '11:00:00',
    objetivo: 'Crear la interfaz de usuario en Swift.',
    estado: 'FINALIZADA'
  }
];

/**
 * Lee la información desde localStorage. Si no existe, inicializa con los valores por defecto.
 * 
 * @param {string} key - Clave de localStorage
 * @param {Array} fallback - Datos por defecto a inicializar
 * @returns {Array} Listado de datos parseados
 */
function getStoredData(key, fallback) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(data);
}

/**
 * Guarda los datos actualizados de una colección en localStorage.
 * 
 * @param {string} key - Clave de localStorage
 * @param {Array} data - Listado de datos a guardar
 */
function saveStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Inicializa las tablas simuladas en el almacenamiento del navegador.
 */
export function initMockDb() {
  getStoredData('pmap_mock_usuarios', INITIAL_USUARIOS);
  getStoredData('pmap_mock_materias', INITIAL_MATERIAS);
  getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
}

// Inicialización automática del script
initMockDb();

/**
 * Gestor simulado de base de datos para la colección de Usuarios.
 */
export const mockUsuarios = {
  /**
   * Obtiene todos los usuarios. Permite buscar por nombres, apellidos o correo.
   * @param {string} search - Filtro de búsqueda
   * @returns {Array<Object>} Listado de usuarios filtrados
   */
  getAll(search = '') {
    const list = getStoredData('pmap_mock_usuarios', INITIAL_USUARIOS);
    if (!search) return list;
    const cleanSearch = search.toLowerCase().trim();
    return list.filter(u => 
      u.nombres.toLowerCase().includes(cleanSearch) || 
      u.apellidos.toLowerCase().includes(cleanSearch) || 
      u.correo.toLowerCase().includes(cleanSearch)
    );
  },

  /**
   * Obtiene un usuario individual por su ID.
   * @param {number|string} id - ID del usuario
   * @returns {Object|null}
   */
  getById(id) {
    const list = getStoredData('pmap_mock_usuarios', INITIAL_USUARIOS);
    return list.find(u => u.id === Number(id)) || null;
  },

  /**
   * Crea un nuevo registro de usuario en el sistema.
   * @param {Object} data - Datos del usuario a crear
   * @returns {Object} Usuario creado
   */
  create(data) {
    const list = getStoredData('pmap_mock_usuarios', INITIAL_USUARIOS);
    const now = new Date();
    const newId = list.length > 0 ? Math.max(...list.map(u => u.id)) + 1 : 1;
    const newUser = {
      ...data,
      id: newId,
      estado: 'ACTIVO',
      fechaRegistro: [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()]
    };
    list.push(newUser);
    saveStoredData('pmap_mock_usuarios', list);
    return newUser;
  },

  /**
   * Modifica un usuario existente.
   * @param {number} id - ID del usuario a modificar
   * @param {Object} data - Campos a actualizar
   * @returns {Object} Usuario modificado
   */
  update(id, data) {
    const list = getStoredData('pmap_mock_usuarios', INITIAL_USUARIOS);
    const index = list.findIndex(u => u.id === Number(id));
    if (index === -1) throw new Error('Usuario no encontrado');
    
    const updated = {
      ...list[index],
      ...data,
      contraseña: data.contraseña || list[index].contraseña // Si viene vacía, no se sobreescribe
    };
    list[index] = updated;
    saveStoredData('pmap_mock_usuarios', list);
    return updated;
  },

  /**
   * Elimina un usuario por ID y remueve en cascada sus sesiones asociadas.
   * @param {number} id - ID del usuario a borrar
   * @returns {boolean}
   */
  delete(id) {
    let list = getStoredData('pmap_mock_usuarios', INITIAL_USUARIOS);
    list = list.filter(u => u.id !== Number(id));
    saveStoredData('pmap_mock_usuarios', list);
    
    // Eliminación en cascada en sesiones
    let sesiones = getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
    sesiones = sesiones.filter(s => s.usuarioId !== Number(id));
    saveStoredData('pmap_mock_sesiones', sesiones);
    return true;
  },

  /**
   * Activa o desactiva la cuenta de un usuario.
   * @param {number} id - ID del usuario
   * @param {boolean} activate - Nuevo estado (true para ACTIVO, false para INACTIVO)
   * @returns {Object} Usuario actualizado
   */
  toggleStatus(id, activate) {
    const list = getStoredData('pmap_mock_usuarios', INITIAL_USUARIOS);
    const index = list.findIndex(u => u.id === Number(id));
    if (index === -1) throw new Error('Usuario no encontrado');
    list[index].estado = activate ? 'ACTIVO' : 'INACTIVO';
    saveStoredData('pmap_mock_usuarios', list);
    return list[index];
  }
};

/**
 * Gestor simulado de base de datos para la colección de Materias.
 */
export const mockMaterias = {
  /**
   * Obtiene las materias disponibles con filtros opcionales de nombre y categoría.
   * @param {string} nombre - Filtro de nombre de materia
   * @param {string} categoria - Filtro de categoría
   * @returns {Array<Object>} Materias filtradas
   */
  getAll(nombre = '', categoria = '') {
    let list = getStoredData('pmap_mock_materias', INITIAL_MATERIAS);
    if (nombre) {
      const cleanNombre = nombre.toLowerCase().trim();
      list = list.filter(m => m.nombre.toLowerCase().includes(cleanNombre));
    }
    if (categoria) {
      const cleanCat = categoria.toLowerCase().trim();
      list = list.filter(m => m.categoria.toLowerCase() === cleanCat);
    }
    return list;
  },

  /**
   * Obtiene una materia por ID.
   * @param {number} id - ID de la materia
   * @returns {Object|null}
   */
  getById(id) {
    const list = getStoredData('pmap_mock_materias', INITIAL_MATERIAS);
    return list.find(m => m.id === Number(id)) || null;
  },

  /**
   * Crea una materia garantizando que el nombre sea único en el sistema.
   * @param {Object} data - Datos de la materia
   * @returns {Object} Materia creada
   */
  create(data) {
    const list = getStoredData('pmap_mock_materias', INITIAL_MATERIAS);
    const now = new Date();
    
    // Validación de unicidad de nombre de materia
    const exists = list.some(m => m.nombre.toLowerCase().trim() === data.nombre.toLowerCase().trim());
    if (exists) {
      const err = new Error('La materia ya se encuentra registrada.');
      err.response = { data: { message: 'La materia ya se encuentra registrada.' } };
      throw err;
    }

    const newId = list.length > 0 ? Math.max(...list.map(m => m.id)) + 1 : 1;
    const newMateria = {
      ...data,
      id: newId,
      estado: 'ACTIVA',
      fechaRegistro: [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()]
    };
    list.push(newMateria);
    saveStoredData('pmap_mock_materias', list);
    return newMateria;
  },

  /**
   * Modifica una materia y valida que el nuevo nombre no colisione con otra materia.
   * @param {number} id - ID de la materia a modificar
   * @param {Object} data - Campos a actualizar
   * @returns {Object} Materia modificada
   */
  update(id, data) {
    const list = getStoredData('pmap_mock_materias', INITIAL_MATERIAS);
    const index = list.findIndex(m => m.id === Number(id));
    if (index === -1) throw new Error('Materia no encontrada');
    
    const nameExists = list.some(m => m.id !== Number(id) && m.nombre.toLowerCase().trim() === data.nombre.toLowerCase().trim());
    if (nameExists) {
      const err = new Error('La materia ya se encuentra registrada.');
      err.response = { data: { message: 'La materia ya se encuentra registrada.' } };
      throw err;
    }

    const updated = {
      ...list[index],
      ...data
    };
    list[index] = updated;
    saveStoredData('pmap_mock_materias', list);
    return updated;
  },

  /**
   * Elimina una materia y remueve en cascada sus sesiones de estudio asociadas.
   * @param {number} id - ID de la materia
   * @returns {boolean}
   */
  delete(id) {
    let list = getStoredData('pmap_mock_materias', INITIAL_MATERIAS);
    list = list.filter(m => m.id !== Number(id));
    saveStoredData('pmap_mock_materias', list);
    
    // Eliminación en cascada en sesiones
    let sesiones = getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
    sesiones = sesiones.filter(s => s.materiaId !== Number(id));
    saveStoredData('pmap_mock_sesiones', sesiones);
    return true;
  },

  /**
   * Activa o desactiva la disponibilidad de una materia.
   * @param {number} id - ID de la materia
   * @param {boolean} activate - Nuevo estado (true para ACTIVA, false para INACTIVA)
   * @returns {Object} Materia actualizada
   */
  toggleStatus(id, activate) {
    const list = getStoredData('pmap_mock_materias', INITIAL_MATERIAS);
    const index = list.findIndex(m => m.id === Number(id));
    if (index === -1) throw new Error('Materia no encontrada');
    list[index].estado = activate ? 'ACTIVA' : 'INACTIVA';
    saveStoredData('pmap_mock_materias', list);
    return list[index];
  }
};

/**
 * Gestor simulado de base de datos para la colección de Sesiones de Estudio.
 */
export const mockSesiones = {
  /**
   * Obtiene todas las sesiones mapeando los IDs de usuario y materia a sus objetos completos relacionales.
   * @returns {Array<Object>} Listado de sesiones completas
   */
  getAll() {
    const list = getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
    
    // Resuelve relaciones a modo de "populate" o "join" de SQL
    return list.map(sesion => {
      const usuario = mockUsuarios.getById(sesion.usuarioId);
      const materia = mockMaterias.getById(sesion.materiaId);
      return {
        ...sesion,
        usuario,
        materia
      };
    });
  },

  /**
   * Obtiene una sesión por ID con sus objetos relacionales completos.
   * @param {number} id - ID de la sesión
   * @returns {Object|null}
   */
  getById(id) {
    const list = getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
    const sesion = list.find(s => s.id === Number(id)) || null;
    if (!sesion) return null;
    return {
      ...sesion,
      usuario: mockUsuarios.getById(sesion.usuarioId),
      materia: mockMaterias.getById(sesion.materiaId)
    };
  },

  /**
   * Registra una nueva sesión de estudio.
   * @param {Object} data - Datos de la sesión
   * @returns {Object} Sesión creada con objetos relacionales adjuntos
   */
  create(data) {
    const list = getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
    const newId = list.length > 0 ? Math.max(...list.map(s => s.id)) + 1 : 1;
    
    const newSesion = {
      id: newId,
      usuarioId: Number(data.usuarioId),
      materiaId: Number(data.materiaId),
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      objetivo: data.objetivo,
      estado: data.estado || 'PENDIENTE'
    };
    list.push(newSesion);
    saveStoredData('pmap_mock_sesiones', list);
    return {
      ...newSesion,
      usuario: mockUsuarios.getById(newSesion.usuarioId),
      materia: mockMaterias.getById(newSesion.materiaId)
    };
  },

  /**
   * Modifica los datos de una sesión programada.
   * @param {number} id - ID de la sesión
   * @param {Object} data - Campos a actualizar
   * @returns {Object} Sesión modificada
   */
  update(id, data) {
    const list = getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
    const index = list.findIndex(s => s.id === Number(id));
    if (index === -1) throw new Error('Sesión no encontrada');
    
    const updated = {
      ...list[index],
      usuarioId: Number(data.usuarioId),
      materiaId: Number(data.materiaId),
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      objetivo: data.objetivo,
      estado: data.estado
    };
    list[index] = updated;
    saveStoredData('pmap_mock_sesiones', list);
    return {
      ...updated,
      usuario: mockUsuarios.getById(updated.usuarioId),
      materia: mockMaterias.getById(updated.materiaId)
    };
  },

  /**
   * Elimina una sesión de estudio.
   * @param {number} id - ID de la sesión a borrar
   * @returns {boolean}
   */
  delete(id) {
    let list = getStoredData('pmap_mock_sesiones', INITIAL_SESIONES);
    list = list.filter(s => s.id !== Number(id));
    saveStoredData('pmap_mock_sesiones', list);
    return true;
  }
};
