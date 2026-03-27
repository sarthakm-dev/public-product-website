import { render, screen, fireEvent } from '@testing-library/react';
import { pageRoutes } from '@/lib/routes';
import { SignOutButton } from '../sign-out-button';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));
import { signOut } from 'next-auth/react';

describe('SignOutButton', () => {
  it('renders logout button', () => {
    render(<SignOutButton />);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('calls signOut on click', () => {
    render(<SignOutButton />);
    fireEvent.click(screen.getByText(/logout/i));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: pageRoutes.home });
  });
});
