"use client"

import React from "react"
import { CheckSquare, Clock, AlertTriangle, AlertCircle } from "lucide-react"

export default function TasksPage() {
  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Task Manager</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">My Assignments & Delegated Items</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
          New Task
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 w-full">
         <div className="col-span-8 flex flex-col space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-bold text-white/40">My Queue</h2>
            
            <div className="space-y-3">
               <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start justify-between cursor-pointer hover:bg-white/[0.08] transition-colors">
                 <div className="flex items-start gap-4">
                    <button className="mt-0.5 min-w-5">
                      <div className="w-5 h-5 rounded border-2 border-white/20 hover:border-emerald-500 transition-colors"></div>
                    </button>
                    <div>
                      <h4 className="text-sm font-medium text-white/90">Draft Settlement Agreement</h4>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Matter: Smith v. OmniCorp (Case #4029)</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-red-400"><AlertCircle className="w-3 h-3" /> High Priority</span>
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-yellow-400"><Clock className="w-3 h-3" /> Due Today</span>
                      </div>
                    </div>
                 </div>
                 <div className="text-[9px] uppercase tracking-widest text-white/30 text-right">
                   Assigned By:<br/>
                   <span className="text-white/60">Partner_RJ</span>
                 </div>
               </div>

               <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start justify-between cursor-pointer hover:bg-white/[0.08] transition-colors">
                 <div className="flex items-start gap-4">
                    <button className="mt-0.5 min-w-5">
                      <div className="w-5 h-5 rounded border-2 border-white/20 hover:border-emerald-500 transition-colors"></div>
                    </button>
                    <div>
                      <h4 className="text-sm font-medium text-white/90">Review Discovery Documents (Batch A)</h4>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Matter: Estate of V. Richardson</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-emerald-400"><Clock className="w-3 h-3" /> Due in 3 days</span>
                      </div>
                    </div>
                 </div>
                 <div className="text-[9px] uppercase tracking-widest text-white/30 text-right">
                   Assigned By:<br/>
                   <span className="text-white/60">Senior_Assoc_LJ</span>
                 </div>
               </div>

               <div className="opacity-50 line-through bg-black/20 border border-white/5 rounded-lg p-4 flex items-start justify-between">
                 <div className="flex items-start gap-4">
                    <button className="mt-0.5 min-w-5 cursor-default">
                      <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                        <CheckSquare className="w-3 h-3 text-black" />
                      </div>
                    </button>
                    <div>
                      <h4 className="text-sm font-medium text-white/90">Client Call Prep</h4>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Matter: Techstart Merger</p>
                    </div>
                 </div>
               </div>
            </div>
         </div>

         <div className="col-span-4 flex flex-col space-y-6">
           <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 flex-col flex h-full">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
               Workload Intelligence
             </h3>
             <div className="flex-1 space-y-6">
                <div>
                   <div className="flex justify-between text-[10px] font-mono uppercase mb-2 text-white/60">
                     <span>Current Capacity</span>
                     <span className="text-emerald-400">Optimal (84%)</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400 w-[84%]" />
                   </div>
                </div>

                <div className="border border-yellow-500/20 bg-yellow-500/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Deadline Clustering</h4>
                  </div>
                  <p className="text-[10px] font-mono text-yellow-100/60 leading-relaxed uppercase tracking-widest mt-1 text-justify">
                    You have 3 major deliverables due this Thursday. ARBITER suggests requesting a 24-hour extension on the OmniCorp brief.
                  </p>
                  <button className="mt-3 text-[9px] font-bold uppercase tracking-widest text-yellow-400 hover:text-yellow-300">Draft Request</button>
                </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  )
}
