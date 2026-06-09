"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Monitor, Eye, EyeOff } from "lucide-react"

export function ClientPortalSettings() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
          <div className="flex justify-between items-start">
             <div>
               <CardTitle className="text-lg font-light font-serif italic text-white/90">Client Visibility Matrix</CardTitle>
               <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Select which modules are accessible when clients log in.</CardDescription>
             </div>
             <Monitor className="h-5 w-5 text-white/20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <Monitor className="h-4 w-4 text-emerald-400" />
                   <div>
                     <p className="text-sm font-bold text-white/90">Matter Status Tracker</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">High-level timeline</p>
                   </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2 border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded uppercase tracking-widest text-[9px] font-bold"><Eye className="h-3 w-3" /> Visible</Button>
             </div>

             <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <Monitor className="h-4 w-4 text-emerald-400" />
                   <div>
                     <p className="text-sm font-bold text-white/90">Billing & Invoices</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Payment gateway integration</p>
                   </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2 border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded uppercase tracking-widest text-[9px] font-bold"><Eye className="h-3 w-3" /> Visible</Button>
             </div>

             <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <Monitor className="h-4 w-4 text-white/30" />
                   <div>
                     <p className="text-sm font-bold text-white/50">AI Document Analysis</p>
                     <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Raw extraction results</p>
                   </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2 border-white/5 bg-black text-white/40 hover:text-white rounded uppercase tracking-widest text-[9px] font-bold"><EyeOff className="h-3 w-3" /> Hidden</Button>
             </div>

             <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <Monitor className="h-4 w-4 text-white/30" />
                   <div>
                     <p className="text-sm font-bold text-white/50">Draft Pleadings</p>
                     <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Unfinalized drafts</p>
                   </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2 border-white/5 bg-black text-white/40 hover:text-white rounded uppercase tracking-widest text-[9px] font-bold"><EyeOff className="h-3 w-3" /> Hidden</Button>
             </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90">Automated Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">New Document Upload Template</Label>
               <textarea 
                 className="w-full bg-black/50 border border-white/10 rounded p-4 text-sm font-mono focus:ring-1 focus:ring-emerald-500 outline-none text-white/80 min-h-[100px]"
                 defaultValue={`Dear {{client.name}},\n\nA new document related to {{matter.name}} has been uploaded to your portal and reviewed by our legal staff.\n\nSummary:\n{{ai.document_summary}}\n\nLog in to ARBITER to view.`}
               />
            </div>
            <Button className="w-full bg-white text-black hover:bg-white/90 rounded uppercase tracking-widest text-[10px] font-bold">Save Templates</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
