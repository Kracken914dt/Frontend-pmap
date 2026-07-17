/**
 * Obtiene el usuario actualmente autenticado desde localStorage.
 * Si no existe una sesión guardada, devuelve un usuario administrador por defecto
 * para evitar que las interfaces de la aplicación queden vacías o arrojen excepciones.
 * 
 * @returns {Object} Datos del usuario
 */
export function getAuthUser() {
  const rawUser = localStorage.getItem('pmap_user');
  if (!rawUser) {
    // Retorno por defecto de un perfil administrador para fines demostrativos
    return {
      id: 1,
      nombres: 'Diego',
      apellidos: 'Tique',
      correo: 'diego.tique@pmap.com',
      rol: 'ADMINISTRADOR',
      estado: 'ACTIVO',
      fechaRegistro: [2026, 7, 16, 10, 0]
    };
  }
  return JSON.parse(rawUser);
}

/**
 * Obtiene el token de autenticación del usuario actual desde localStorage.
 * Si no está definido, provee un token simulado por defecto.
 * 
 * @returns {string} Token JWT
 */
export function getAuthToken() {
  return localStorage.getItem('pmap_token') || 'mock-jwt-token-1';
}

/**
 * Guarda las credenciales de la sesión autenticada en localStorage.
 * 
 * @param {string} token - El token JWT generado
 * @param {Object} user - Los datos del perfil del usuario
 */
export function setAuthSession(token, user) {
  localStorage.setItem('pmap_token', token);
  localStorage.setItem('pmap_user', JSON.stringify(user));
}

/**
 * Elimina las credenciales de la sesión activa en localStorage (Cierre de sesión).
 */
export function clearAuthSession() {
  localStorage.removeItem('pmap_token');
  localStorage.removeItem('pmap_user');
}