"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, ShieldCheck, Lock, Fingerprint } from "lucide-react"

export function SecuritySettings() {
  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
           <CardTitle className="text-lg font-light font-serif italic text-white/90">End-to-End Encryption (E2EE)</CardTitle>
           <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Manage organization keys and data compliance standards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl bg-white/5">
             <div className="flex items-center gap-6">
                <div className="h-12 w-12 border border-white/10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                   <KeyRound className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                   <p className="font-bold text-xs uppercase tracking-widest text-white/90">Master Organization Key</p>
                   <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mt-2">Rotated: 2026-01-15 • RSA-4096</p>
                </div>
             </div>
             <Button variant="outline" size="sm" className="h-9 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold">Rotate Key</Button>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono leading-relaxed mt-4 p-4 border border-white/5 rounded-lg bg-black/20">
            All document uploads and client communications are AES-256 encrypted at rest. 
            AI analysis is processed statelessly via secure enterprise endpoints.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
         <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
            <CardHeader>
               <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90 flex items-center gap-2"><Fingerprint className="h-4 w-4 text-emerald-400" /> Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white/80">Enforce MFA Firm-Wide</h4>
                    <p className="text-[10px] text-white/40 mt-1">Require TOTP or WebAuthn for all roles.</p>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1 justify-end cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white/80">Session Timeout</h4>
                    <p className="text-[10px] text-white/40 mt-1">Force re-auth after inactivity.</p>
                  </div>
                  <select className="bg-black/50 border border-white/10 rounded py-1 px-2 text-xs font-mono outline-none text-white/80 w-24">
                     <option>15 mins</option>
                     <option>30 mins</option>
                     <option>1 hour</option>
                  </select>
               </div>
            </CardContent>
         </Card>

         <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
            <CardHeader>
               <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90 flex items-center gap-2"><Lock className="h-4 w-4 text-emerald-400" /> IP & Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">IP Whitelist (CIDR blocks)</Label>
                 <Input defaultValue="192.168.1.0/24, 10.0.0.0/8" className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-xs" />
               </div>
               <div className="flex items-center justify-between mt-4">
                  <div>
                    <h4 className="text-xs font-bold text-white/80">Immutable Audit Logs</h4>
                    <p className="text-[10px] text-white/40 mt-1">Retention period</p>
                  </div>
                  <select className="bg-black/50 border border-white/10 rounded py-1 px-2 text-xs font-mono outline-none text-white/80 w-24">
                     <option>7 Years</option>
                     <option>10 Years</option>
                     <option>Indefinite</option>
                  </select>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
