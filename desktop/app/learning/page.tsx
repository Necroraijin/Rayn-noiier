"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, PlayCircle, FileText, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LearningCenterPage() {
  const { role } = useAuth()
  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Learning Center</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Firm Methodologies & Case Studies</p>
        </div>
        {role === "INTERN" && (
           <div className="text-[9px] uppercase tracking-widest px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">
             Trainee Mode Active
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         <div className="lg:col-span-8 space-y-8">
           <section>
             <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Required Training Tracks</h2>
             <div className="grid gap-4">
               <Card className="bg-white/[0.02] border-emerald-500/20 border rounded-2xl shadow-none overflow-hidden relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50"></div>
                 <CardContent className="p-6 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                       <PlayCircle className="w-5 h-5 text-emerald-400" />
                     </div>
                     <div>
                       <h3 className="text-base font-serif italic text-white/90">Anatomy of a Summary Judgment Motion</h3>
                       <p className="text-[10px] font-mono uppercase tracking-widest text-white/50 mt-1">45 Mins • 3 Interactive Exercises</p>
                     </div>
                   </div>
                   <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
                     Resume
                   </button>
                 </CardContent>
               </Card>
               
               <Card className="bg-white/[0.02] border-white/10 border rounded-2xl shadow-none overflow-hidden">
                 <CardContent className="p-6 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                       <FileText className="w-5 h-5 text-white/40" />
                     </div>
                     <div>
                       <h3 className="text-base font-serif italic text-white/90">Firm Precedent Briefing Protocol</h3>
                       <p className="text-[10px] font-mono uppercase tracking-widest text-white/50 mt-1">20 Mins • Mandatory</p>
                     </div>
                   </div>
                   <button className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
                     Start
                   </button>
                 </CardContent>
               </Card>
             </div>
           </section>

           <section>
             <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Practice Sandbox</h2>
             <Card className="bg-gradient-to-br from-white/5 to-transparent border-white/10 border rounded-2xl shadow-none">
                <CardContent className="p-8 text-center flex flex-col items-center">
                   <GraduationCap className="w-12 h-12 text-blue-400/50 mb-4" />
                   <h3 className="text-lg font-serif italic text-white/90 mb-2">Simulated Case Briefing</h3>
                   <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto mb-6">
                     Upload a judgment or select a historical case. ARBITER will guide you through briefing the facts, issues, holding, and ratio, grading your analysis in real-time.
                   </p>
                   <button className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
                     Start New Exercise
                   </button>
                </CardContent>
             </Card>
           </section>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="text-[10px] tracking-widest uppercase font-bold text-white/60">My Progress</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-serif text-white/90 mb-2">
                    <span>Onboarding Modules</span>
                    <span className="font-mono">80%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[80%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs font-serif text-white/90 mb-2">
                    <span>Drafting Excellence</span>
                    <span className="font-mono">45%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-[45%]" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Ethics Core Cleared
                  </div>
                </div>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
