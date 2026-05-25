"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Users, Scale, ShieldAlert, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useNav } from '@/lib/nav-context';
import { SuperAdminDashboard } from '@/components/dashboards/super-admin-dashboard';
import { PartnerDashboard } from '@/components/dashboards/partner-dashboard';
import { DraftingStudio } from '@/components/features/drafting-studio';
import { SettingsPage } from '@/components/features/settings-page';
import { TasksPage } from '@/components/features/tasks-page';
import { MattersPage } from '@/components/features/matters-page';
import { AnalyticsPage } from '@/components/features/analytics-page';
import { AuditPage } from '@/components/features/audit-page';
import { BillingPage } from '@/components/features/billing-page';
import { CalendarPage } from '@/components/features/calendar-page';
import { ClientsPage } from '@/components/features/clients-page';
import { CommunicationsPage } from '@/components/features/communications-page';
import { DocumentsPage } from '@/components/features/documents-page';
import { LearningPage } from '@/components/features/learning-page';
import { LibraryPage } from '@/components/features/library-page';
import { ResearchPage } from '@/components/features/research-page';
import { ReviewPage } from '@/components/features/review-page';
import { StrategyPage } from '@/components/features/strategy-page';
import { TeamPage } from '@/components/features/team-page';


function DefaultDashboard() {
  const { role } = useAuth();
  
  if (role === "INTERN") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in">
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-8">
            <div>
              <h1 className="text-5xl font-light tracking-tighter mb-2 italic font-serif">Trainee Dashboard</h1>
              <p className="text-white/40 text-xs tracking-widest uppercase">Supervised Tasks & Mentorship</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex-1">
             <h2 className="text-xs uppercase tracking-widest font-bold text-white/40 mb-6">Mentor Feed</h2>
             <div className="space-y-4">
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-emerald-400">Senior_Assoc_LJ</span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Just Now</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-serif">"Excellent work on the Smithson case briefing. You caught the nuance in the dissenting opinion. For your next task, try using the AI Drafting Co-pilot to prepare the initial settlement letter, but remember to strictly review the confidentiality clauses."</p>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-white/90">System Automated</span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">2 Hours Ago</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-serif">The draft prepared for Matter #4029 has been returned with edits. Please review the tracked changes.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-8">
           <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 flex-1">
             <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4">Focus Tasks</h3>
             <div className="space-y-4">
               <div className="border-l-2 border-emerald-500/50 pl-3">
                 <h4 className="text-xs font-bold text-white/90">Draft Settlement Letter</h4>
                 <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1">Due Today • Assigned by LJ</p>
               </div>
               <div className="border-l-2 border-white/20 pl-3">
                 <h4 className="text-xs font-bold text-white/90">Review Disclosure Docs</h4>
                 <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1">Due Tomorrow</p>
               </div>
             </div>
             <button className="w-full mt-6 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded px-4 py-2 transition-colors">
               Go to Tasks
             </button>
           </div>
        </div>
      </div>
    )
  }

  if (role === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  }

  if (role === "EQUITY_PARTNER" || role === "SALARIED_PARTNER") {
    return <PartnerDashboard />;
  }

  if (role === "BILLING_ADMIN") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in">
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-8">
            <div>
              <h1 className="text-5xl font-light tracking-tighter mb-2 italic font-serif">Finance & Billing</h1>
              <p className="text-white/40 text-xs tracking-widest uppercase">Revenue Management & Forecasting</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono text-emerald-400">$840k</div>
              <div className="text-[9px] uppercase tracking-tighter opacity-40">Month-to-Date Revenue</div>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
               <div className="text-[10px] uppercase text-white/40 tracking-[0.2em] mb-4">WIP (Unbilled)</div>
               <div className="text-3xl font-mono">$1.2M</div>
               <div className="text-[10px] font-mono text-emerald-400 uppercase">+15% vs Last Mo</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
               <div className="text-[10px] uppercase text-white/40 tracking-[0.2em] mb-4">A/R (&gt; 30 Days)</div>
               <div className="text-3xl font-mono">$420k</div>
               <div className="text-[10px] font-mono text-red-400 uppercase">Action Required</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
               <div className="text-[10px] uppercase text-white/40 tracking-[0.2em] mb-4">Trust Account</div>
               <div className="text-3xl font-mono">$3.8M</div>
               <div className="text-[10px] font-mono text-white/40 uppercase">Fully Reconciled</div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
             <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 text-emerald-400">AI Billing Anomaly Detection</h3>
             <div className="space-y-4">
                <div className="border border-red-500/20 bg-red-500/5 p-4 rounded-lg flex justify-between items-center">
                   <div>
                     <h4 className="text-sm font-bold text-red-100">Unusual Hours Logged - Estate of M. Jane</h4>
                     <p className="text-[10px] text-red-200/60 font-mono mt-1">Associate_02 logged 18 hours in a 24-hour period. Exceeds standard deviation.</p>
                   </div>
                   <button className="px-3 py-1.5 border border-red-500/40 text-red-400 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-red-500/10 transition-colors">Flag for Review</button>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-4 rounded-lg flex justify-between items-center">
                   <div>
                     <h4 className="text-sm font-bold text-white/90">Task Mismatch - Draft Motion for SJ</h4>
                     <p className="text-[10px] text-white/50 font-mono mt-1">Billed at partner rate ($850/hr). AI suggests this is typically an associate task.</p>
                   </div>
                   <button className="px-3 py-1.5 border border-white/20 text-white/80 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-white/10 transition-colors">Apply Write-down</button>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-8">
           <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 flex-1">
             <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4">Revenue Forecasting</h3>
             <p className="text-xs text-white/70 leading-relaxed mb-6">
               Based on the active matter pipeline and historical settlement rates, ARBITER predicts Q4 revenue to be <strong>$4.2M</strong>.
             </p>
             <div className="h-32 mb-4 relative flex items-end">
                {/* Mock Chart */}
                <div className="w-full h-full border-b border-emerald-500/20 flex items-end justify-between px-2 pb-1 relative">
                   <div className="w-1/5 h-[40%] bg-white/10 rounded-t"></div>
                   <div className="w-1/5 h-[60%] bg-white/10 rounded-t"></div>
                   <div className="w-1/5 h-[80%] bg-emerald-500/40 rounded-t"></div>
                   <div className="w-1/5 h-[95%] bg-emerald-500/80 rounded-t relative">
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400">$4.2M</span>
                   </div>
                </div>
             </div>
             <p className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-widest text-center">Trailing 3 Quarters vs Q4 Projection</p>
           </div>
        </div>
      </div>
    );
  }

  if (role === "GUEST_CLIENT") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in">
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-8">
            <div>
              <h1 className="text-5xl font-light tracking-tighter mb-2 italic font-serif">Client Portal</h1>
              <p className="text-white/40 text-xs tracking-widest uppercase">Secure Communication & Matter Tracker</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono text-emerald-400">01</div>
              <div className="text-[9px] uppercase tracking-tighter opacity-40">Active Matters</div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
             <h2 className="text-lg font-serif italic text-white/90 mb-4">Smith v. OmniCorp (Case #4029)</h2>
             
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[10px] font-mono uppercase mb-2 text-white/60">
                     <span>Current Phase: Discovery</span>
                     <span className="text-emerald-400">On Track</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400 w-[60%]" />
                   </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg">
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Matter Status Explainer
                  </h3>
                  <p className="text-sm font-serif text-white/80 leading-relaxed">
                    Your case is currently in the "Discovery" phase. This means your legal team and the opposing counsel are exchanging evidence and documents relevant to the case. We are currently waiting for OmniCorp to produce the final batch of internal emails requested last month. No action is required from your side at this moment.
                  </p>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
               <h3 className="text-xs uppercase tracking-widest font-bold text-white/40 mb-4">Recent Documents</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center group cursor-pointer">
                   <div className="flex items-center gap-3">
                     <FileText className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                     <div>
                       <div className="text-sm text-white/90">Motion to Compel</div>
                       <div className="text-[9px] font-mono text-white/40 uppercase">Filed by Your Team • 2 Days Ago</div>
                     </div>
                   </div>
                 </div>
                 <div className="flex justify-between items-center group cursor-pointer">
                   <div className="flex items-center gap-3">
                     <FileText className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                     <div>
                       <div className="text-sm text-white/90">Defendant's Initial Disclosures</div>
                       <div className="text-[9px] font-mono text-white/40 uppercase">Received • 1 Week Ago</div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6">
               <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4">Next Steps Guide</h3>
               <p className="text-xs text-white/70 leading-relaxed mb-4">
                 Based on the upcoming arbitration hearing, your legal team needs you to review and sign the attached <strong>Affidavit of Facts</strong> before Friday.
               </p>
               <button className="w-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded px-4 py-2 transition-colors">
                 Review Affidavit
               </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-8">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
             <h3 className="text-xs uppercase tracking-widest font-bold text-white/40 mb-4">Upcoming Hearings</h3>
             <div className="space-y-4">
               <div className="flex items-start">
                 <div className="text-xl font-mono mr-4 border-r border-white/10 pr-4">17<br/><span className="text-[9px] text-white/30 uppercase tracking-widest font-sans">Oct</span></div>
                 <div className="pt-1">
                   <div className="text-xs font-bold uppercase tracking-widest">Arbitration Hearing</div>
                   <div className="text-[10px] text-white/50 tracking-wider">Room 4B, Central Court</div>
                 </div>
               </div>
             </div>
           </div>

           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col h-64">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
               FAQ Bot
             </h3>
             <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-2">
               <div className="bg-white/5 p-3 rounded-tr-lg rounded-bl-lg rounded-br-lg inline-block text-white/70 max-w-[85%]">
                 What happens after discovery?
               </div>
               <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-tl-lg rounded-bl-lg rounded-br-lg inline-block text-blue-100/80 w-full">
                 After discovery concludes, we evaluation the evidence. Either party may file a <strong>Motion for Summary Judgment</strong> to decide the case without a trial, or we prepare for pre-trial conferences.
               </div>
             </div>
             <div className="mt-4 pt-4 border-t border-white/10">
               <input type="text" placeholder="Ask a procedural question..." className="w-full bg-black/50 border border-white/10 rounded p-2 text-xs font-mono text-white/80 outline-none" />
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Fallback default
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4 animate-in fade-in">
        <LayoutDashboard className="w-12 h-12 text-white/20 mx-auto" />
        <h1 className="text-4xl font-light tracking-tighter italic font-serif">Welcome to Rayn</h1>
        <p className="text-xs uppercase tracking-widest text-white/40">Select an item from the sidebar to begin.</p>
      </div>
    </div>
  )
}

export default function AppRouter() {
  const { activeView } = useNav();
  const { permissions } = useAuth();

  // Strict dynamic rendering based on activeView AND permissions
  switch (activeView) {
    case 'Drafting':
      if (permissions.includes("Drafting")) return <DraftingStudio />;
      break;
    case 'Settings':
      if (permissions.includes("Settings")) return <SettingsPage />;
      break;
    case 'Tasks':
      if (permissions.includes("Tasks")) return <TasksPage />;
      break;
    case 'Matters':
      if (permissions.includes("Matters")) return <MattersPage />;
      break;
    case 'Analytics':
      if (permissions.includes('Analytics')) return <AnalyticsPage />;
      break;
    case 'Audit':
      if (permissions.includes('Audit')) return <AuditPage />;
      break;
    case 'Billing':
      if (permissions.includes('Billing')) return <BillingPage />;
      break;
    case 'Calendar':
      if (permissions.includes('Calendar')) return <CalendarPage />;
      break;
    case 'Clients':
      if (permissions.includes('Clients')) return <ClientsPage />;
      break;
    case 'Comms':
      if (permissions.includes('Comms')) return <CommunicationsPage />;
      break;
    case 'Analysis':
      if (permissions.includes('Analysis')) return <DocumentsPage />;
      break;
    case 'Learning':
      if (permissions.includes('Learning')) return <LearningPage />;
      break;
    case 'Library':
      if (permissions.includes('Library')) return <LibraryPage />;
      break;
    case 'Research':
      if (permissions.includes('Research')) return <ResearchPage />;
      break;
    case 'Review Queue':
      if (permissions.includes('Review Queue')) return <ReviewPage />;
      break;
    case 'Strategy':
      if (permissions.includes('Strategy')) return <StrategyPage />;
      break;
    case 'Team':
      if (permissions.includes('Team')) return <TeamPage />;
      break;
    case 'dashboard':
      return <DefaultDashboard />;
    default:
      if (permissions.includes(activeView)) {
        return (
          <div className="flex items-center justify-center h-full">
             <div className="text-center text-white/40 uppercase tracking-widest text-[10px] font-bold border border-white/10 p-8 rounded-xl bg-white/[0.02]">
                [{activeView}] Module Not Yet Migrated to SPA Component
             </div>
          </div>
        )
      }
      break;
  }

  // If unauthorized or base state
  return <DefaultDashboard />;
}
