export function getAuthUser() {
  const rawUser = localStorage.getItem('pmap_user');
  if (!rawUser) {
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

export function getAuthToken() {
  return localStorage.getItem('pmap_token') || 'mock-jwt-token-1';
}

export function setAuthSession(token, user) {
  localStorage.setItem('pmap_token', token);
  localStorage.setItem('pmap_user', JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem('pmap_token');
  localStorage.removeItem('pmap_user');
}