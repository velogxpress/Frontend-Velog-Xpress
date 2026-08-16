"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// 🔐 SECURITY: this cookie intentionally never holds the JWT itself — only
// a non-sensitive "1"/absent flag. middleware.ts reads it purely to decide
// "is anyone logged in at all" for routing. The actual bearer token used
// for API calls lives only in localStorage (still JS-readable, same as
// before, but at least it's no longer duplicated into a second JS-readable
// location). See SignInForm/UserDropdown, which now go through login()/
// logout() below instead of touching storage directly.
const SESSION_COOKIE = "vlx_session";

// Keys other components cache locally that must not survive past logout,
// so a second person signing in on the same shared browser never sees the
// previous user's cached name/email/phone (see FeedBackForm).
const LOGOUT_CLEARED_KEYS = ["userName", "userEmail", "telephone"];

type User = {
  sub: string;
  roles: string[];
  exp: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Recharge user si refresh page
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);

        const roles =
          decoded.roles || decoded.authorities || decoded.authority || [];

        const normalizedUser: User = {
          sub: decoded.sub,
          exp: decoded.exp,
          roles: Array.isArray(roles)
            ? roles.map((r: string) =>
                r.replace("ROLE_", "").replace("ROLE", "")
              )
            : [],
        };

        // ⏰ Token expiré
        if (normalizedUser.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(storedToken);
          setUser(normalizedUser);
        }
      } catch {
        logout();
      }
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN (OBLIGATOIREMENT utiliser cette fonction)
  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    Cookies.set(SESSION_COOKIE, "1", {
      expires: 1,
      sameSite: "strict",
      secure: typeof window !== "undefined" && window.location.protocol === "https:",
    });

    const decoded: any = jwtDecode(newToken);
    const roles =
      decoded.roles || decoded.authorities || decoded.authority || [];

    const normalizedUser: User = {
      sub: decoded.sub,
      exp: decoded.exp,
      roles: Array.isArray(roles)
        ? roles.map((r: string) => r.replace("ROLE_", "").replace("ROLE", ""))
        : [],
    };

    setToken(newToken);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    Cookies.remove(SESSION_COOKIE);
    LOGOUT_CLEARED_KEYS.forEach((key) => localStorage.removeItem(key));
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
