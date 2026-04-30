"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link2, Cloud, Database } from "lucide-react"

export function IntegrationSettings() {
  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div className="border-b border-white/5 pb-4 mb-6">
         <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">External Bridges</h3>
         <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Connect Rayn ARBITER to your existing stack.</p>
      </div>

      <div className="space-y-4">
         <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center shrink-0 text-blue-400 font-bold text-xs">LEX</div>
               <div>
                 <h4 className="font-bold text-white/90 text-sm">LexisNexis Interaction</h4>
                 <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1 font-mono">Sync precedents and client data</p>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Input type="password" value="**************" disabled className="bg-black/50 border-white/10 h-9 font-mono text-xs w-full md:w-48 disabled:opacity-50" />
               <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded h-9 uppercase tracking-widest text-[9px] font-bold shrink-0">Connected</Button>
            </div>
         </div>

         <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center shrink-0 text-purple-400 font-bold text-[10px]">CLIO</div>
               <div>
                 <h4 className="font-bold text-white/90 text-sm">Clio Manage</h4>
                 <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1 font-mono">Billing & matter sync</p>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Input type="text" placeholder="Paste API Key here..." className="bg-black/50 border-white/10 h-9 font-mono text-xs w-full md:w-48 focus-visible:ring-emerald-500" />
               <Button className="bg-white text-black hover:bg-white/90 rounded h-9 uppercase tracking-widest text-[9px] font-bold shrink-0">Connect</Button>
            </div>
         </div>

         <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 opacity-50 grayscale">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center shrink-0 text-orange-400"><Database className="h-5 w-5" /></div>
               <div>
                 <h4 className="font-bold text-white/90 text-sm">iManage Work</h4>
                 <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1 font-mono">Document Management System</p>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Button disabled variant="outline" className="border-white/20 text-white/40 rounded h-9 uppercase tracking-widest text-[9px] font-bold shrink-0">Coming Q4</Button>
            </div>
         </div>
      </div>
    </div>
  )
}
