import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../login-form';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(() => Promise.resolve({ error: null })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  it('shows validation error for empty email', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/sign in with credentials/i));
    expect(await screen.findByText(/email/i)).toBeInTheDocument();
  });

  it('calls signIn with credentials', async () => {
    const { signIn } = await import('next-auth/react');
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByText(/sign in with credentials/i));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'secret',
        redirect: false,
      });
    });
  });
});
