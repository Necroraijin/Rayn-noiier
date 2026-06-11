"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import AppLayout from "./app-layout"
import { useAuth } from "@/lib/auth-context"

const PUBLIC_PATHS = ["/", "/pricing", "/register", "/login"]

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

  return <AppLayout>{children}</AppLayout>
}
