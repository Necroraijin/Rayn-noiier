"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Save, FileText, CheckCircle2, History, Pencil, PenTool } from "lucide-react"

export default function DraftingStudioPage() {
  const [content, setContent] = useState("WHEREAS, the Parties desire to enter into this Agreement to govern the terms of their proposed merger;\n\nNOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:\n\n1. DEFINITIONS\n1.1 \"Closing Date\" means the date on which the Merger is consummated.")
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [researchNotes, setResearchNotes] = useState("")
  const [complianceCritique, setComplianceCritique] = useState("")
  const [retrievedDocs, setRetrievedDocs] = useState<{ name: string; key: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: prompt })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate content from active agents")
      }

      if (data.success) {
        if (data.draftedText) {
          setContent(prev => prev + "\n\n" + data.draftedText)
        }
        setResearchNotes(data.researchNotes || "")
        setComplianceCritique(data.complianceCritique || "")
        setRetrievedDocs(data.retrievedDocuments || [])
      } else {
        throw new Error(data.error || "Unsuccessful generation call")
      }
    } catch (err: any) {
      console.error("Error running legal agents:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-6">
      <div className="border-b border-white/10 pb-4 w-full flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Drafting Studio</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">AI-Assisted Document Preparation</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
            <History className="w-3 h-3" /> Version History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
            <CheckCircle2 className="w-3 h-3" /> Submit for Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-1 min-h-0">
         <div className="lg:col-span-8 flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
            <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between bg-black/50">
              <div className="text-xs font-mono text-white/50 flex items-center gap-2">
                 <FileText className="w-4 h-4" />
                 draft_merger_agreement_v2.docx
              </div>
              <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-white/40">
                <span className="flex items-center gap-1"><Save className="w-3 h-3" /> Auto-saved</span>
              </div>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full bg-transparent p-8 text-sm font-serif text-white/90 leading-relaxed outline-none resize-none min-h-[400px]"
              spellCheck={false}
            />
         </div>

         <div className="lg:col-span-4 flex flex-col space-y-6">
            <Card className="bg-emerald-950/20 border-emerald-500/20 rounded-2xl shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-xs uppercase tracking-widest font-bold text-emerald-400 flex items-center gap-2">
                   <Sparkles className="w-4 h-4" /> AI Drafting Co-Pilot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-xs text-white/60 leading-relaxed">
                   Describe the clause or provision you need, or ask ARBITER to review the current draft for anomalies.
                 </p>
                 <textarea 
                   placeholder="e.g., Draft a standard severability clause under Delaware law..."
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   className="w-full bg-black/50 border border-white/10 rounded p-3 text-xs font-mono text-white/80 outline-none h-24 resize-none"
                 />
                 {error && (
                   <div className="bg-red-950/50 border border-red-500/30 text-red-200 text-[10px] p-3 rounded font-mono leading-relaxed max-w-full overflow-x-auto whitespace-pre-wrap animate-in fade-in">
                     <strong>Quota / API Error:</strong> {error}
                   </div>
                 )}
                 <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                 >
                   {isGenerating ? <Sparkles className="w-3 h-3 animate-spin" /> : <PenTool className="w-3 h-3" />}
                   {isGenerating ? "Generating..." : "Generate Clause"}
                 </button>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-white/60">Document Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {complianceCritique ? (
                  <div className="border-l-2 border-yellow-500/50 pl-3 animate-in fade-in">
                    <h4 className="text-xs font-bold text-yellow-100 mb-1 font-mono">Critique Summary</h4>
                    <p className="text-[10px] text-white/70 leading-relaxed font-serif whitespace-pre-wrap">{complianceCritique}</p>
                  </div>
                ) : (
                  <div className="border-l-2 border-white/10 pl-3">
                    <h4 className="text-xs font-bold text-white/40 mb-1">Standard Check Pending</h4>
                    <p className="text-[10px] text-white/50 leading-relaxed font-serif">Run the AI Co-Pilot to automatically audit generated clauses for structural discrepancies or risks.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {researchNotes && (
               <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
                 <CardHeader className="pb-4 border-b border-white/10">
                   <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-white/60">Research & Precedents</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                   <div className="text-[10px] text-white/70 leading-relaxed font-serif whitespace-pre-wrap max-h-48 overflow-y-auto">
                     {researchNotes}
                   </div>
                   {retrievedDocs.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-white/10">
                       <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-400/80 mb-2">Sources Referenced (RAG)</div>
                       <ul className="space-y-1.5">
                         {retrievedDocs.map((doc, i) => (
                           <li key={i} className="flex items-center gap-2 text-[10px] font-mono text-white/60">
                             <FileText className="w-3.5 h-3.5 text-emerald-500/80 animate-pulse" />
                             <span className="truncate">{doc.name}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </CardContent>
               </Card>
            )}
         </div>
      </div>
    </div>
  )
}
