"use client"

import React from "react"
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

interface AccessDeniedProps {
  title?: string
  message?: string
  requiredPermission?: string
  requiredRole?: string
}

export default function AccessDenied({
  title = "Access Denied",
  message = "You do not have the required permissions to view this area.",
  requiredPermission,
  requiredRole,
}: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
          <ShieldAlert className="h-9 w-9 text-red-500/60" />
        </div>
        <div className="absolute -inset-3 border border-red-500/10 rounded-3xl" />
      </div>

      <h2 className="text-2xl font-serif italic text-white/90 mb-3">{title}</h2>
      <p className="text-xs uppercase tracking-widest text-white/40 font-mono max-w-md text-center leading-relaxed mb-6">
        {message}
      </p>

      {(requiredPermission || requiredRole) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {requiredRole && (
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-red-400/60 border border-red-500/15 bg-red-500/5 px-3 py-1.5 rounded-full">
              <Lock className="w-3 h-3" />
              Required Role: {requiredRole}
            </div>
          )}
          {requiredPermission && (
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-red-400/60 border border-red-500/15 bg-red-500/5 px-3 py-1.5 rounded-full">
              <ShieldAlert className="w-3 h-3" />
              Permission: {requiredPermission}
            </div>
          )}
        </div>
      )}

      <Link
        href="/"
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl px-5 py-3 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Dashboard
      </Link>

      <p className="mt-12 text-[9px] uppercase tracking-widest font-mono text-white/10">
        Contact your System Administrator if you believe this is an error.
      </p>
    </div>
  )
}
