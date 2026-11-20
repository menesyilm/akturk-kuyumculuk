import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import HeroMedia from '@/components/HeroMedia';

type MediaState = {
  reducedMotion: boolean;
  desktop: boolean;
  saveData: boolean;
};

type IntersectionCallback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void;

let intersectionCallback: IntersectionCallback | undefined;

function configureBrowser({ reducedMotion, desktop, saveData }: MediaState) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? reducedMotion : desktop,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(navigator, 'connection', {
    configurable: true,
    value: {
      saveData,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  });

  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: 'visible',
  });

  class MockIntersectionObserver {
    constructor(callback: IntersectionCallback) {
      intersectionCallback = callback;
    }

    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(global, 'IntersectionObserver', {
    configurable: true,
    value: MockIntersectionObserver,
  });
}

describe('HeroMedia', () => {
  beforeEach(() => {
    intersectionCallback = undefined;
    jest.clearAllMocks();
  });

  test('loads a silent desktop loop while retaining the product image fallback', async () => {
    configureBrowser({ reducedMotion: false, desktop: true, saveData: false });
    render(
      <HeroMedia
        videoSrc="/media/hero/test.mp4"
        videoWebmSrc="/media/hero/test.webm"
        videoPosterSrc="/media/hero/test.jpg"
      />,
    );

    expect(screen.getByRole('img', { name: /trabzon hasırı üretim süreci/i })).toBeInTheDocument();
    const video = await screen.findByTestId('hero-video');

    expect(video).toHaveAttribute('data-variant', 'desktop');
    expect(video).toHaveAttribute('poster', '/media/hero/test.jpg');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveProperty('autoplay', true);
    expect(video).toHaveProperty('muted', true);
    expect(video).toHaveProperty('loop', true);
    expect(video).toHaveProperty('playsInline', true);
    expect(video).not.toHaveAttribute('controls');
    expect(video.querySelector('source[type="video/webm"]')).toHaveAttribute('src', '/media/hero/test.webm');
    expect(video.querySelector('source[type="video/mp4"]')).toHaveAttribute('src', '/media/hero/test.mp4');
    expect(video.querySelectorAll('source')[0]).toHaveAttribute('type', 'video/webm');
    expect(video.querySelectorAll('source')[1]).toHaveAttribute('type', 'video/mp4');
  });

  test('does not request video when reduced motion is preferred', async () => {
    configureBrowser({ reducedMotion: true, desktop: true, saveData: false });
    render(<HeroMedia />);

    await waitFor(() => expect(screen.queryByTestId('hero-video')).not.toBeInTheDocument());
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('loads lightweight mobile sources below 768px', async () => {
    configureBrowser({ reducedMotion: false, desktop: false, saveData: false });
    render(
      <HeroMedia
        mobileVideoSrc="/media/hero/mobile.mp4"
        mobileVideoWebmSrc="/media/hero/mobile.webm"
        videoPosterSrc="/media/hero/shared-poster.jpg"
      />,
    );

    const video = await screen.findByTestId('hero-video');
    expect(video).toHaveAttribute('data-variant', 'mobile');
    expect(video).toHaveAttribute('poster', '/media/hero/shared-poster.jpg');
    expect(video.querySelector('source[type="video/webm"]')).toHaveAttribute('src', '/media/hero/mobile.webm');
    expect(video.querySelector('source[type="video/mp4"]')).toHaveAttribute('src', '/media/hero/mobile.mp4');
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('does not request video when data saver is enabled', async () => {
    configureBrowser({ reducedMotion: false, desktop: true, saveData: true });
    render(<HeroMedia videoSrc="/media/hero/data-saver.mp4" />);

    await waitFor(() => expect(screen.queryByTestId('hero-video')).not.toBeInTheDocument());
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('pauses offscreen or hidden video and resumes it when visible', async () => {
    configureBrowser({ reducedMotion: false, desktop: true, saveData: false });
    render(<HeroMedia />);
    await screen.findByTestId('hero-video');

    const play = jest.mocked(HTMLMediaElement.prototype.play);
    const pause = jest.mocked(HTMLMediaElement.prototype.pause);

    act(() => intersectionCallback?.([{ isIntersecting: false }]));
    expect(pause).toHaveBeenCalled();

    act(() => intersectionCallback?.([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalled();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(pause).toHaveBeenCalledTimes(2);
  });

  test('offers an accessible playback control and respects a user pause', async () => {
    configureBrowser({ reducedMotion: false, desktop: true, saveData: false });
    render(<HeroMedia />);

    const video = await screen.findByTestId('hero-video');
    fireEvent.canPlay(video);
    fireEvent.play(video);

    const pauseButton = screen.getByRole('button', { name: 'Videoyu durdur' });
    fireEvent.click(pauseButton);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    fireEvent.pause(video);

    const play = jest.mocked(HTMLMediaElement.prototype.play);
    play.mockClear();
    act(() => intersectionCallback?.([{ isIntersecting: false }]));
    act(() => intersectionCallback?.([{ isIntersecting: true }]));
    expect(play).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Videoyu oynat' }));
    expect(play).toHaveBeenCalledTimes(1);
  });

  test('hides the playback control when video is unavailable', async () => {
    configureBrowser({ reducedMotion: false, desktop: true, saveData: false });
    render(<HeroMedia />);

    const video = await screen.findByTestId('hero-video');
    fireEvent.canPlay(video);
    expect(screen.getByTestId('hero-playback-toggle')).toBeInTheDocument();

    fireEvent.error(video);
    await waitFor(() => expect(screen.queryByTestId('hero-playback-toggle')).not.toBeInTheDocument());
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
