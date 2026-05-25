"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, FileText, Bot, Clock } from "lucide-react"

export function ReviewPage() {
  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Sign-off Queue</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Pending Document & Strategy Approvals</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono text-emerald-400">03</div>
          <div className="text-[9px] uppercase tracking-tighter opacity-40">Require Action</div>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col space-y-6">
         <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none overflow-hidden">
           <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 bg-white/[0.01]">
             <div className="lg:col-span-8 p-6 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-2">
                 <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono tracking-widest text-[9px] uppercase"><Bot className="w-3 h-3 inline mr-1" /> AI Drafted</Badge>
                 <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted 2h ago</span>
               </div>
               <h3 className="text-xl font-serif italic text-white/90">Client Status Update Email</h3>
               <p className="text-xs text-white/50 font-mono tracking-widest uppercase mt-1">Matrix Corp Defamation Limit</p>
             </div>
             <div className="lg:col-span-4 p-6 border-l border-white/10 flex items-center justify-end gap-2">
               <button className="h-10 px-4 flex items-center justify-center border border-white/20 text-white hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest rounded">
                 Review Track Changes
               </button>
             </div>
           </div>
           <CardContent className="p-0">
             <div className="bg-black/50 p-6 font-mono text-xs text-emerald-100/60 leading-relaxed font-mono relative">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50"></div>
               <p>Dear Client Team,</p>
               <br/>
               <p>We received the defendants brief yesterday afternoon. Our initial ARBITER neural scan indicates they are relying heavily on <del className="text-red-400/80 bg-red-400/10">the statute of limitations defense</del> <span className="text-emerald-400 bg-emerald-400/10">a novel interpretation of the discovery rule under Section 4.A</span>.</p>
               <br/>
               <p>We are currently drafting our opposition and <del className="text-red-400/80 bg-red-400/10">should secure a win</del> <span className="text-emerald-400 bg-emerald-400/10">remain confident in our procedural footing</span>. I will send a full update next Tuesday.</p>
               <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4">
                 <button className="flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-400 hover:text-emerald-300">
                   <CheckCircle2 className="w-4 h-4" /> Approve & Send
                 </button>
                 <button className="flex items-center gap-2 text-[10px] uppercase font-bold text-red-500 hover:text-red-400">
                   <XCircle className="w-4 h-4" /> Reject Draft
                 </button>
               </div>
             </div>
           </CardContent>
         </Card>

         <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none overflow-hidden opacity-70">
           <div className="grid grid-cols-1 lg:grid-cols-12 bg-white/[0.01]">
             <div className="lg:col-span-8 p-6 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-2">
                 <Badge className="bg-white/10 text-white border border-white/20 font-mono tracking-widest text-[9px] uppercase">Associate Draft</Badge>
                 <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted 4h ago</span>
               </div>
               <h3 className="text-xl font-serif italic text-white/90">Motion to Dismiss</h3>
               <p className="text-xs text-white/50 font-mono tracking-widest uppercase mt-1">Estate of V. Richardson • Drafted by M. Tass</p>
             </div>
             <div className="lg:col-span-4 p-6 border-l border-white/10 flex flex-col justify-center gap-2">
               <button className="h-10 px-4 flex items-center justify-center border border-white/20 text-white hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest rounded bg-white/[0.02]">
                 AI Review Required
               </button>
             </div>
           </div>
         </Card>
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`px-2 py-0.5 rounded-full ${className}`}>{children}</span>
}
