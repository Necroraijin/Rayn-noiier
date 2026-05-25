"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Save, FileText, CheckCircle2, History, Pencil, PenTool, Share2, Cloud, Mail, MessageSquare, Loader2, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getIntegrationConfig, IntegrationConfig } from "@/lib/local-db"

export function DraftingStudio() {
  const [content, setContent] = useState("WHEREAS, the Parties desire to enter into this Agreement to govern the terms of their proposed merger;\n\nNOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:\n\n1. DEFINITIONS\n1.1 \"Closing Date\" means the date on which the Merger is consummated.")
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Integration States
  const [config, setConfig] = useState<IntegrationConfig>({});
  const [isExportingDocs, setIsExportingDocs] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isSharingGmail, setIsSharingGmail] = useState(false);
  const [isSharingWA, setIsSharingWA] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    const data = await getIntegrationConfig();
    setConfig(data);
  };

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setContent(prev => prev + "\n\n1.2 \"Material Adverse Effect\" means any event, change, or occurrence that, individually or in the aggregate, has a material adverse effect on the business, results of operations, or financial condition of the Company.")
    }, 1500)
  }

  const handleExportDocs = async () => {
    if (!config.googleWorkspace?.connected) {
      alert("Please connect Google Workspace in Settings -> Integrations first.");
      return;
    }
    setIsExportingDocs(true);
    setExportSuccess(false);
    // Simulate API call to Google Docs API using stored config.googleWorkspace.apiKey
    setTimeout(() => {
      setIsExportingDocs(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 2000);
  };

  const handleShareGmail = async () => {
    if (!config.googleWorkspace?.connected) {
      alert("Please connect Google Workspace in Settings -> Integrations first.");
      return;
    }
    setIsSharingGmail(true);
    // Simulate Gmail API call
    setTimeout(() => {
      setIsSharingGmail(false);
      alert("Draft sent via Gmail to client successfully.");
    }, 1500);
  };

  const handleShareWA = async () => {
    if (!config.whatsapp?.connected) {
      alert("Please connect WhatsApp Business in Settings -> Integrations first.");
      return;
    }
    setIsSharingWA(true);
    // Simulate WhatsApp Webhook call
    setTimeout(() => {
      setIsSharingWA(false);
      alert("Draft link sent via WhatsApp.");
    }, 1500);
  };


  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-6">
      <div className="border-b border-white/10 pb-4 w-full flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Drafting Studio</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">AI-Assisted Document Preparation</p>
        </div>
        <div className="flex gap-3">
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest transition-colors outline-none">
                <Share2 className="w-3 h-3" /> Share
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-white/10 text-white">
              <DropdownMenuItem onClick={handleShareGmail} className="text-xs focus:bg-white/10 focus:text-white cursor-pointer flex items-center gap-2">
                {isSharingGmail ? <Loader2 className="w-3 h-3 animate-spin"/> : <Mail className="w-3 h-3 text-red-400" />} Send via Gmail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareWA} className="text-xs focus:bg-white/10 focus:text-white cursor-pointer flex items-center gap-2">
                {isSharingWA ? <Loader2 className="w-3 h-3 animate-spin"/> : <MessageSquare className="w-3 h-3 text-green-400" />} Send via WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button 
            onClick={handleExportDocs}
            disabled={isExportingDocs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 rounded text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {isExportingDocs ? <Loader2 className="w-3 h-3 animate-spin" /> : exportSuccess ? <Check className="w-3 h-3" /> : <Cloud className="w-3 h-3" />} 
            {isExportingDocs ? "Exporting..." : exportSuccess ? "Exported" : "Export to Docs"}
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
              className="flex-1 w-full bg-transparent p-8 text-sm font-serif text-white/90 leading-relaxed outline-none resize-none"
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
                   className="w-full bg-black/50 border border-white/10 rounded p-3 text-xs font-mono text-white/80 outline-none h-24 resize-none"
                 />
                 <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                 >
                   {isGenerating ? <Sparkles className="w-3 h-3 animate-spin" /> : <PenTool className="w-3 h-3" />}
                   {isGenerating ? "Generating..." : "Generate Clause"}
                 </button>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none flex-1">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-white/60">Document Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="border-l-2 border-yellow-500/50 pl-3">
                  <h4 className="text-xs font-bold text-yellow-100 mb-1">Missing Clause Detected</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed font-serif">Standard confidentiality provisions are missing from this draft. This is highly irregular for merger agreements.</p>
                  <button className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mt-2 hover:text-emerald-300">Auto-Insert Standard Form</button>
                </div>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
