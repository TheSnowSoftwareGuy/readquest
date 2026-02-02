import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Stub window for Node environment
beforeAll(() => {
  if (typeof globalThis.window === 'undefined') {
    globalThis.window = { location: { origin: 'http://localhost:5173' } };
  }
});

// Mock the supabase module
const mockSignUp = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockFrom = vi.fn();
const mockInvoke = vi.fn();

vi.mock('../src/lib/supabase.ts', () => ({
  supabase: {
    auth: {
      signUp: (...args) => mockSignUp(...args),
      signInWithPassword: (...args) => mockSignInWithPassword(...args),
      signInWithOAuth: (...args) => mockSignInWithOAuth(...args),
      signOut: (...args) => mockSignOut(...args),
      getUser: (...args) => mockGetUser(...args),
      getSession: () => Promise.resolve({ data: { session: { access_token: 'test-token' } } }),
      resetPasswordForEmail: (...args) => mockResetPasswordForEmail(...args),
      onAuthStateChange: (...args) => mockOnAuthStateChange(...args),
    },
    from: (...args) => mockFrom(...args),
    functions: { invoke: (...args) => mockInvoke(...args) },
  },
}));

const {
  registerTeacher,
  login,
  loginWithGoogle,
  logout,
  getCurrentProfile,
  resetPassword,
  onAuthStateChange,
} = await import('../src/lib/auth.js');

describe('Auth Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerTeacher', () => {
    it('should call supabase.auth.signUp with teacher role in metadata', async () => {
      mockSignUp.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null });

      const result = await registerTeacher({
        email: 'teacher@school.edu',
        password: 'securepassword',
        username: 'mrsmith',
        displayName: 'Mr. Smith',
      });

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'teacher@school.edu',
        password: 'securepassword',
        options: {
          data: {
            username: 'mrsmith',
            display_name: 'Mr. Smith',
            role: 'teacher',
          },
        },
      });
      expect(result.user.id).toBe('123');
    });

    it('should throw on signup error', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: null,
        error: new Error('Email already registered'),
      });

      await expect(
        registerTeacher({
          email: 'existing@school.edu',
          password: 'pass',
          username: 'existing',
          displayName: 'Existing',
        })
      ).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should call signInWithPassword', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: { id: '123' }, session: { access_token: 'tok' } },
        error: null,
      });

      const result = await login({ email: 'teacher@school.edu', password: 'pass' });

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'teacher@school.edu',
        password: 'pass',
      });
      expect(result.user.id).toBe('123');
    });

    it('should throw on invalid credentials', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: null,
        error: new Error('Invalid login credentials'),
      });

      await expect(login({ email: 'x@y.com', password: 'wrong' }))
        .rejects.toThrow('Invalid login credentials');
    });
  });

  describe('loginWithGoogle', () => {
    it('should call signInWithOAuth with google provider', async () => {
      mockSignInWithOAuth.mockResolvedValueOnce({ data: { url: 'https://...' }, error: null });

      await loginWithGoogle();

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      });
    });
  });

  describe('logout', () => {
    it('should call signOut', async () => {
      mockSignOut.mockResolvedValueOnce({ error: null });

      await logout();

      expect(mockSignOut).toHaveBeenCalledOnce();
    });
  });

  describe('getCurrentProfile', () => {
    it('should return null if no user is logged in', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });

      const result = await getCurrentProfile();
      expect(result).toBeNull();
    });

    it('should fetch profile and merge email from auth', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: '123', email: 'me@test.com' } },
      });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: '123', username: 'tester', role: 'teacher', xp: 500 },
              error: null,
            }),
          }),
        }),
      });

      const result = await getCurrentProfile();
      expect(result.id).toBe('123');
      expect(result.email).toBe('me@test.com');
      expect(result.username).toBe('tester');
      expect(result.xp).toBe(500);
    });
  });

  describe('resetPassword', () => {
    it('should call resetPasswordForEmail', async () => {
      mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });

      await resetPassword('me@test.com');

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        'me@test.com',
        expect.objectContaining({ redirectTo: expect.stringContaining('/auth/reset') })
      );
    });
  });

  describe('onAuthStateChange', () => {
    it('should register a callback', () => {
      const cb = vi.fn();
      onAuthStateChange(cb);
      expect(mockOnAuthStateChange).toHaveBeenCalledWith(cb);
    });
  });
});
