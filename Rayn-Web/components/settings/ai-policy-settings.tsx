"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BrainCircuit, AlertTriangle, ShieldCheck, Gauge, Users } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors cursor-pointer ${enabled ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"}`}>
      <div className={`w-4 h-4 rounded-full shadow-sm transition-colors ${enabled ? "bg-white" : "bg-white/50"}`} />
    </button>
  )
}

const ROLE_CONTEXT_LIMITS = [
  { role: "Super Admin", limit: 100, color: "emerald" },
  { role: "Equity Partner", limit: 100, color: "emerald" },
  { role: "Salaried Partner", limit: 80, color: "emerald" },
  { role: "Counsel", limit: 70, color: "blue" },
  { role: "Senior Associate", limit: 60, color: "blue" },
  { role: "Associate", limit: 50, color: "blue" },
  { role: "Junior Associate", limit: 30, color: "yellow" },
  { role: "Paralegal", limit: 25, color: "yellow" },
  { role: "Billing Admin", limit: 20, color: "white" },
  { role: "Guest Client", limit: 10, color: "white" },
]

export function AIPolicySettings() {
  const { tenant } = useTenant()
  const [docSummary, setDocSummary] = useState(true)
  const [precedentPrediction, setPrecedentPrediction] = useState(true)
  const [autoDrafting, setAutoDrafting] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState(85)
  const [roleLimits, setRoleLimits] = useState(ROLE_CONTEXT_LIMITS)

  const updateRoleLimit = (role: string, newLimit: number) => {
    setRoleLimits(prev => prev.map(r => r.role === role ? { ...r, limit: newLimit } : r))
  }

  const maxContext = tenant.aiContextLimit / 1000 // in k

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {/* Feature Allocation */}
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
              <Toggle enabled={docSummary} onToggle={() => setDocSummary(!docSummary)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
              <div>
                <p className="text-sm font-bold text-white/90 flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-emerald-400" /> Precedent Prediction</p>
                <p className="text-xs text-white/50 mt-1">Analyzes cross-jurisdiction rulings for win-rate forecasting.</p>
              </div>
              <Toggle enabled={precedentPrediction} onToggle={() => setPrecedentPrediction(!precedentPrediction)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
              <div>
                <p className="text-sm font-bold text-white/90 flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-white/30" /> Auto-Drafting (Experimental)</p>
                <p className="text-xs text-white/50 mt-1">Creates initial drafts for motions and standard pleadings.</p>
              </div>
              <Toggle enabled={autoDrafting} onToggle={() => setAutoDrafting(!autoDrafting)} />
            </div>
          </CardContent>
        </Card>

        {/* Safety & Execution Thresholds */}
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">Safety & Execution Thresholds</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Configure when human review is categorically required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Minimum Confidence Threshold</Label>
                <span className="font-mono text-emerald-400 text-xs">{confidenceThreshold}%</span>
              </div>
              <input
                type="range" min="50" max="100"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-white/40 leading-relaxed">
                Outputs scoring below this value will be automatically flagged for Partner review before being marked as &quot;Client Ready&quot;.
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Auto-Escalation Triggers</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-red-500" /> Mention of criminal liability (Civil cases)</label>
                <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-emerald-500" /> Exposure estimating &gt; $1M</label>
                <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-emerald-500" /> Missing precedents from primary jurisdiction</label>
                <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" className="accent-yellow-500" /> Conflicting advice across practice areas</label>
              </div>
            </div>

            <Button className="w-full bg-white text-black hover:bg-white/90 rounded uppercase tracking-widest text-[10px] font-bold">Apply Thresholds</Button>
          </CardContent>
        </Card>
      </div>

      {/* Context Limits Per Role */}
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-light font-serif italic text-white/90 flex items-center gap-3">
                <Gauge className="h-5 w-5 text-emerald-400" /> AI Context Limits by Role
              </CardTitle>
              <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">
                Set the maximum percentage of the tenant&apos;s {maxContext}k context window each role can use per request.
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono text-emerald-400">{maxContext}k</div>
              <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Max Context</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {roleLimits.map(item => {
              const actualTokens = Math.round((item.limit / 100) * tenant.aiContextLimit)
              return (
                <div key={item.role} className="flex items-center gap-4">
                  <div className="w-36 shrink-0">
                    <div className="text-xs font-bold text-white/80">{item.role}</div>
                    <div className="text-[9px] font-mono text-white/30 mt-0.5">{(actualTokens / 1000).toFixed(0)}k tokens</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="range" min="5" max="100"
                      value={item.limit}
                      onChange={(e) => updateRoleLimit(item.role, Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-mono text-white/60">{item.limit}%</div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-4 border border-white/5 rounded-lg bg-black/20">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono leading-relaxed">
              Context limits are enforced at the API gateway level. Users exceeding their allocation will receive a truncation warning.
              Super Admins can override limits for specific matters on a case-by-case basis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
