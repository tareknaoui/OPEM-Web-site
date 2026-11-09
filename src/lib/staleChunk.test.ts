import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isStaleChunkError, reloadOnce } from './staleChunk';

describe('Ancienne version du site après une mise en ligne', () => {
  it('reconnaît un module introuvable, quel que soit le navigateur', () => {
    expect(
      isStaleChunkError(
        new TypeError('Failed to fetch dynamically imported module: /assets/IaPage-B4Mp_fkY.js'),
      ),
    ).toBe(true);
    expect(isStaleChunkError(new TypeError('Importing a module script failed.'))).toBe(true);
    expect(isStaleChunkError(new Error('error loading dynamically imported module'))).toBe(true);
    expect(isStaleChunkError(new Error('Cannot read properties of undefined'))).toBe(false);
    expect(isStaleChunkError(null)).toBe(false);
  });

  describe('rechargement', () => {
    const reload = vi.fn();
    beforeEach(() => {
      sessionStorage.clear();
      vi.stubGlobal('location', { ...window.location, reload });
    });
    afterEach(() => {
      vi.unstubAllGlobals();
      reload.mockReset();
    });

    it('recharge une fois, pas deux de suite (aucune boucle)', () => {
      expect(reloadOnce(1_000_000)).toBe(true);
      expect(reloadOnce(1_005_000)).toBe(false);
      expect(reload).toHaveBeenCalledTimes(1);
      // Bien plus tard (une autre mise en ligne), il peut recharger de nouveau.
      expect(reloadOnce(1_100_000)).toBe(true);
      expect(reload).toHaveBeenCalledTimes(2);
    });
  });
});
