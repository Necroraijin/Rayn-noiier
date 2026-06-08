"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Users, Scale, Clock, Briefcase, Plus, Loader2 } from 'lucide-react';
import { getUsers, addDelegation, getDelegations, MockUser, Delegation } from '@/lib/local-db';
import { useAuth } from '@/lib/auth-context';

export function PartnerDashboard() {
  const { email } = useAuth();
  const [interns, setInterns] = useState<MockUser[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [selectedMatter, setSelectedMatter] = useState('MAT-2024-089');
  const [isDelegating, setIsDelegating] = useState(false);

  const loadData = useCallback(async () => {
    if (!email) return;
    const users = await getUsers();
    setInterns(users.filter(u => u.role === 'INTERN'));
    const dels = await getDelegations(email);
    setDelegations(dels);
  }, [email]);

  useEffect(() => {
    if (email) {
      loadData();
    }
  }, [email, loadData]);

  const handleDelegate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedIntern) return;
    setIsDelegating(true);
    await addDelegation(email, selectedIntern, selectedMatter);
    await loadData();
    setIsDelegating(false);
  };

  const partnerKpis = [
    { title: 'My Book of Business', value: '$1.2M', change: '80% of Goal', icon: Scale },
    { title: 'Personal Billable', value: '142h', change: '+12h This Mo', icon: Clock },
    { title: 'Team Utilization', value: '92%', change: 'Optimum', icon: Users },
    { title: 'Client Health Score', value: 'A-', change: 'Stable', icon: ShieldAlert },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in">
      <div className="lg:col-span-8 flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-8">
          <div>
            <h1 className="text-5xl font-light tracking-tighter mb-2 italic font-serif">Partner Desk</h1>
            <p className="text-white/40 text-xs tracking-widest uppercase">My Book of Business & Team Analytics</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono text-emerald-400">92%</div>
            <div className="text-[9px] uppercase tracking-tighter opacity-40">Team Utilization</div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
          {partnerKpis.map((kpi, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                 <div className="text-[10px] uppercase text-white/40 tracking-[0.2em]">{kpi.title}</div>
                 <kpi.icon className="h-4 w-4 text-white/20" />
              </div>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-mono">{kpi.value}</div>
                <div className="text-[10px] font-mono text-white/40 uppercase">{kpi.change}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 flex-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 text-emerald-400/80">Pending Sign-off Queue</div>
            <div className="space-y-4 mt-2">
              <div className="border-l-2 border-emerald-500/30 pl-4">
                <h3 className="text-sm font-medium mb-1 text-white/90">Motion for Summary Judgment</h3>
                <p className="text-[10px] text-white/50 leading-relaxed font-mono uppercase tracking-widest">Estate of M. Jane • Drafted by Associate_04</p>
              </div>
              <div className="border-l-2 border-white/20 pl-4 py-2 opacity-60">
                <h3 className="text-sm font-medium mb-1 text-white/90">Cease & Desist Notice</h3>
                <p className="text-[10px] text-white/50 leading-relaxed font-mono uppercase tracking-widest">Techstart Merger • AI Auto-Drafted</p>
              </div>
            </div>
            <button className="mt-8 text-[10px] font-bold uppercase tracking-widest border border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded px-4 py-2 text-center">View Review Queue</button>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 text-white/40">Team Workload Metrics</div>
             <div className="space-y-4 mt-2">
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase mb-1">
                  <span>Sarah L. (Sr. Assoc)</span>
                  <span className="text-emerald-400">104% (Overbooked)</span>
                </div>
                <div className="w-full h-1 bg-white/10"><div className="h-full bg-emerald-400 w-[100%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase mb-1">
                  <span>Michael T. (Assoc)</span>
                  <span className="text-emerald-400/80">88% (Optimal)</span>
                </div>
                <div className="w-full h-1 bg-white/10"><div className="h-full bg-emerald-400/80 w-[88%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase mb-1">
                  <span>David S. (Trainee)</span>
                  <span className="text-yellow-400/80">45% (Capacity)</span>
                </div>
                <div className="w-full h-1 bg-white/10"><div className="h-full bg-yellow-400/80 w-[45%]" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col space-y-8">
        <section className="flex-1 border border-emerald-500/20 rounded-2xl p-6 bg-emerald-950/10 flex flex-col">
           <div className="flex items-center gap-2 mb-6">
             <Briefcase className="w-4 h-4 text-emerald-400" />
             <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-emerald-400">Team & Intern Access</h2>
           </div>
           
           <form onSubmit={handleDelegate} className="bg-black/30 border border-white/5 p-4 rounded-xl mb-6">
             <h3 className="text-[9px] uppercase tracking-widest font-bold text-white/40 mb-4">Delegate Matter Access</h3>
             <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Select Intern</label>
                 <select required value={selectedIntern} onChange={(e) => setSelectedIntern(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono outline-none focus:border-emerald-500 appearance-none text-white/80">
                    <option value="" disabled>Choose Intern...</option>
                    {interns.map(intern => (
                      <option key={intern.email} value={intern.email}>{intern.email}</option>
                    ))}
                    {interns.length === 0 && <option value="" disabled>No Interns found in local DB</option>}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Select Active Matter</label>
                 <select value={selectedMatter} onChange={(e) => setSelectedMatter(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono outline-none focus:border-emerald-500 appearance-none text-white/80">
                    <option value="MAT-2024-089">Smith v. OmniCorp</option>
                    <option value="MAT-2024-091">TechStart Merger D.D.</option>
                    <option value="MAT-2024-065">Estate of M. Jane</option>
                 </select>
               </div>
               <button type="submit" disabled={isDelegating || !selectedIntern} className="w-full bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 text-xs font-bold uppercase tracking-widest rounded px-4 py-2 flex items-center justify-center transition-all mt-2">
                  {isDelegating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Grant Access'}
               </button>
             </div>
           </form>

           <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Active Delegations</h3>
              {delegations.length === 0 ? (
                <div className="text-center py-4 text-white/20 text-[10px] font-mono">No active delegations.</div>
              ) : (
                delegations.map((del, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-lg flex flex-col gap-1">
                    <span className="text-xs font-bold text-white/80">{del.internEmail}</span>
                    <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400">Matter: {del.matterId}</span>
                  </div>
                ))
              )}
           </div>
        </section>

        <div className="min-h-32 bg-emerald-950/30 border border-emerald-500/20 text-emerald-50 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Strategy Room Quick-Launch</span>
            <div className="text-[9px] font-mono px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10 text-emerald-400">ARBITER v2</div>
          </div>
          <div className="text-[10px] uppercase opacity-70 leading-relaxed space-y-2 mb-4">
            <p>Run opposing counsel profiling, or simulate settlement probabilities instantly.</p>
          </div>
          <button className="w-full bg-emerald-500 text-black font-bold uppercase tracking-widest text-[9px] py-3 rounded">Enter Strategy Room</button>
        </div>
      </div>
    </div>
  );
}