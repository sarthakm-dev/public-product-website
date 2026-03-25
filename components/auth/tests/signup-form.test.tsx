import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../signup-form';
import { signIn } from 'next-auth/react';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(() => Promise.resolve({ error: null })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('shows validation errors when fields are empty', async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByText(/create account/i));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/use at least 6 characters/i)
    ).toBeInTheDocument();
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

    expect(await screen.findByText(/signup failed/i)).toBeInTheDocument();
  });

  it('calls signIn and redirects on success', async () => {
    // Mock fetch to return success
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

    expect(await screen.findByText(/account created/i)).toBeInTheDocument();
  });
});
