"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, AlertCircle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"

export default function ClientsPage() {
  const clients = [
    { name: "OmniCorp", industry: "Technology", score: "Healthy", trend: "up", revenue: "$450k", activeMatters: 3, lastContact: "2 days ago" },
    { name: "Estate of V. Richardson", industry: "Private Wealth", score: "At Risk", trend: "down", revenue: "$120k", activeMatters: 1, lastContact: "14 days ago" },
    { name: "Global Tech Inc.", industry: "Technology", score: "Review Needed", trend: "down", revenue: "$850k", activeMatters: 5, lastContact: "5 days ago" },
    { name: "Apex Dynamics", industry: "Manufacturing", score: "Healthy", trend: "up", revenue: "$310k", activeMatters: 2, lastContact: "1 day ago" },
  ]

  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Client Portfolio</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Relationship Intelligence & Metrics</p>
        </div>
      </div>

      <div className="w-full flex justify-between items-center bg-white/[0.02] border border-white/10 rounded-xl p-4">
         <div className="flex bg-black/50 border border-white/10 rounded px-3 py-2 items-center w-96 max-w-full">
            <Search className="w-4 h-4 text-white/40 mr-2" />
            <input type="text" placeholder="Search portfolio..." className="bg-transparent flex-1 outline-none text-xs font-mono text-white tracking-widest uppercase" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
         {clients.map((client) => (
           <Card key={client.name} className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
             <CardHeader className="pb-4">
               <div className="flex justify-between items-start">
                 <div>
                   <CardTitle className="text-xl font-serif italic text-white/90">{client.name}</CardTitle>
                   <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">{client.industry}</p>
                 </div>
                 {client.score === "Healthy" ? (
                   <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 ) : (
                   <AlertCircle className={`w-5 h-5 ${client.score === "At Risk" ? 'text-red-500' : 'text-yellow-500'}`} />
                 )}
               </div>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-white/40">YTD Revenue</div>
                    <div className="text-lg font-mono text-white/90">{client.revenue}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-white/40">Active Matters</div>
                    <div className="text-lg font-mono text-white/90">{client.activeMatters}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-white/40">Health Score</span>
                    <span className={client.score === "Healthy" ? "text-emerald-400" : client.score === "At Risk" ? "text-red-400" : "text-yellow-400"}>
                      {client.score}
                    </span>
                  </div>
                   <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-white/40">Last Contact</span>
                    <span className="text-white/60">{client.lastContact}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
                    View Dossier
                  </button>
                </div>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  )
}
