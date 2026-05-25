"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Sparkles, BookOpen, Layers, ArrowRight } from "lucide-react"

export function ResearchPage() {
  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full">
        <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Deep Research Mode</h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">Multi-hop legal reasoning & precedent synthesis</p>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-8 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center">
           <Search className="w-6 h-6 text-emerald-400 mx-4" />
           <input 
             type="text" 
             placeholder="e.g., How does Indian consumer law compare to UK consumer law on implicit warranties?" 
             className="bg-transparent flex-1 outline-none text-sm font-serif text-white/90 h-12"
           />
           <button className="h-10 px-6 bg-emerald-500 text-black hover:bg-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
             Synthesize
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-white/[0.02] border-white/10 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none">
             <CardHeader className="pb-2">
               <BookOpen className="w-5 h-5 text-emerald-400 mb-2 opacity-70 group-hover:opacity-100" />
               <CardTitle className="text-sm font-serif italic text-white/90">Statutory Interpretation</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-[10px] text-white/40 leading-relaxed font-mono">Analyze legislative history, debates, and Law Commission reports to determine intent.</p>
             </CardContent>
           </Card>

           <Card className="bg-white/[0.02] border-white/10 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none">
             <CardHeader className="pb-2">
               <Layers className="w-5 h-5 text-emerald-400 mb-2 opacity-70 group-hover:opacity-100" />
               <CardTitle className="text-sm font-serif italic text-white/90">Comparative Jurisdiction</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-[10px] text-white/40 leading-relaxed font-mono">Cross-reference domestic holdings with foreign analogs for persuasive authority.</p>
             </CardContent>
           </Card>

           <Card className="bg-white/[0.02] border-white/10 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none">
             <CardHeader className="pb-2">
               <Sparkles className="w-5 h-5 text-emerald-400 mb-2 opacity-70 group-hover:opacity-100" />
               <CardTitle className="text-sm font-serif italic text-white/90">Opinion Generator</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-[10px] text-white/40 leading-relaxed font-mono">Auto-draft a comprehensive memo ranking authority by binding weight.</p>
             </CardContent>
           </Card>
        </div>

        <div className="pt-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6">Recent Research Threads</h3>
          <div className="space-y-4">
             <div className="border border-white/10 rounded-lg p-5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer flex justify-between items-center group">
               <div>
                 <h4 className="text-sm font-medium text-white/90 mb-1">Constructive Trust in Commercial Lease Default</h4>
                 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">14 Sources Synthesized • 2 Days Ago</p>
               </div>
               <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
             </div>
             <div className="border border-white/10 rounded-lg p-5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer flex justify-between items-center group">
               <div>
                 <h4 className="text-sm font-medium text-white/90 mb-1">Arbitration Clause Severability under 2021 Amendments</h4>
                 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">38 Sources Synthesized • 1 Week Ago</p>
               </div>
               <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
