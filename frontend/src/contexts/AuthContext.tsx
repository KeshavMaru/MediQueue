import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  user_type?: "doctor" | "patient";
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (email: string, password: string, fullName: string, userType?: "doctor" | "patient", doctorDetails?: any) => Promise<void>;
  login: (email: string, password: string, userType?: "doctor" | "patient") => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user data");
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    setIsLoading(false);
  }, []);

  async function signup(email: string, password: string, fullName: string, userType: "doctor" | "patient" = "patient", doctorDetails?: any) {
    try {
      const body: any = { email, password, full_name: fullName, user_type: userType };
      if (doctorDetails) {
        body.doctor_details = doctorDetails;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Signup failed");
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  async function login(email: string, password: string, userType: "doctor" | "patient" = "patient") {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, user_type: userType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      const { accessToken: token, refreshToken: rToken } = data.body;

      // Store tokens
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", rToken);
      setAccessToken(token);
      setRefreshToken(rToken);

      // Fetch user info
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userData_body = userData.body;
        localStorage.setItem("user", JSON.stringify(userData_body));
        setUser(userData_body);
      }
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      if (accessToken && refreshToken) {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state regardless of API response
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
