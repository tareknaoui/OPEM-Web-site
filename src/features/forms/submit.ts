import { env } from '@/lib/env';

/*
 * Envoi d'un formulaire à WordPress (extension wordpress/opem-forms-api.php, hébergée en
 * Algérie) : un envoi multipart, fichiers compris. Le serveur répond par un JSON court ; ses
 * refus champ par champ reviennent sous forme de codes, traduits à l'affichage.
 */

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'invalid'; errors: Record<string, string> }
  | { ok: false; reason: 'rate' | 'tooLarge' | 'unavailable' };

const TIMEOUT_MS = 120_000; // les pièces jointes peuvent être lourdes

export async function submitForm(endpoint: string, data: FormData): Promise<SubmitResult> {
  if (!env.wpApiUrl) return { ok: false, reason: 'unavailable' };
  try {
    const response = await fetch(`${env.wpApiUrl}/opem/v1/${endpoint}`, {
      method: 'POST',
      body: data,
      credentials: 'omit',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.ok) return { ok: true };
    if (response.status === 429) return { ok: false, reason: 'rate' };
    if (response.status === 413) return { ok: false, reason: 'tooLarge' };
    if (response.status === 422) {
      const body: unknown = await response.json().catch(() => null);
      return { ok: false, reason: 'invalid', errors: parseErrors(body) };
    }
    return { ok: false, reason: 'unavailable' };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

/** { errors: { champ: code } }, revalidé : seules des chaînes courtes sont gardées. */
function parseErrors(body: unknown): Record<string, string> {
  const errors =
    typeof body === 'object' && body !== null ? (body as { errors?: unknown }).errors : null;
  if (typeof errors !== 'object' || errors === null) return {};
  return Object.fromEntries(
    Object.entries(errors).filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === 'string' && entry[0].length < 40 && entry[1].length < 40,
    ),
  );
}
