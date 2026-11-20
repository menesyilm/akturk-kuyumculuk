import { act, render } from '@testing-library/react';
import Lenis from 'lenis';
import SmoothScroll from '@/components/SmoothScroll';

jest.mock('lenis', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    raf: jest.fn(),
    destroy: jest.fn(),
  })),
}));

function configureMotionPreference(matches: boolean) {
  const listeners = new Set<() => void>();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn(() => ({
      matches,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn((_event: string, listener: () => void) => listeners.add(listener)),
      removeEventListener: jest.fn((_event: string, listener: () => void) => listeners.delete(listener)),
    })),
  });
}

describe('SmoothScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    configureMotionPreference(false);
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: jest.fn(() => 17),
    });
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: jest.fn(),
    });
  });

  test('uses native scrolling when reduced motion is requested', () => {
    configureMotionPreference(true);
    render(<SmoothScroll />);

    expect(Lenis).not.toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  test('pauses its animation frame while the document is hidden', () => {
    const { unmount } = render(<SmoothScroll />);

    expect(Lenis).toHaveBeenCalledWith(expect.objectContaining({ autoRaf: false }));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(cancelAnimationFrame).toHaveBeenCalledWith(17);

    unmount();
    const instance = jest.mocked(Lenis).mock.results[0]?.value;
    expect(instance.destroy).toHaveBeenCalled();
  });
});
