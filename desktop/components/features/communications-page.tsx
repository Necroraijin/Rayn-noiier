"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, File as FileIcon } from "lucide-react"

export function CommunicationsPage() {
  const contacts = [
    { name: "David Smith", case: "Smith v. OmniCorp", active: true },
    { name: "Sarah Wright", case: "Wright v. Davis", active: false },
    { name: "TechStart Legal Team", case: "TechStart Merger D.D.", active: false },
  ]

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Encrypted Comms</h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">E2EE Client Messaging</p>
      </div>

      <div className="flex flex-1 min-h-0 gap-0 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-black/20 shrink-0">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
              <input 
                type="text"
                placeholder="SEARCH MESSAGES..."
                className="w-full text-xs font-mono font-bold tracking-widest bg-white/5 border border-white/10 rounded pl-9 pr-4 py-2 outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-white/20 text-white placeholder:font-mono placeholder:text-xs"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {contacts.map((contact, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${contact.active ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}>
                   <Avatar className="h-10 w-10 border border-white/20">
                     <AvatarFallback className="bg-transparent text-white text-xs font-bold font-mono tracking-widest">
                       {contact.name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div className="overflow-hidden">
                     <p className="text-sm font-medium text-white/90 truncate">{contact.name}</p>
                     <p className="text-[10px] uppercase tracking-widest font-mono text-white/40 truncate">{contact.case}</p>
                   </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-transparent">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/10">
             <div>
                <h3 className="font-medium text-white">David Smith</h3>
                <p className="text-[10px] tracking-widest uppercase text-white/40 font-mono">Smith v. OmniCorp • End-to-End Encrypted</p>
             </div>
             <Button variant="outline" size="sm" className="h-8 border-white/20 text-white/60 hover:text-white hover:bg-white/10 text-[10px] font-mono tracking-widest uppercase rounded">MAT-2024-089</Button>
          </div>

          <ScrollArea className="flex-1 p-6">
             <div className="space-y-8">
                <div className="flex justify-center">
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded">Today, 09:41 AM</span>
                </div>
                
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8 mt-1 border border-white/20">
                     <AvatarFallback className="bg-transparent text-white font-mono text-[10px]">DS</AvatarFallback>
                  </Avatar>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-sm max-w-[80%] text-white/80">
                    Can you share the latest draft of the NDA? I need to forward it to my HR lead before the meeting tomorrow.
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="h-8 w-8 mt-1 rounded-full bg-white flex items-center justify-center text-black text-[10px] font-mono font-bold">
                     AT
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-white rounded-2xl rounded-tr-none p-4 text-sm max-w-[80%] space-y-4">
                    <p className="text-white/90">Of course, David. I have attached the provisionally finalized NDA. AI due diligence hasn&apos;t flagged any unusual liabilities.</p>
                    <div className="bg-black/40 border border-white/10 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-black/60 transition-colors">
                       <FileIcon className="h-8 w-8 text-white/60" />
                       <div>
                          <p className="font-medium text-xs text-white">Smith_OmniCorp_NDA_v2.pdf</p>
                          <p className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 mt-1">142 KB • Processed by Rayn AI</p>
                       </div>
                    </div>
                  </div>
                </div>
             </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/10 bg-black/20">
             <div className="relative flex items-end gap-2">
                <Textarea 
                  placeholder="TYPE A SECURE MESSAGE..."
                  className="min-h-[60px] max-h-32 resize-none bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-emerald-500 placeholder:text-white/20 text-white font-mono text-sm placeholder:tracking-widest rounded"
                />
                <Button size="icon" className="h-[60px] w-[60px] shrink-0 bg-white text-black hover:bg-white/90 rounded">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
