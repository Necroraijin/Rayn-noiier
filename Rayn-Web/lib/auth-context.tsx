"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

import { SessionProvider, useSession, signOut } from "next-auth/react"

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

function AuthSessionBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [role, setRole] = useState<Role>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setEmail(session.user.email || null)
      setRole((session.user as any).role as Role || "ASSOCIATE")
    } else if (status === "unauthenticated") {
      // Fallback to local storage for local developer/mock accounts
      const storedRole = localStorage.getItem("rayn_role") as Role
      const storedEmail = localStorage.getItem("rayn_email")
      if (storedRole && storedEmail) {
        setRole(storedRole)
        setEmail(storedEmail)
      } else {
        setRole(null)
        setEmail(null)
      }
    }
    setMounted(true)
  }, [session, status])

  const login = (emailVal: string, roleVal: Role) => {
    // Save to local storage for local mock login fallback
    localStorage.setItem("rayn_role", roleVal || "")
    localStorage.setItem("rayn_email", emailVal || "")
    setRole(roleVal)
    setEmail(emailVal)
  }

  const logout = () => {
    localStorage.removeItem("rayn_role")
    localStorage.removeItem("rayn_email")
    setRole(null)
    setEmail(null)
    signOut({ redirect: false })
  }

  if (!mounted) return null

  return (
    <AuthContext.Provider value={{ role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSessionBridge>
        {children}
      </AuthSessionBridge>
    </SessionProvider>
  )
}

