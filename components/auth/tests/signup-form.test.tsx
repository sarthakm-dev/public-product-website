import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../signup-form';
import { signIn } from 'next-auth/react';

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

describe('SignupForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('shows validation errors when fields are empty', async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByText(/create account/i));

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const nameError = await screen.findByText(/name is required/i);
    const emailError = await screen.findByText(/enter a valid email/i);
    expect(
      await screen.findByText(/use at least 6 characters/i)
    ).toBeInTheDocument();
    expect(nameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(nameError.id)
    );
    await waitFor(() => {
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  it('shows error when API returns failure', async () => {
    // Mock fetch to return error
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Signup failed.' }),
      } as Response)
    );

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByText(/create account/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed', {
        description: 'Signup failed.',
      });
    });
  });

  it('calls signIn and redirects on success', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Account created.' }),
      } as Response)
    );

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByText(/create account/i));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'secret',
        redirect: false,
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Account created', {
      description: 'Account created.',
    });
  });
});
