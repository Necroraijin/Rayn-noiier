"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BrainCircuit, AlertTriangle, ShieldCheck } from "lucide-react"

export function AIPolicySettings() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">Feature Allocation</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Determine which AI capabilities are active across the firm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
               <div>
                 <p className="text-sm font-bold text-white/90 flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-emerald-400" /> Automated Document Summary</p>
                 <p className="text-xs text-white/50 mt-1">Generates executive summaries from uploaded case files.</p>
               </div>
               <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1 justify-end cursor-pointer">
                 <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
               </div>
             </div>

             <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
               <div>
                 <p className="text-sm font-bold text-white/90 flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-emerald-400" /> Precedent Prediction</p>
                 <p className="text-xs text-white/50 mt-1">Analyzes cross-jurisdiction rulings for win-rate forecasting.</p>
               </div>
               <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1 justify-end cursor-pointer">
                 <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
               </div>
             </div>

             <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
               <div>
                 <p className="text-sm font-bold text-white/90 flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-white/30" /> Auto-Drafting (Experimental)</p>
                 <p className="text-xs text-white/50 mt-1">Creates initial drafts for motions and standard pleadings.</p>
               </div>
               <div className="w-10 h-5 bg-white/10 rounded-full flex items-center px-1 justify-start cursor-pointer">
                 <div className="w-4 h-4 rounded-full bg-white/50 shadow-sm" />
               </div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">Safety & Execution Thresholds</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Configure when human review is categorically required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Minimum Confidence Threshold</Label>
                <span className="font-mono text-emerald-400 text-xs">85%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="85" className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              <p className="text-xs text-white/40 leading-relaxed">Outputs scoring below this value will be automatically flagged for Partner review before being marked as &quot;Client Ready&quot;.</p>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Auto-Escalation Triggers</Label>
              <div className="space-y-2">
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-red-500" /> Mention of criminal liability (Civil cases)</label>
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-emerald-500" /> Exposure estimating &gt; $1M</label>
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-emerald-500" /> Missing precedents from primary jurisdiction</label>
              </div>
            </div>

            <Button className="w-full bg-white text-black hover:bg-white/90 rounded uppercase tracking-widest text-[10px] font-bold">Apply Thresholds</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
