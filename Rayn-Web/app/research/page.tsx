"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Sparkles, BookOpen, Layers, ArrowRight, Loader2, FileText, CheckCircle2, AlertTriangle } from "lucide-react"

export default function ResearchHubPage() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [researchNotes, setResearchNotes] = useState("")
  const [draftedText, setDraftedText] = useState("")
  const [complianceCritique, setComplianceCritique] = useState("")
  const [retrievedDocs, setRetrievedDocs] = useState<{ name: string; key: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"research" | "draft" | "review">("research")

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsSearching(true)
    setError(null)
    setResearchNotes("")
    setDraftedText("")
    setComplianceCritique("")
    setRetrievedDocs([])

    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to execute research pipeline.")
      }

      if (data.success) {
        setResearchNotes(data.researchNotes || "")
        setDraftedText(data.draftedText || "")
        setComplianceCritique(data.complianceCritique || "")
        setRetrievedDocs(data.retrievedDocuments || [])
      } else {
        throw new Error(data.error || "Unsuccessful research execution.")
      }
    } catch (err: any) {
      console.error("Research pipeline error:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleQuickSearch = (queryText: string) => {
    setQuery(queryText)
    setTimeout(() => {
      setQuery(queryText)
      handleSearch()
    }, 100)
  }

  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full">
        <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Deep Research Mode</h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">Multi-hop legal reasoning & precedent synthesis · Powered by AWS Bedrock</p>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-8 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center">
           <Search className="w-6 h-6 text-emerald-400 mx-4" />
           <input 
             type="text" 
             placeholder="e.g., How does Indian consumer law compare to UK consumer law on implicit warranties?" 
             className="bg-transparent flex-1 outline-none text-sm font-serif text-white/90 h-12"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyDown={handleKeyDown}
             disabled={isSearching}
           />
           <button 
             onClick={handleSearch}
             disabled={isSearching || !query.trim()}
             className="h-10 px-6 bg-emerald-500 text-black hover:bg-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
             {isSearching ? "Synthesizing..." : "Synthesize"}
           </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-1">Research Pipeline Error</strong>
              {error}
            </div>
          </div>
        )}

        {!isSearching && !researchNotes && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="bg-white/[0.02] border-white/10 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none" onClick={() => { setQuery("Analyze the applicability of the Indian Limitation Act to civil contract disputes"); }}>
                 <CardHeader className="pb-2">
                   <BookOpen className="w-5 h-5 text-emerald-400 mb-2 opacity-70 group-hover:opacity-100" />
                   <CardTitle className="text-sm font-serif italic text-white/90">Statutory Interpretation</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-[10px] text-white/40 leading-relaxed font-mono">Analyze legislative history, debates, and Law Commission reports to determine intent.</p>
                 </CardContent>
               </Card>

               <Card className="bg-white/[0.02] border-white/10 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none" onClick={() => { setQuery("Compare Indian consumer protection laws with UK consumer law on implied warranties"); }}>
                 <CardHeader className="pb-2">
                   <Layers className="w-5 h-5 text-emerald-400 mb-2 opacity-70 group-hover:opacity-100" />
                   <CardTitle className="text-sm font-serif italic text-white/90">Comparative Jurisdiction</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-[10px] text-white/40 leading-relaxed font-mono">Cross-reference domestic holdings with foreign analogs for persuasive authority.</p>
                 </CardContent>
               </Card>

               <Card className="bg-white/[0.02] border-white/10 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none" onClick={() => { setQuery("Draft a comprehensive legal opinion on the enforceability of non-compete clauses under Indian law"); }}>
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
                 <div className="border border-white/10 rounded-lg p-5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer flex justify-between items-center group" onClick={() => setQuery("Constructive trust in commercial lease default under Indian law")}>
                   <div>
                     <h4 className="text-sm font-medium text-white/90 mb-1">Constructive Trust in Commercial Lease Default</h4>
                     <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">14 Sources Synthesized • 2 Days Ago</p>
                   </div>
                   <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
                 </div>
                 <div className="border border-white/10 rounded-lg p-5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer flex justify-between items-center group" onClick={() => setQuery("Arbitration clause severability under 2021 amendments to the Indian Arbitration and Conciliation Act")}>
                   <div>
                     <h4 className="text-sm font-medium text-white/90 mb-1">Arbitration Clause Severability under 2021 Amendments</h4>
                     <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">38 Sources Synthesized • 1 Week Ago</p>
                   </div>
                   <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
                 </div>
              </div>
            </div>
          </>
        )}

        {isSearching && (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-6" />
            <p className="text-sm font-serif italic text-white/60 mb-2">Synthesizing multi-source research...</p>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Bedrock Claude → Research → Drafting → Compliance Review</p>
          </div>
        )}

        {/* Results Panel */}
        {!isSearching && researchNotes && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Retrieved Sources */}
            {retrievedDocs.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-400/80">Sources Referenced (RAG):</span>
                {retrievedDocs.map((doc, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 bg-white/5 px-2 py-1 rounded border border-white/10">
                    <FileText className="w-3 h-3 text-emerald-500/80" />
                    {doc.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tabbed Results */}
            <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none overflow-hidden">
              <div className="flex border-b border-white/10 bg-black/40">
                <button
                  onClick={() => setActiveTab("research")}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-r border-white/5 transition-colors ${activeTab === "research" ? "bg-white/5 text-emerald-400" : "text-white/40 hover:text-white"}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-2" />
                  Research Brief
                </button>
                <button
                  onClick={() => setActiveTab("draft")}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-r border-white/5 transition-colors ${activeTab === "draft" ? "bg-white/5 text-emerald-400" : "text-white/40 hover:text-white"}`}
                >
                  Drafted Memo
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "review" ? "bg-white/5 text-emerald-400" : "text-white/40 hover:text-white"}`}
                >
                  Compliance Audit
                </button>
              </div>
              <CardContent className="p-6">
                {activeTab === "research" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h4 className="text-xs font-bold font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" /> Bedrock Research Synthesis
                    </h4>
                    <p className="text-xs text-white/80 font-serif leading-relaxed whitespace-pre-wrap">{researchNotes}</p>
                  </div>
                )}
                {activeTab === "draft" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h4 className="text-xs font-bold font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" /> Drafted Legal Memo
                    </h4>
                    <p className="text-xs text-white/80 font-serif leading-relaxed whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/5">{draftedText || "No draft generated."}</p>
                  </div>
                )}
                {activeTab === "review" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h4 className="text-xs font-bold font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-400" /> Compliance Critique
                    </h4>
                    <p className="text-xs text-white/80 font-serif leading-relaxed whitespace-pre-wrap">{complianceCritique || "No compliance critique generated."}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* New Search */}
            <div className="flex justify-center">
              <button 
                onClick={() => { setResearchNotes(""); setDraftedText(""); setComplianceCritique(""); setRetrievedDocs([]); setQuery(""); }}
                className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-colors border border-white/10 hover:border-emerald-500/30 px-4 py-2 rounded-lg"
              >
                ← New Research Query
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
