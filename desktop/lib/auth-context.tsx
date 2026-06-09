"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Role = "SUPER_ADMIN" | "EQUITY_PARTNER" | "SALARIED_PARTNER" | "COUNSEL" | "SENIOR_ASSOCIATE" | "ASSOCIATE" | "INTERN" | "PARALEGAL" | "BILLING_ADMIN" | "GUEST_CLIENT" | null

interface AuthContextType {
  role: Role
  email: string | null
  permissions: string[]
  login: (email: string, role: Role, permissions?: string[]) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  email: null,
  permissions: [],
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    let savedRole = localStorage.getItem("rayn_role") as Role
    let savedEmail = localStorage.getItem("rayn_email")
    let savedPerms = localStorage.getItem("rayn_perms")
    if (savedRole) {
      setRole(savedRole)
      setEmail(savedEmail)
      if (savedPerms) {
        try { setPermissions(JSON.parse(savedPerms)) } catch(e) {}
      }
    }
    setMounted(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  const login = (newEmail: string, newRole: Role, newPerms: string[] = []) => {
    localStorage.setItem("rayn_role", newRole as string)
    localStorage.setItem("rayn_email", newEmail)
    localStorage.setItem("rayn_perms", JSON.stringify(newPerms))
    setRole(newRole)
    setEmail(newEmail)
    setPermissions(newPerms)
  }

  const logout = () => {
    localStorage.removeItem("rayn_role")
    localStorage.removeItem("rayn_email")
    localStorage.removeItem("rayn_perms")
    setRole(null)
    setEmail(null)
    setPermissions([])
    window.location.reload()
  }

  if (!mounted) return null

  return (
    <AuthContext.Provider value={{ role, email, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
