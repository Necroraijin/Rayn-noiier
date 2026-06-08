"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Server, HardDrive, Cpu, Users, Plus, Loader2 } from 'lucide-react';
import { addUser, getUsers, MockUser } from '@/lib/local-db';

export function SuperAdminDashboard() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('ASSOCIATE');
  const [isAdding, setIsAdding] = useState(false);

  const loadUsers = useCallback(async () => {
    const u = await getUsers();
    setUsers(u);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setIsAdding(true);
    await addUser(newEmail, newRole);
    setNewEmail('');
    await loadUsers();
    setIsAdding(false);
  };

  const itKpis = [
    { title: 'System Uptime', value: '99.99%', change: 'Target: 99.9%', icon: Server },
    { title: 'Local DB Storage', value: '4.2 MB', change: '8.4 GB Available', icon: HardDrive },
    { title: 'AI API Usage', value: '142k', change: 'Tokens Today', icon: Cpu },
    { title: 'Active Accounts', value: (users.length + 12).toString(), change: 'Mocked Local DB', icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in">
      <div className="lg:col-span-8 flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-8">
          <div>
            <h1 className="text-5xl font-light tracking-tighter mb-2 italic font-serif">IT Infrastructure</h1>
            <p className="text-white/40 text-xs tracking-widest uppercase">Local System & Identity Management</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono text-emerald-400">Secure</div>
            <div className="text-[9px] uppercase tracking-tighter opacity-40">Local DB Status</div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
          {itKpis.map((kpi, index) => (
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

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 flex flex-col mb-8 lg:mb-0">
           <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-6 text-white/40">Account Creation (Local Store)</h2>
           <form onSubmit={handleAddUser} className="bg-white/[0.02] border border-white/10 p-4 rounded-xl mb-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Email Address</label>
                 <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new.user@rayn.law" className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs font-mono placeholder:text-white/20 outline-none focus:border-emerald-500 text-white" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Assigned Role</label>
                 <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs font-mono outline-none focus:border-emerald-500 appearance-none text-white/80">
                    <option value="INTERN">Intern</option>
                    <option value="ASSOCIATE">Associate</option>
                    <option value="SENIOR_ASSOCIATE">Senior Associate</option>
                    <option value="COUNSEL">Counsel</option>
                    <option value="EQUITY_PARTNER">Equity Partner</option>
                    <option value="BILLING_ADMIN">Billing Admin</option>
                 </select>
               </div>
               <button type="submit" disabled={isAdding} className="bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 text-xs font-bold uppercase tracking-widest rounded px-4 py-2 h-[34px] flex items-center justify-center transition-all">
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-3 h-3 mr-2" /> Provision</>}
               </button>
             </div>
           </form>

           <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-4 mt-2">Provisioned via Local DB</h3>
              {users.length === 0 ? (
                <div className="text-center py-8 text-white/20 text-xs font-mono">No accounts created locally yet.</div>
              ) : (
                users.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/30 border border-white/5 p-3 rounded-lg">
                    <span className="text-sm font-mono text-white/80">{user.email}</span>
                    <span className="text-[9px] uppercase tracking-widest px-2 py-1 bg-white/10 text-white/60 rounded">{user.role}</span>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col space-y-8">
        <section className="flex-1 border border-white/10 rounded-2xl p-6 bg-white/[0.02] flex flex-col">
           <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-6 text-white/40">System Audit Logs</h2>
           <div className="space-y-4 flex-1">
             <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
               <div className="flex justify-between items-start mb-2">
                 <span className="font-bold text-sm text-white/90">Local Storage Sync</span>
                 <span className="font-mono text-[9px] text-white/40">1m ago</span>
               </div>
               <p className="text-xs text-white/50 leading-relaxed font-mono">store.save() executed successfully to data.json</p>
             </div>
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
               <div className="flex justify-between items-start mb-2">
                 <span className="font-bold text-sm text-emerald-400">Access Granted</span>
                 <span className="font-mono text-[9px] text-emerald-400/50">12m ago</span>
               </div>
               <p className="text-xs text-emerald-200/60 leading-relaxed font-mono">Session initialized for SUPER_ADMIN role.</p>
             </div>
             <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
               <div className="flex justify-between items-start mb-2">
                 <span className="font-bold text-sm text-yellow-400">Tauri IPC Call</span>
                 <span className="font-mono text-[9px] text-yellow-400/50">1h ago</span>
               </div>
               <p className="text-xs text-yellow-200/60 leading-relaxed font-mono">Warning: Expected response delay &gt; 50ms from plugin-store.</p>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
}