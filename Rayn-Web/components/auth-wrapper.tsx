"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import AppLayout from "./app-layout"
import { useAuth } from "@/lib/auth-context"
import AccessDenied from "./access-denied"

const PUBLIC_PATHS = ["/", "/pricing", "/register", "/login"]

const ROUTE_ROLES: Record<string, string[]> = {
  "/tasks": ["SUPER_ADMIN", "SENIOR_ASSOCIATE", "ASSOCIATE", "INTERN", "PARALEGAL"],
  "/strategy": ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL"],
  "/research": ["SUPER_ADMIN", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "INTERN"],
  "/cases": ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"],
  "/clients": ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER"],
  "/team": ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "SENIOR_ASSOCIATE"],
  "/review": ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "SENIOR_ASSOCIATE"],
  "/drafting": ["SUPER_ADMIN", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE"],
  "/library": ["SUPER_ADMIN", "COUNSEL", "PARALEGAL"],
  "/billing": ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "BILLING_ADMIN", "SENIOR_ASSOCIATE", "ASSOCIATE", "INTERN", "PARALEGAL", "GUEST_CLIENT"],
  "/analytics": ["SUPER_ADMIN", "EQUITY_PARTNER", "BILLING_ADMIN"],
  "/documents": ["SUPER_ADMIN", "INTERN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"],
  "/calendar": ["SUPER_ADMIN", "INTERN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"],
  "/communications": ["SUPER_ADMIN", "INTERN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"],
  "/learning": ["SUPER_ADMIN", "ASSOCIATE", "INTERN"],
  "/audit": ["SUPER_ADMIN"],
  "/settings": ["SUPER_ADMIN"],
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { role } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = PUBLIC_PATHS.includes(pathname)

  useEffect(() => {
    if (pathname === "/login" && role) {
      router.push("/dashboard")
    } else if (!isPublic && !role) {
      router.push("/login")
    }
  }, [isPublic, role, pathname, router])

  if (isPublic) {
    return <>{children}</>
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Page level Access Restriction (RBAC validation)
  const allowedRoles = ROUTE_ROLES[pathname]
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <AppLayout>
        <AccessDenied 
          requiredRole={allowedRoles.map(r => r.replace("_", " ")).join(" / ")} 
          message="Your workspace account permissions do not allow you to access this page." 
        />
      </AppLayout>
    )
  }

  return <AppLayout>{children}</AppLayout>
}
