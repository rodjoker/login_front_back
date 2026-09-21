// lib/api.ts - Cliente para hablar con el backend Express.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// Error con el código HTTP: permite distinguir un 423 (bloqueada) de un 401.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

// El backend siempre responde { success, message, data }. Esta función
// devuelve solo `data`, o lanza ApiError con el `message` del backend.
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(json?.message ?? 'Error inesperado del servidor', res.status);
  }
  return json.data as T;
}