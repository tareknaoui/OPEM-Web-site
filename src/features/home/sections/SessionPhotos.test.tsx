import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { homeContent } from '../content';
import { SessionPhotos } from './SessionPhotos';

const { photoControls } = homeContent.fr.trainings;
const photos = [1, 2, 3].map((n) => ({ src: `/p${n}.webp`, alt: `Session ${n}` }));
const active = () => document.querySelector('img[data-active]')?.getAttribute('alt');

describe('Photos des sessions (diaporama)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fait défiler les photos, s’arrête sur pause et se pilote aux pastilles', () => {
    render(<SessionPhotos photos={photos} controls={photoControls} />);
    expect(active()).toBe('Session 1');
    act(() => vi.advanceTimersByTime(5000));
    expect(active()).toBe('Session 2');

    fireEvent.click(screen.getByRole('button', { name: photoControls.pause }));
    act(() => vi.advanceTimersByTime(15000));
    expect(active()).toBe('Session 2');

    fireEvent.click(screen.getByRole('button', { name: 'Photo 3 sur 3' }));
    expect(active()).toBe('Session 3');
    expect(screen.getByRole('button', { name: 'Photo 3 sur 3' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('une seule photo : ni pause ni pastilles', () => {
    render(<SessionPhotos photos={photos.slice(0, 1)} controls={photoControls} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(active()).toBe('Session 1');
  });
});
