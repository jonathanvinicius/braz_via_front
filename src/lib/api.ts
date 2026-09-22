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

async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message) && body.message.length > 0) {
      return body.message.join(' ');
    }
    if (typeof body.message === 'string' && body.message.trim()) {
      return body.message;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const isCredentialAuthPath =
    path.startsWith('/auth/login') || path.startsWith('/auth/complete-password');

  const token = getAdminToken();
  if (token && !isCredentialAuthPath) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    if (!isCredentialAuthPath) {
      clearAdminToken();
      window.dispatchEvent(new Event('brazvia:auth-cleared'));
    }

    const fallback =
      response.status === 403
        ? 'Acesso restrito a administradores.'
        : isCredentialAuthPath
          ? 'Credenciais inválidas.'
          : 'Sessão expirada. Faça login novamente.';

    const message = await readErrorMessage(response, fallback);
    throw new ApiError(message, response.status);
  }

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      'Não foi possível concluir a operação.',
    );
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
