import { getAdminToken, clearAdminToken } from './auth';

const API_URL = import.meta.env.API_URL ?? 'http://localhost:3333/api';

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAdminToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAdminToken();
    throw new ApiError('Sessão expirada. Faça login novamente.', 401);
  }

  if (!response.ok) {
    let message = 'Não foi possível concluir a operação.';
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        message = body.message.join(' ');
      } else if (typeof body.message === 'string') {
        message = body.message;
      }
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function uploadImage(file: File) {
  const body = new FormData();
  body.append('file', file);
  return api<{ key: string; url: string }>('/uploads/image', {
    method: 'POST',
    body,
  });
}
