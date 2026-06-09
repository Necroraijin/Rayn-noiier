"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Library, Folder, Search, Filter, FileText } from "lucide-react"

export function LibraryPage() {
  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Firm Precedent Library</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Verified Knowledge Base & Templates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
          Submit Precedent
        </button>
      </div>

      <div className="flex gap-4 w-full">
         <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center flex-1">
           <Search className="w-5 h-5 text-white/40 mx-3" />
           <input 
             type="text" 
             placeholder="Search firm precedents, templates, past judgments..." 
             className="bg-transparent flex-1 outline-none text-sm font-serif text-white/90"
           />
         </div>
         <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60">
           <Filter className="w-4 h-4" /> Filters
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         <div className="lg:col-span-3 space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-4 px-2">Categories</h3>
            
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer">
              <Folder className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/90 font-medium">Mergers & Acquisitions</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/[0.02] rounded-lg cursor-pointer text-white/60 hover:text-white/90 transition-colors">
              <Folder className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium">Corporate Litigation</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/[0.02] rounded-lg cursor-pointer text-white/60 hover:text-white/90 transition-colors">
              <Folder className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium">Employment Law</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/[0.02] rounded-lg cursor-pointer text-white/60 hover:text-white/90 transition-colors">
              <Folder className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium">Intellectual Property</span>
            </div>
         </div>

         <div className="lg:col-span-9 space-y-4">
            <Card className="bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/20 flex flex-shrink-0 items-center justify-center mt-1">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif text-white/90 mb-1 group-hover:text-emerald-400 transition-colors">Standard Delaware SPA Template (Pro-Buyer)</h4>
                    <p className="text-xs text-white/50 leading-relaxed mb-3">
                      Updated template incorporating 2025 precedent. Includes stringent sandbagging and knowledge scraping provisions.
                    </p>
                    <div className="flex gap-4 text-[9px] font-mono uppercase tracking-widest text-white/30">
                      <span>Updated: 2 Weeks Ago</span>
                      <span>By: Partner_Desk</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-none">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center mt-1">
                    <Library className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif text-white/90 mb-1 group-hover:text-white transition-colors">Memo: Enforceability of Non-Compete Post-FTC Ban</h4>
                    <p className="text-xs text-white/50 leading-relaxed mb-3">
                      Comprehensive internal memo detailing jurisdiction-specific approaches following the FTC ban on non-competes.
                    </p>
                    <div className="flex gap-4 text-[9px] font-mono uppercase tracking-widest text-white/30">
                      <span>Updated: 1 Month Ago</span>
                      <span>By: Senior_Counsel</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
