import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, UserRole } from '../lib/types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  customer: {
    id: 'c0000000-0000-0000-0000-000000000001',
    email: 'c.adeyemi@enterprise-lagos.ng',
    role: 'customer',
    firstName: 'Chukwudi',
    lastName: 'Adeyemi',
    phone: '+234 803 555 0192',
    active: true,
    preferredBranchId: 'b0000000-0000-0000-0000-000000000001',
    createdAt: new Date().toISOString(),
  },
  staff: {
    id: 's0000000-0000-0000-0000-000000000001',
    email: 'amara.kalu@drivefleet.demo',
    role: 'staff',
    firstName: 'Amara',
    lastName: 'Kalu',
    phone: '+234 802 111 2233',
    active: true,
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'marcus.vance@drivefleet.demo',
    role: 'admin',
    firstName: 'Marcus',
    lastName: 'Vance',
    phone: '+234 809 999 8877',
    active: true,
    createdAt: new Date().toISOString(),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('drivefleet_demo_role');
    const role = (saved as UserRole) || 'customer';
    return DEMO_USERS[role];
  });

  const login = (role: UserRole = 'customer') => {
    localStorage.setItem('drivefleet_demo_role', role);
    setUser(DEMO_USERS[role]);
  };

  const logout = () => {
    localStorage.removeItem('drivefleet_demo_role');
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    localStorage.setItem('drivefleet_demo_role', role);
    setUser(DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
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
