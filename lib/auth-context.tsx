"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    let savedRole = localStorage.getItem("rayn_role") as Role
    let savedEmail = localStorage.getItem("rayn_email")
    if (savedRole) {
      setRole(savedRole)
      setEmail(savedEmail)
    }
    setMounted(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  const login = (newEmail: string, newRole: Role) => {
    localStorage.setItem("rayn_role", newRole as string)
    localStorage.setItem("rayn_email", newEmail)
    setRole(newRole)
    setEmail(newEmail)
  }

  const logout = () => {
    localStorage.removeItem("rayn_role")
    localStorage.removeItem("rayn_email")
    setRole(null)
    setEmail(null)
    window.location.reload()
  }

  if (!mounted) return null

  return (
    <AuthContext.Provider value={{ role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
