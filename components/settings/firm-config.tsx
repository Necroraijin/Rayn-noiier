"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Globe, FileText, Scale } from "lucide-react"

export function FirmConfig() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">Firm Identity</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Configure your firm&apos;s brand and operating region.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Firm Name</Label>
              <Input defaultValue="Rayn & Partners" className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-sm" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Jurisdiction / Firm Type</Label>
              <select className="w-full bg-black/50 border border-white/10 rounded py-3 px-3 text-sm font-mono focus:ring-1 focus:ring-emerald-500 outline-none text-white/80">
                <option value="us">United States (LLP)</option>
                <option value="uk">United Kingdom (LLP/Ltd)</option>
                <option value="in">India (LLP/Firm)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Firm Logo (URL)</Label>
              <Input type="url" placeholder="https://..." className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-sm" />
            </div>

            <Button className="w-full bg-white text-black hover:bg-white/90 rounded uppercase tracking-widest text-[10px] font-bold">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">Practice Areas & Billing</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Set allowed domains and global billing formats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Enabled Practice Areas</Label>
              <div className="space-y-2 mt-2 border border-white/5 bg-black/20 p-4 rounded-xl">
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-emerald-500" /> Corporate Litigation</label>
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-emerald-500" /> IP Prosecution</label>
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" defaultChecked className="accent-emerald-500" /> Real Estate</label>
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" className="accent-emerald-500" /> Family Law</label>
                 <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" className="accent-emerald-500" /> Criminal Defense</label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Default Billing Preference</Label>
              <select className="w-full bg-black/50 border border-white/10 rounded py-3 px-3 text-sm font-mono focus:ring-1 focus:ring-emerald-500 outline-none text-white/80">
                <option>Hourly (Standard 6-minute increments)</option>
                <option>Flat Fee</option>
                <option>Contingency</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
