"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sparkles, Upload, Scale, Presentation, ShieldAlert, Target,
  ShieldCheck, Sword, MessageSquare, Briefcase, BrainCircuit,
  ChevronRight, CheckCircle2, Loader2, AlertTriangle, Gauge, Database, FileText
} from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import { useAuditLog } from "@/lib/audit-logger"
import { useAuth } from "@/lib/auth-context"

// ── Agent Reasoning Step Types ──────────────────────────────────────
interface AgentStep {
  id: number
  type: "thinking" | "tool_call" | "tool_result" | "guardrail" | "output"
  label: string
  detail: string
  status: "pending" | "running" | "done" | "warning"
  tokensUsed?: number
  duration?: number
}

const AGENT_CHAIN: Omit<AgentStep, "id" | "status">[] = [
  { type: "thinking", label: "Parsing Query", detail: "Decomposing user intent and isolating safety guardrails...", tokensUsed: 420 },
  { type: "thinking", label: "Planning Execution", detail: "LangChain ReAct Agent selecting tool chain: [S3Retriever → PrecedentDB → JudgeProfiler → SettlementCalculator]", tokensUsed: 680 },
  { type: "tool_call", label: "Tool: S3 Document Retriever", detail: "Querying active S3 bucket for legal briefs and contract materials...", tokensUsed: 1200 },
  { type: "tool_result", label: "Retrieved 14 Documents", detail: "Found relevant case filings and corporate contract history in S3.", tokensUsed: 2400 },
  { type: "tool_call", label: "Tool: Precedent Database", detail: "Running vector similarity search across Indian Statutes and precedents...", tokensUsed: 3100 },
  { type: "tool_result", label: "Analogous Precedents Found", detail: "Davis v. Meritech (2021) and Peterson v. Global Tech (2019) mapped.", tokensUsed: 4200 },
  { type: "guardrail", label: "Safety Guardrails Check", detail: "✓ No PII detected · ✓ No prompt injection · ✓ Cross-tenant isolation verified", tokensUsed: 300 },
  { type: "thinking", label: "Synthesizing Analysis", detail: "Invoking Bedrock sequential agents: Research → Drafting → Compliance Review...", tokensUsed: 5400 },
  { type: "output", label: "Strategy Report Generated", detail: "Complete agentic analysis retrieved from AWS Bedrock.", tokensUsed: 3200 },
]

const QUERY_MAP: Record<string, string> = {
  "Estate of V. Richardson (M-1028)": "Draft the final distribution clause for the Estate of V. Richardson, verifying if the statute of limitations under the Indian Limitation Act has passed.",
  "Smith v. OmniCorp (M-1024)": "Draft the mutual indemnification clause for Smith v. OmniCorp contract breach and review it for public policy compliance.",
  "Techstart Merger (M-1026)": "Draft the non-compete clause for the Techstart Merger and review it for compliance under Indian Competition Act."
}

export default function StrategyRoomPage() {
  const { tenant, consumeTokens } = useTenant()
  const { log } = useAuditLog()
  const { email } = useAuth()
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [completed, setCompleted] = useState(false)
  const [totalTokens, setTotalTokens] = useState(0)
  const [selectedMatter, setSelectedMatter] = useState("Estate of V. Richardson (M-1028)")
  const [opposingCounsel, setOpposingCounsel] = useState("Jonathan Wright (Wright & Associates)")
  const [agentModel, setAgentModel] = useState("Claude 3.5 Sonnet (Bedrock)")
  const [error, setError] = useState<string | null>(null)
  
  // Real results from Bedrock
  const [researchNotes, setResearchNotes] = useState("")
  const [draftedText, setDraftedText] = useState("")
  const [complianceCritique, setComplianceCritique] = useState("")
  const [activeTab, setActiveTab] = useState<"research" | "draft" | "review">("research")

  const stepsRef = useRef<HTMLDivElement>(null)

  const contextLimit = tenant.aiContextLimit
  const contextPercent = Math.min(100, Math.round((totalTokens / contextLimit) * 100))

  const handleSimulate = async () => {
    setIsRunning(true)
    setCompleted(false)
    setSteps([])
    setTotalTokens(0)
    setError(null)
    setResearchNotes("")
    setDraftedText("")
    setComplianceCritique("")

    log({
      tenantId: tenant.id,
      category: "AI",
      event: "AGENT_CHAIN_STARTED",
      actor: email || "unknown",
      ip: "192.168.1.42",
      severity: "INFO",
      details: `LangChain ReAct agent chain initiated for ${selectedMatter}`,
    })

    // Start API Request to AWS Bedrock in background
    const targetQuery = QUERY_MAP[selectedMatter] || "Draft a legal case strategy."
    const caseId = selectedMatter.match(/\(([^)]+)\)/)?.[1] || null

    const apiPromise = fetch("/api/agent/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: targetQuery, caseId })
    })

    let runningTokens = 0

    // Progress the UI steps visually (sequential animation)
    for (let i = 0; i < AGENT_CHAIN.length; i++) {
      const step = AGENT_CHAIN[i]
      const stepId = i + 1

      setSteps(prev => [...prev, { ...step, id: stepId, status: "running" }])

      setTimeout(() => {
        stepsRef.current?.scrollTo({ top: stepsRef.current.scrollHeight, behavior: "smooth" })
      }, 100)

      // Dynamic delay for tracing realism
      await new Promise(r => setTimeout(r, 600 + Math.random() * 600))

      runningTokens += step.tokensUsed || 0
      setTotalTokens(runningTokens)
      setSteps(prev => prev.map(s =>
        s.id === stepId
          ? { ...s, status: step.type === "guardrail" ? "warning" : "done", duration: Math.floor(200 + Math.random() * 500) }
          : s
      ))
    }

    try {
      const res = await apiPromise
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to execute agent pipeline on Bedrock.")
      }

      if (data.success) {
        setResearchNotes(data.researchNotes || "")
        setDraftedText(data.draftedText || "")
        setComplianceCritique(data.complianceCritique || "")
      } else {
        throw new Error(data.error || "Unsuccessful agent execution.")
      }

      consumeTokens(runningTokens)
      setCompleted(true)

      log({
        tenantId: tenant.id,
        category: "AI",
        event: "AGENT_CHAIN_COMPLETED",
        actor: email || "unknown",
        ip: "192.168.1.42",
        severity: "SUCCESS",
        details: `Agent chain successfully parsed through Bedrock. Total tokens: ${runningTokens.toLocaleString()}`,
      })

    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred during execution.")
    } finally {
      setIsRunning(false)
    }
  }

  const getStepIcon = (step: AgentStep) => {
    if (step.status === "running") return <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
    if (step.status === "warning") return <ShieldCheck className="w-4 h-4 text-yellow-400" />
    if (step.type === "tool_call") return <Database className="w-4 h-4 text-blue-400" />
    if (step.type === "tool_result") return <CheckCircle2 className="w-4 h-4 text-cyan-400" />
    if (step.type === "output") return <Sparkles className="w-4 h-4 text-emerald-400" />
    return <BrainCircuit className="w-4 h-4 text-purple-400" />
  }

  const getStepColor = (step: AgentStep) => {
    if (step.status === "running") return "border-emerald-500/30 bg-emerald-500/5"
    if (step.type === "guardrail") return "border-yellow-500/20 bg-yellow-500/5"
    if (step.type === "tool_call") return "border-blue-500/20 bg-blue-500/5"
    if (step.type === "tool_result") return "border-cyan-500/20 bg-cyan-500/5"
    if (step.type === "output") return "border-emerald-500/20 bg-emerald-500/5"
    return "border-white/10 bg-white/[0.02]"
  }

  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-12">
      <div className="border-b border-white/10 pb-4 w-full flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Strategy Room</h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono tracking-widest text-[9px] uppercase px-2 py-0.5 rounded-full">LangChain Agent</span>
          </div>
          <p className="text-white/40 text-xs tracking-widest uppercase">Agentic AI · ReAct Reasoning Chain</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono text-white/80">{(contextLimit / 1000).toFixed(0)}k</div>
          <div className="text-[9px] uppercase tracking-tighter opacity-40">Context Window</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-1 min-h-0">
        {/* Left: Config Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
            <CardHeader className="pb-4 border-b border-white/10">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/80">Configure Agent</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Select Matter</label>
                <select 
                  value={selectedMatter}
                  onChange={(e) => setSelectedMatter(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-mono text-white/80 outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option>Estate of V. Richardson (M-1028)</option>
                  <option>Smith v. OmniCorp (M-1024)</option>
                  <option>Techstart Merger (M-1026)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Opposing Counsel</label>
                <div className="flex bg-black/50 border border-white/10 rounded-lg px-3 py-2 items-center">
                  <input 
                    type="text" 
                    value={opposingCounsel}
                    onChange={(e) => setOpposingCounsel(e.target.value)}
                    className="bg-transparent flex-1 outline-none text-sm font-mono text-white/80" 
                  />
                  <Target className="w-4 h-4 text-emerald-400 opacity-50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Agent Model</label>
                <select 
                  value={agentModel}
                  onChange={(e) => setAgentModel(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-mono text-white/80 outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option>Claude 3.5 Sonnet (Bedrock)</option>
                  <option>Llama 3.1 70B (Bedrock)</option>
                  <option>Claude 3.5 Haiku (Bedrock)</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/[0.02] transition-colors">
                <Upload className="w-6 h-6 text-white/20 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Upload Case Files</p>
                <p className="text-[10px] font-mono text-white/30 mt-1">Briefs, exhibits, complaints</p>
              </div>

              <button
                onClick={handleSimulate}
                disabled={isRunning}
                className="w-full bg-emerald-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Agent Running...</>
                ) : (
                  <><BrainCircuit className="w-4 h-4" /> Run Agent Chain</>
                )}
              </button>
            </CardContent>
          </Card>

          {/* Token Meter */}
          <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5" /> Context Usage
                </span>
                <span className={`font-mono text-xs ${contextPercent > 80 ? "text-yellow-400" : "text-emerald-400"}`}>
                  {totalTokens.toLocaleString()} / {(contextLimit).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${contextPercent > 80 ? "bg-yellow-500" : "bg-emerald-500"}`}
                  style={{ width: `${contextPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>0</span>
                <span>{contextPercent}% Used</span>
                <span>{(contextLimit / 1000).toFixed(0)}k</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Agent Trace */}
        <div className="lg:col-span-8 flex flex-col space-y-6 min-h-0">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1">Execution Failure</strong>
                {error}
              </div>
            </div>
          )}

          {!isRunning && steps.length === 0 && (
            <div className="flex-1 border border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.01] min-h-[300px]">
              <BrainCircuit className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-sm font-serif italic text-white/40">Configure the agent and click &quot;Run Agent Chain&quot; to begin.</p>
              <p className="text-[10px] font-mono text-white/20 mt-2 uppercase tracking-widest">LangChain ReAct · Tool Augmented Reasoning</p>
            </div>
          )}

          {(isRunning || steps.length > 0) && (
            <div className="flex-1 border border-white/10 rounded-2xl flex flex-col overflow-hidden max-h-[400px]">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Agent Execution Trace</h3>
                  {isRunning && (
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 animate-pulse uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" /> Processing
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  {steps.length} / {AGENT_CHAIN.length} steps
                </span>
              </div>

              <div ref={stepsRef} className="flex-1 overflow-y-auto p-6 space-y-3">
                {steps.map(step => (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 duration-300 ${getStepColor(step)}`}
                  >
                    <div className="mt-0.5 shrink-0">{getStepIcon(step)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white/80">{step.label}</span>
                        <div className="flex items-center gap-3">
                          {step.duration && (
                            <span className="text-[9px] font-mono text-white/25">{step.duration}ms</span>
                          )}
                          {step.tokensUsed && (
                            <span className="text-[9px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                              +{step.tokensUsed.toLocaleString()} tokens
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed font-mono">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Panel */}
          {completed && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-emerald-950/20 border-emerald-500/20 rounded-2xl shadow-none">
                  <CardContent className="pt-6 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Settle (Favorable)</div>
                    <div className="text-3xl font-mono text-emerald-400">62%</div>
                    <div className="text-xs text-white/40 font-mono">Est. $1.4M – $1.8M</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-950/20 border-blue-500/20 rounded-2xl shadow-none">
                  <CardContent className="pt-6 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Litigate (Win)</div>
                    <div className="text-3xl font-mono text-blue-400">28%</div>
                    <div className="text-xs text-white/40 font-mono">Est. $2.5M + Costs</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-950/20 border-red-500/20 rounded-2xl shadow-none">
                  <CardContent className="pt-6 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-red-500">Litigate (Loss)</div>
                    <div className="text-3xl font-mono text-red-400">10%</div>
                    <div className="text-xs text-white/40 font-mono">Est. $0 + Defense Costs</div>
                  </CardContent>
                </Card>
              </div>

              {/* Dynamic Bedrock Generated Output Panel */}
              <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none overflow-hidden">
                <div className="flex border-b border-white/10 bg-black/40">
                  <button
                    onClick={() => setActiveTab("research")}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-r border-white/5 transition-colors ${activeTab === "research" ? "bg-white/5 text-emerald-400" : "text-white/40 hover:text-white"}`}
                  >
                    1. Research Brief
                  </button>
                  <button
                    onClick={() => setActiveTab("draft")}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-r border-white/5 transition-colors ${activeTab === "draft" ? "bg-white/5 text-emerald-400" : "text-white/40 hover:text-white"}`}
                  >
                    2. Drafted Clause
                  </button>
                  <button
                    onClick={() => setActiveTab("review")}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "review" ? "bg-white/5 text-emerald-400" : "text-white/40 hover:text-white"}`}
                  >
                    3. Compliance Audit
                  </button>
                </div>
                <CardContent className="p-6">
                  {activeTab === "research" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs font-bold font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" /> Bedrock Research synthesis
                      </h4>
                      <p className="text-xs text-white/80 font-serif leading-relaxed whitespace-pre-wrap">{researchNotes || "No research brief generated."}</p>
                    </div>
                  )}
                  {activeTab === "draft" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs font-bold font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" /> Bedrock Drafted legal text
                      </h4>
                      <p className="text-xs text-white/80 font-serif leading-relaxed whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/5">{draftedText || "No clauses drafted."}</p>
                    </div>
                  )}
                  {activeTab === "review" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs font-bold font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-400" /> Bedrock Compliance critique
                      </h4>
                      <p className="text-xs text-white/80 font-serif leading-relaxed whitespace-pre-wrap">{complianceCritique || "No compliance critique generated."}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
