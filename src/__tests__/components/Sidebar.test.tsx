import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

jest.mock('@/components/SearchBox', () => ({
  __esModule: true,
  default: () => <input aria-label="Ürün ara" />,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
  });

  test('keeps the closed menu inert and restores focus after Escape', () => {
    render(<Sidebar />);

    const trigger = screen.getByRole('button', { name: 'Menüyü aç' });
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveAttribute('aria-hidden', 'true');
    expect(dialog).toHaveAttribute('inert');

    fireEvent.click(trigger);
    expect(dialog).toHaveAttribute('aria-hidden', 'false');
    expect(dialog).not.toHaveAttribute('inert');
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
    expect(screen.getByRole('button', { name: 'Menüyü kapat' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(dialog).toHaveAttribute('aria-hidden', 'true');
    expect(dialog).toHaveAttribute('inert');
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });
});
