"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link2, Cloud, Database, MessageSquare } from "lucide-react"
import { getIntegrationConfig, setIntegrationConfig, IntegrationConfig } from "@/lib/local-db"

export function IntegrationSettings() {
  const [config, setConfig] = useState<IntegrationConfig>({});
  const [googleKey, setGoogleKey] = useState("");
  const [whatsappWebhook, setWhatsappWebhook] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const data = await getIntegrationConfig();
    setConfig(data);
    if (data.googleWorkspace) setGoogleKey(data.googleWorkspace.apiKey);
    if (data.whatsapp) setWhatsappWebhook(data.whatsapp.webhookUrl);
  };

  const handleSaveGoogle = async () => {
    setIsLoading(true);
    const newConfig = {
      ...config,
      googleWorkspace: { apiKey: googleKey, connected: !!googleKey }
    };
    await setIntegrationConfig(newConfig);
    setConfig(newConfig);
    setTimeout(() => setIsLoading(false), 800); // Mock network delay
  };

  const handleSaveWhatsapp = async () => {
    setIsLoading(true);
    const newConfig = {
      ...config,
      whatsapp: { webhookUrl: whatsappWebhook, connected: !!whatsappWebhook }
    };
    await setIntegrationConfig(newConfig);
    setConfig(newConfig);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div className="border-b border-white/5 pb-4 mb-6">
         <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">External Bridges</h3>
         <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Connect Rayn ARBITER to your existing stack.</p>
      </div>

      <div className="space-y-4">
         {/* Google Workspace */}
         <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center shrink-0 text-red-400 font-bold text-xs"><Cloud className="w-5 h-5"/></div>
               <div>
                 <h4 className="font-bold text-white/90 text-sm">Google Workspace</h4>
                 <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1 font-mono">Export to Docs, Send via Gmail</p>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Input 
                 type="password" 
                 placeholder="GCP API Key or Token..." 
                 value={googleKey}
                 onChange={(e) => setGoogleKey(e.target.value)}
                 className="bg-black/50 border-white/10 h-9 font-mono text-xs w-full md:w-48 focus-visible:ring-emerald-500" 
               />
               <Button onClick={handleSaveGoogle} disabled={isLoading} className={`${config.googleWorkspace?.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 border hover:bg-emerald-500/20' : 'bg-white text-black hover:bg-white/90'} rounded h-9 uppercase tracking-widest text-[9px] font-bold shrink-0 min-w-[80px]`}>
                 {config.googleWorkspace?.connected ? 'Connected' : 'Connect'}
               </Button>
            </div>
         </div>

         {/* WhatsApp */}
         <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col items-center justify-center shrink-0 text-green-400 font-bold text-xs"><MessageSquare className="w-5 h-5"/></div>
               <div>
                 <h4 className="font-bold text-white/90 text-sm">WhatsApp Business</h4>
                 <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1 font-mono">Client comms & file sharing</p>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Input 
                 type="text" 
                 placeholder="Webhook URL..." 
                 value={whatsappWebhook}
                 onChange={(e) => setWhatsappWebhook(e.target.value)}
                 className="bg-black/50 border-white/10 h-9 font-mono text-xs w-full md:w-48 focus-visible:ring-emerald-500" 
               />
               <Button onClick={handleSaveWhatsapp} disabled={isLoading} className={`${config.whatsapp?.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 border hover:bg-emerald-500/20' : 'bg-white text-black hover:bg-white/90'} rounded h-9 uppercase tracking-widest text-[9px] font-bold shrink-0 min-w-[80px]`}>
                 {config.whatsapp?.connected ? 'Connected' : 'Connect'}
               </Button>
            </div>
         </div>

         {/* Existing Mocks */}
         <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center shrink-0 text-blue-400 font-bold text-xs">LEX</div>
               <div>
                 <h4 className="font-bold text-white/90 text-sm">LexisNexis Interaction</h4>
                 <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1 font-mono">Sync precedents and client data</p>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Input type="password" value="**************" disabled className="bg-black/50 border-white/10 h-9 font-mono text-xs w-full md:w-48 disabled:opacity-50" />
               <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded h-9 uppercase tracking-widest text-[9px] font-bold shrink-0">Connected</Button>
            </div>
         </div>

      </div>
    </div>
  )
}
