"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Receipt, Search, FileText, CheckCircle2, Clock } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Timesheets & Billing</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Pre-bill review and write-offs</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 w-full">
         <div className="col-span-8 flex flex-col space-y-6">
            <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
              <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/80">Pending Proformas</CardTitle>
                <div className="flex bg-black/50 border border-white/10 rounded px-3 py-1 items-center w-64 max-w-full">
                  <Search className="w-3 h-3 text-white/40 mr-2" />
                  <input type="text" placeholder="Search clients..." className="bg-transparent flex-1 outline-none text-[10px] font-mono text-white tracking-widest" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                 <table className="w-full text-left text-sm">
                   <thead>
                     <tr className="border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">
                       <th className="p-4 font-medium">Client / Matter</th>
                       <th className="p-4 font-medium">Unbilled Hours</th>
                       <th className="p-4 font-medium">Pre-bill Amt</th>
                       <th className="p-4 font-medium">Status</th>
                       <th className="p-4"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-white/80 font-mono text-[11px]">
                     <tr className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-4">
                         <strong className="text-white">OmniCorp</strong>
                         <p className="text-white/40 mt-1">1024 - Techstart Merger</p>
                       </td>
                       <td className="p-4">124.5</td>
                       <td className="p-4">$104,250.00</td>
                       <td className="p-4">
                         <span className="flex items-center gap-1 text-yellow-400"><Clock className="w-3 h-3" /> Partner Review</span>
                       </td>
                       <td className="p-4 text-right">
                         <button className="border border-white/20 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Review</button>
                       </td>
                     </tr>
                     <tr className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-4">
                         <strong className="text-white">Global Tech Inc.</strong>
                         <p className="text-white/40 mt-1">2048 - Patent Defense</p>
                       </td>
                       <td className="p-4">45.0</td>
                       <td className="p-4">$36,500.00</td>
                       <td className="p-4">
                         <span className="flex items-center gap-1 text-yellow-400"><Clock className="w-3 h-3" /> Partner Review</span>
                       </td>
                         <td className="p-4 text-right">
                         <button className="border border-white/20 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Review</button>
                       </td>
                     </tr>
                   </tbody>
                 </table>
              </CardContent>
            </Card>
         </div>
         
         <div className="col-span-4 space-y-6">
            <Card className="bg-emerald-950/20 border-emerald-500/20 rounded-2xl shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Total Unbilled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-mono text-emerald-50 mb-1">$140,750</div>
                <div className="text-[10px] text-emerald-400/80 font-mono">Current Month</div>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
