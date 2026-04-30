"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Upload, Scale, Presentation, ShieldAlert, Target, ShieldCheck, Sword, MessageSquare, Briefcase } from "lucide-react"

export default function StrategyRoomPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const handleSimulate = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setAnalyzed(true)
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8">
      <div className="border-b border-white/10 pb-4 w-full flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Strategy Room</h1>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono tracking-widest text-[9px] uppercase">Arbiter v2.4</Badge>
          </div>
          <p className="text-white/40 text-xs tracking-widest uppercase">Predictive AI Modeling & Case Theory</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 w-full">
        <div className="col-span-4 space-y-6">
          <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
            <CardHeader className="pb-4 border-b border-white/10">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/80">Configure Simulation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Select Matter</label>
                <select className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm font-mono text-white/80 outline-none">
                  <option>Estate of V. Richardson</option>
                  <option>Global Tech Inc. v. Peterson</option>
                  <option>Techstart Merger</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Opposing Counsel</label>
                <div className="flex bg-black/50 border border-white/10 rounded px-3 py-2 items-center">
                  <input type="text" defaultValue="Jonathan Wright (Wright & Associates)" className="bg-transparent flex-1 outline-none text-sm font-mono text-white/80" />
                  <Target className="w-4 h-4 text-emerald-400 opacity-50" />
                </div>
              </div>

              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/[0.02] transition-colors">
                <Upload className="w-8 h-8 text-white/20 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Upload Case Files</p>
                <p className="text-[10px] font-mono text-white/40 mt-1">Briefs, exhibits, complaints</p>
              </div>

              <button 
                onClick={handleSimulate}
                disabled={analyzing}
                className="w-full bg-emerald-500 text-black py-4 rounded font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                   <>
                     <Sparkles className="w-4 h-4 animate-spin" />
                     Synthesizing Case...
                   </>
                ) : (
                   <>
                     <Scale className="w-4 h-4" />
                     Run Strategy Simulation
                   </>
                )}
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-8 flex flex-col space-y-6">
          {!analyzed && !analyzing && (
            <div className="flex-1 border border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.01]">
               <Sparkles className="w-12 h-12 text-white/10 mb-4" />
               <p className="text-sm font-serif italic text-white/40">Select a matter to begin strategic analysis.</p>
            </div>
          )}

          {analyzing && (
            <div className="flex-1 border border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.01] space-y-4">
               <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-1/3 animate-[slide_1.5s_ease-in-out_infinite]" />
               </div>
               <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest animate-pulse">Running Monte Carlo Outcome Simulation...</p>
            </div>
          )}

          {analyzed && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-2 gap-6">
                 <Card className="bg-emerald-950/20 border-emerald-500/20 rounded-2xl shadow-none">
                   <CardHeader className="pb-2">
                     <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-emerald-500 flex items-center gap-2">
                       <Presentation className="h-3 w-3" />
                       Theory of the Case
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-white/80 leading-relaxed font-serif">
                       The plaintiff&apos;s claim hinges on constructive trust. Our strongest path is arguing statute of limitations based on the 2018 correspondence, neutralizing their fiduciary duty angle completely.
                     </p>
                   </CardContent>
                 </Card>

                 <Card className="bg-red-950/20 border-red-500/20 rounded-2xl shadow-none">
                   <CardHeader className="pb-2">
                     <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-red-500 flex items-center gap-2">
                       <ShieldAlert className="h-3 w-3" />
                       Primary Vulnerability
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-white/80 leading-relaxed font-serif">
                       Opposing counsel will likely exploit the missing Appendix B in the 2019 contract amendment. We must proactively establish established course of dealing to mitigate this gap.
                     </p>
                   </CardContent>
                 </Card>
               </div>

               <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
                 <CardHeader className="border-b border-white/10">
                   <CardTitle className="text-sm font-serif italic text-white/90">Outcome Probability Board</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 grid grid-cols-3 gap-8">
                   <div className="space-y-3">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Settle (Favorable)</div>
                     <div className="text-4xl font-mono text-emerald-400">62%</div>
                     <div className="text-xs text-white/60 font-mono">Est. $1.4M - $1.8M</div>
                   </div>
                   <div className="space-y-3">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Litigate (Win)</div>
                     <div className="text-4xl font-mono text-blue-400">28%</div>
                     <div className="text-xs text-white/60 font-mono">Est. $2.5M + Costs</div>
                   </div>
                   <div className="space-y-3">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Litigate (Loss)</div>
                     <div className="text-4xl font-mono text-red-400">10%</div>
                     <div className="text-xs text-white/60 font-mono">Est. $0 + Defense Costs</div>
                   </div>
                 </CardContent>
               </Card>

               <div className="grid grid-cols-2 gap-6">
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                      <Sword className="h-3 w-3" />
                      Opposing Counsel Profiler
                    </h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-yellow-500/50 pl-3">
                        <strong className="text-xs font-mono text-white/80 block">Aggressive Discovery </strong>
                        <span className="text-[10px] text-white/40 font-serif">Wright is known for broad discovery requests early on to force settlements. (74% settlement rate pre-trial).</span>
                      </div>
                      <div className="border-l-2 border-emerald-500/50 pl-3">
                        <strong className="text-xs font-mono text-white/80 block">Weakness: Procedural Defenses</strong>
                        <span className="text-[10px] text-white/40 font-serif">Historically struggles with complex procedural hurdles; lost 3 recent SJ motions on technicalities.</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                      <Briefcase className="h-3 w-3" />
                      Precedent Intelligence
                    </h3>
                    <div className="space-y-3 font-mono text-xs text-emerald-100/60 break-words leading-relaxed">
                      <p className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                        <span className="text-emerald-400 font-bold block mb-1">Davis v. Meritech (2021)</span>
                        Perfect analog for our SL angle. The court ruled 1990 correspondence insufficient to toll limitations. Highly persuasive in our jurisdiction.
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`px-2 py-0.5 rounded-full ${className}`}>{children}</span>
}
