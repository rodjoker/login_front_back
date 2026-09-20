// lib/session.ts - Guarda y lee el token JWT en el navegador.

const KEY = 'auth_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // Sin storage disponible (modo privado, bloqueado): la sesión no persistirá.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nada que limpiar.
  }
}