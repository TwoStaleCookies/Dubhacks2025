// AuthProvider.tsx (memory-only role; no Firestore persistence)
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig"; // adjust path if needed

type Role = "kid" | "parent" | null;

type AuthContextShape = {
  user: User | null;
  role: Role;
  loading: boolean;
  /** Set the in-memory role for this session only */
  setRole: (r: Exclude<Role, null>) => void;
  /** Clear the role (e.g., to re-pick) */
  clearRole: () => void;
};

const AuthContext = createContext<AuthContextShape>({
  user: null,
  role: null,
  loading: true,
  setRole: () => {},
  clearRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for sign-in/sign-out. Each sign-in starts with no role.
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setRoleState(null); // fresh role every time you (re)authenticate
      setLoading(false);
    });
    return unsub;
  }, []);

  const setRole = (r: Exclude<Role, null>) => setRoleState(r);
  const clearRole = () => setRoleState(null);

  const value = useMemo(
    () => ({ user, role, loading, setRole, clearRole }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
