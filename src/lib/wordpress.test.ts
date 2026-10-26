import { describe, expect, it } from 'vitest';
import { toSafeHref } from './wordpress';

describe('toSafeHref', () => {
  it('transforme les liens du site en chemins internes', () => {
    expect(toSafeHref(`${window.location.origin}/expertises/`)).toBe('/expertises');
    expect(toSafeHref('/actualites')).toBe('/actualites');
  });

  it('conserve les liens externes http(s)', () => {
    expect(toSafeHref('https://exemple.org/page')).toBe('https://exemple.org/page');
  });

  it('refuse les protocoles dangereux et les liens vides', () => {
    // eslint-disable-next-line no-script-url -- on vérifie justement que ce lien est refusé
    expect(toSafeHref('javascript:alert(1)')).toBeUndefined();
    expect(toSafeHref('data:text/html,<script>alert(1)</script>')).toBeUndefined();
    expect(toSafeHref('#')).toBeUndefined();
    expect(toSafeHref('')).toBeUndefined();
  });
});
