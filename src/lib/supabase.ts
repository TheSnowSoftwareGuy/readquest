/**
 * ReadQuest — Supabase Client Configuration
 *
 * This module initializes and exports the Supabase client for use throughout
 * the front-end application. It reads from environment variables set by Vite.
 *
 * Required env vars (in .env or .env.local):
 *   VITE_SUPABASE_URL       — Your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY  — Your Supabase anon/public key
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

/** True when real credentials are configured */
export const isSupabaseConfigured =
  !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isSupabaseConfigured) {
  console.warn(
    '[ReadQuest] Supabase credentials not found — running in demo mode. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable auth.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage (default)
    persistSession: true,
    // Auto-refresh tokens before expiry
    autoRefreshToken: true,
    // Detect session from URL (for OAuth redirects)
    detectSessionInUrl: true,
    // Storage key prefix
    storageKey: 'readquest-auth',
  },
  global: {
    headers: {
      'x-application-name': 'readquest',
    },
  },
});

/**
 * Helper: Get the current authenticated user or null
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Helper: Get the current user's profile from the profiles table
 */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Sign up a new user with role metadata
 */
export async function signUp(
  email: string,
  password: string,
  metadata: {
    display_name: string;
    role?: 'student' | 'teacher' | 'parent';
    avatar_url?: string;
  }
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: metadata.display_name,
        role: metadata.role ?? 'student',
        avatar_url: metadata.avatar_url,
      },
    },
  });
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

/**
 * Sign out the current user
 */
export async function signOut() {
  return supabase.auth.signOut();
}

export default supabase;
