import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../login-form';

const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(() => Promise.resolve({ error: null })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('shows validation error for empty email', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/sign in with credentials/i));
    const emailInput = screen.getByPlaceholderText(/email/i);
    const errorMessage = await screen.findByText(/email/i);

    expect(errorMessage).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(errorMessage.id)
    );
    await waitFor(() => {
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });
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

  it('shows a toast when credentials are rejected', async () => {
    const { signIn } = await import('next-auth/react');
    vi.mocked(signIn).mockResolvedValueOnce({
      error: 'CredentialsSignin',
      ok: false,
      status: 401,
      url: null,
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByText(/sign in with credentials/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Sign-in failed', {
        description: 'Invalid credentials. Check the Strapi user account.',
      });
    });
  });
});
