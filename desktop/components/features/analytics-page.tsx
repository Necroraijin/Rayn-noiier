"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, TrendingUp, Users, Scale, Clock, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function AnalyticsPage() {
  const { role } = useAuth()

  if (role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in">
        <ShieldAlert className="h-12 w-12 text-red-500/50" />
        <h2 className="text-xl font-serif italic text-white">Access Denied</h2>
        <p className="text-xs uppercase tracking-widest text-white/40 font-mono">This area is restricted to Super Administrators.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 h-full flex flex-col items-start w-full animate-in fade-in">
      <div className="border-b border-white/10 pb-4 w-full">
        <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Firm Analytics</h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">Performance, Accuracy, & Satisfaction Metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-white/40">Avg Time-to-Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-mono text-emerald-50">14.2<span className="text-sm text-emerald-400">mo</span></div>
              <div className="text-[10px] text-emerald-400 font-mono">-2.4 mo YoY</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-white/40">AI Accuracy (Precedents)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-end justify-between">
              <div className="text-4xl font-mono text-emerald-50">96.8<span className="text-sm text-emerald-400">%</span></div>
              <div className="text-[10px] text-emerald-400 font-mono">+1.2% MoM</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-white/40">Lawyer Productivity</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-end justify-between">
              <div className="text-4xl font-mono text-white/90">84<span className="text-sm text-white/40">%</span></div>
              <div className="text-[10px] text-white/40 font-mono">Utilization</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-white/40">Client Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-end justify-between">
              <div className="text-4xl font-mono text-white/90">4.8<span className="text-sm text-white/40">/5.0</span></div>
              <div className="text-[10px] text-emerald-400 font-mono">+0.2 YoY</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-8">
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">Case Outcome Rates by Quarter</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Settlements, judgments, and dismissals across the firm.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-end gap-4 pt-8">
             {/* Mock Chart */}
             {[45, 60, 55, 70, 65, 80, 75, 90].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                   <div className="w-full bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500/40 transition-colors relative" style={{ height: `${val}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-emerald-400">{val}%</div>
                   </div>
                   <div className="text-[9px] font-mono text-white/40 uppercase">Q{i%4+1}</div>
                </div>
             ))}
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
           <CardHeader>
             <CardTitle className="text-lg font-light font-serif italic text-white/90">Top Performing Partners</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-6">
                {[
                  { name: "Jessica R.", metric: "92% Win Rate", stat: "14 Cases" },
                  { name: "David S.", metric: "88% Win Rate", stat: "18 Cases" },
                  { name: "Michael T.", metric: "85% Win Rate", stat: "22 Cases" },
                  { name: "Sarah L.", metric: "81% Win Rate", stat: "15 Cases" },
                ].map((person, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white/80">{person.name.substring(0,2)}</div>
                        <div>
                          <p className="text-xs font-bold text-white/90">{person.name}</p>
                          <p className="text-[9px] font-mono text-white/40">{person.stat}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-mono text-emerald-400">{person.metric}</span>
                  </div>
                ))}
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
