/**
 * TypeScript declarations for useAuth hook
 */

declare module '../hooks/useAuth' {
  export interface User {
    $id: string;
    name: string;
    email: string;
    emailVerification: boolean;
    prefs: Record<string, any>;
    [key: string]: any;
  }

  export interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    signup: (email: string, password: string, name: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    logout: () => Promise<void>;
    checkUserSession: () => Promise<{ success: boolean; user: User | null }>;
    loginWithGoogle: () => Promise<void>;
    loginWithGithub: () => Promise<void>;
    updateEmail: (newEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
    updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    sendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
    deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  }

  export function useAuth(): AuthContextValue;
}
