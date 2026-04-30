"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, Key, CreditCard, Sparkles, FileText } from "lucide-react"

export function BillingSettings() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        <Card className="bg-emerald-500/10 border-emerald-500/20 rounded-2xl shadow-none col-span-1 md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-light font-serif italic text-emerald-50">Current Plan: Enterprise Tier</CardTitle>
                <CardDescription className="text-[10px] tracking-widest uppercase text-emerald-400/60 mt-1">Unlimited Users & Dedicated AI Endpoints</CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 uppercase tracking-widest text-[9px] font-mono">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8 mb-8">
              <div>
                <p className="text-[10px] uppercase text-emerald-500/60 tracking-widest font-bold mb-1">Monthly Usage</p>
                <p className="text-3xl font-mono text-emerald-50">$4,500<span className="text-sm text-emerald-500/50">/mo</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-emerald-500/60 tracking-widest font-bold mb-1">Compute Tokens</p>
                <p className="text-3xl font-mono text-emerald-50">28.4<span className="text-sm text-emerald-500/50">M</span></p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400 rounded uppercase tracking-widest text-[10px] font-bold border-none">Manage Plan</Button>
              <Button variant="outline" className="border-emerald-500/30 text-emerald-50 hover:bg-emerald-500/20 rounded uppercase tracking-widest text-[10px] font-bold">View Invoices</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">API Access</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Manage system API keys.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
             <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-white/80">Production Key</p>
                   <p className="text-[10px] font-mono text-white/40 mt-1">sk-prod-****-83ab</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white"><Key className="h-4 w-4" /></Button>
             </div>
             
             <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-white/80">Staging Key</p>
                   <p className="text-[10px] font-mono text-white/40 mt-1">sk-test-****-f921</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white"><Key className="h-4 w-4" /></Button>
             </div>

             <Button variant="outline" className="w-full border-white/20 text-white/80 hover:bg-white/10 rounded uppercase tracking-widest text-[10px] font-bold mt-2">Generate New Key</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
             {[
               { id: "INV-2026-03", date: "Mar 1, 2026", amount: "$4,500.00", status: "Paid" },
               { id: "INV-2026-02", date: "Feb 1, 2026", amount: "$4,500.00", status: "Paid" },
               { id: "INV-2026-01", date: "Jan 1, 2026", amount: "$4,200.00", status: "Paid" }
             ].map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                     <Receipt className="h-4 w-4 text-white/40" />
                     <div>
                        <p className="text-xs font-mono font-bold text-white">{inv.id}</p>
                        <p className="text-[10px] text-white/40">{inv.date}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <p className="text-sm font-mono text-white/80">{inv.amount}</p>
                     <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5">{inv.status}</Badge>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white shrink-0 -mr-2"><FileText className="h-4 w-4" /></Button>
                  </div>
                </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
