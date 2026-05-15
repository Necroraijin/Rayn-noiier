"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Network, CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react"

export default function TeamWorkloadPage() {
  const team = [
    { name: "Sarah Jenkins", role: "Senior Associate", utilization: 110, cases: 14, status: "Critical", overdue: 2 },
    { name: "Michael Tass", role: "Associate", utilization: 88, cases: 18, status: "Optimal", overdue: 0 },
    { name: "Jessica R", role: "Associate", utilization: 76, cases: 12, status: "Optimal", overdue: 0 },
    { name: "David S", role: "Trainee", utilization: 45, cases: 4, status: "Underutilized", overdue: 0 },
  ]

  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8">
      <div className="border-b border-white/10 pb-4 w-full flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Team Workload</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Visibility & Resource Allocation</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono text-white/90">2.1x</div>
          <div className="text-[9px] uppercase tracking-tighter opacity-40">Avg Matter Leverage</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         <div className="lg:col-span-8 flex flex-col space-y-6">
            <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/80">Direct Reports Allocation</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                {team.map((member) => (
                  <div key={member.name} className="flex flex-col space-y-3">
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
                      <div>
                        <div className="text-base font-bold text-white/90">{member.name}</div>
                        <div className="text-[10px] font-mono text-white/40 uppercase">{member.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white/90">{member.utilization}%</div>
                        <div className="text-[9px] font-mono text-white/40 uppercase">{member.cases} Open Matters</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${member.utilization > 100 ? "bg-red-500" : member.utilization > 70 ? "bg-emerald-500" : "bg-yellow-500"}`} 
                        style={{ width: `${Math.min(member.utilization, 100)}%` }} 
                      />
                    </div>
                    {member.utilization > 100 && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">
                        <AlertTriangle className="w-3 h-3" /> Burnout Risk Detected
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-4 flex flex-col space-y-6">
            <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
              <CardHeader>
                <CardTitle className="text-xs tracking-widest uppercase font-bold text-emerald-400">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="border border-white/10 bg-white/5 rounded-lg p-4">
                   <p className="text-xs text-white/70 leading-relaxed font-serif">Re-assign <strong className="text-white/90">Estate of V. Richardson</strong> from Sarah Jenkins to Michael Tass.</p>
                   <button className="text-[10px] uppercase tracking-widest font-bold mt-4 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors">
                     Execute Transfer <ArrowRight className="w-3 h-3 ml-1" />
                   </button>
                 </div>
                 <div className="border border-white/10 bg-white/5 rounded-lg p-4">
                   <p className="text-xs text-white/70 leading-relaxed font-serif"><strong className="text-white/90">Techstart Merger</strong> requires more capacity. Assign David S to assist document review.</p>
                   <button className="text-[10px] uppercase tracking-widest font-bold mt-4 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors">
                     Assign Trainee <ArrowRight className="w-3 h-3 ml-1" />
                   </button>
                 </div>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
