import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, UserRole, RenterDetails } from '../lib/types';
import { supabase } from '../lib/supabase';

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, portal?: 'customer' | 'admin') => Promise<{ success: boolean; error?: string }>;
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string; renterDetails?: RenterDetails }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Canonical Default Accounts per PRD and Implementation Plan
export const DEFAULT_CREDENTIALS = {
  admin: {
    email: 'marcus@drivefleet.demo',
    password: 'Admin@DriveFleet2026!',
    user: {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'marcus@drivefleet.demo',
      role: 'admin' as UserRole,
      firstName: 'Marcus',
      lastName: 'Vance',
      phone: '+234 809 999 8877',
      active: true,
      createdAt: '2026-01-15T08:00:00Z',
    },
  },
  staffLagos: {
    email: 'amara@drivefleet.demo',
    password: 'Staff@DriveFleet2026!',
    user: {
      id: 'a0000000-0000-0000-0000-000000000002',
      email: 'amara@drivefleet.demo',
      role: 'staff' as UserRole,
      firstName: 'Amara',
      lastName: 'Kalu',
      phone: '+234 802 111 2233',
      active: true,
      preferredBranchId: 'b0000000-0000-0000-0000-000000000001',
      createdAt: '2026-02-01T08:00:00Z',
    },
  },
  staffAbuja: {
    email: 'ibrahim@drivefleet.demo',
    password: 'Staff@DriveFleet2026!',
    user: {
      id: 'a0000000-0000-0000-0000-000000000003',
      email: 'ibrahim@drivefleet.demo',
      role: 'staff' as UserRole,
      firstName: 'Ibrahim',
      lastName: 'Musa',
      phone: '+234 802 987 6543',
      active: true,
      preferredBranchId: 'b0000000-0000-0000-0000-000000000002',
      createdAt: '2026-02-10T08:00:00Z',
    },
  },
  customer: {
    email: 'chukwudi@drivefleet.demo',
    password: 'Customer@DriveFleet2026!',
    user: {
      id: 'c0000000-0000-0000-0000-000000000001',
      email: 'chukwudi@drivefleet.demo',
      role: 'customer' as UserRole,
      firstName: 'Chukwudi',
      lastName: 'Adeyemi',
      phone: '+234 803 555 0192',
      active: true,
      preferredBranchId: 'b0000000-0000-0000-0000-000000000001',
      createdAt: '2026-03-01T08:00:00Z',
    },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'drivefleet_auth_session';
const REGISTERED_USERS_KEY = 'drivefleet_registered_users';

interface RegisteredUserRecord {
  user: User;
  password: string;
  renterDetails?: RenterDetails;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Save session when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Load custom registered accounts
  const getRegisteredUsers = (): RegisteredUserRecord[] => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const login = async (
    email: string,
    password: string,
    portal?: 'customer' | 'admin'
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check default seed accounts
    const seedAccounts = [
      DEFAULT_CREDENTIALS.admin,
      DEFAULT_CREDENTIALS.staffLagos,
      DEFAULT_CREDENTIALS.staffAbuja,
      DEFAULT_CREDENTIALS.customer,
    ];

    let matchedUser: User | null = null;

    const matchedSeed = seedAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPass
    );

    if (matchedSeed) {
      matchedUser = matchedSeed.user;
    } else {
      // 2. Check registered accounts
      const registered = getRegisteredUsers();
      const match = registered.find(
        (r) => r.user.email.toLowerCase() === cleanEmail && r.password === cleanPass
      );
      if (match) {
        matchedUser = match.user;
      }
    }

    if (!matchedUser) {
      return { success: false, error: 'Invalid email address or password. Please try again.' };
    }

    // Role check for admin/operations portal
    if (portal === 'admin' && matchedUser.role === 'customer') {
      return {
        success: false,
        error: 'Access denied: This portal is reserved for DriveFleet operations personnel. Customers please use the main sign in.',
      };
    }

    setUser(matchedUser);
    return { success: true };
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    renterDetails?: RenterDetails;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check if email conflicts with seed or existing accounts
    const seedAccounts = [
      DEFAULT_CREDENTIALS.admin.email,
      DEFAULT_CREDENTIALS.staffLagos.email,
      DEFAULT_CREDENTIALS.staffAbuja.email,
      DEFAULT_CREDENTIALS.customer.email,
    ];

    if (seedAccounts.includes(cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const registered = getRegisteredUsers();
    if (registered.some((r) => r.user.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      role: 'customer',
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };

    const newRecord: RegisteredUserRecord = {
      user: newUser,
      password: data.password.trim(),
      renterDetails: data.renterDetails,
    };

    registered.push(newRecord);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));

    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
