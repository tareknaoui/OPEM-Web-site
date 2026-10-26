import { env } from './env';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  timeoutMs?: number;
  /** Autre API que VITE_API_URL (ex. WordPress). Doit venir de la configuration, jamais de l'utilisateur. */
  baseUrl?: string;
};

/**
 * Petit client HTTP basé sur fetch :
 * - préfixe automatiquement l'URL de l'API (VITE_API_URL) ;
 * - refuse les URL absolues, pour ne jamais envoyer de requête vers un autre domaine par erreur ;
 * - coupe la requête après un délai (10 s par défaut) ;
 * - n'envoie les cookies qu'au même domaine (`credentials: 'same-origin'`) ;
 * - lève une HttpError si le serveur répond avec un code d'erreur.
 *
 * Exemple : const users = await http<User[]>('/users');
 */
export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error(`Chemin d'API invalide : "${path}" (doit commencer par un seul "/")`);
  }

  const { body, timeoutMs = 10_000, headers, signal, baseUrl = env.apiUrl, ...init } = options;
  const timeout = AbortSignal.timeout(timeoutMs);

  const response = await fetch(`${baseUrl}${path}`, {
    credentials: 'same-origin',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });

  if (!response.ok) {
    throw new HttpError(response.status, `Requête échouée (${response.status})`);
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new HttpError(response.status, 'Réponse inattendue : JSON attendu');
  }

  return (await response.json()) as T;
}
