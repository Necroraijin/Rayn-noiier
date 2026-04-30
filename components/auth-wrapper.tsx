"use client"

import React from "react"
import AppLayout from "./app-layout"
import LoginPage from "./login-page"
import { useAuth } from "@/lib/auth-context"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { role } = useAuth()

  if (!role) {
    return <LoginPage />
  }

  return <AppLayout>{children}</AppLayout>
}
