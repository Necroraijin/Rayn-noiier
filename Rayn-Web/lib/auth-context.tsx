"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"

export type Role = "SUPER_ADMIN" | "EQUITY_PARTNER" | "SALARIED_PARTNER" | "COUNSEL" | "SENIOR_ASSOCIATE" | "ASSOCIATE" | "INTERN" | "PARALEGAL" | "BILLING_ADMIN" | "GUEST_CLIENT" | null

interface AuthContextType {
  role: Role
  email: string | null
  login: (email: string, role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  email: null,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [role, setRole] = useState<Role>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (status === "authenticated" && session?.user) {
      setRole((session.user as any).role || "ASSOCIATE")
      setEmail(session.user.email || null)
    } else if (status === "unauthenticated") {
      setRole(null)
      setEmail(null)
    }
    setMounted(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [session, status])

  const login = () => {
    signIn("cognito")
  }

  const logout = () => {
    signOut()
  }

  if (!mounted || status === "loading") return null

  return (
    <AuthContext.Provider value={{ role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  )
}
