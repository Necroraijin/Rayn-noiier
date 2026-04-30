"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DownloadCloud, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function AuditLogPage() {
  const { role } = useAuth()
  const logs = [
    { id: "EVT-8921", event: "DOCUMENT_ANALYSIS_VIEW", user: "a.taylor@rayn.law", ip: "192.168.1.42", time: "2026-04-30T08:31:02Z", status: "SUCCESS" },
    { id: "EVT-8920", event: "MATTER_STATUS_UPDATE", user: "r.chen@rayn.law", ip: "192.168.1.18", time: "2026-04-30T07:15:44Z", status: "SUCCESS" },
    { id: "EVT-8919", event: "FILE_DOWNLOAD", user: "s.wright_client", ip: "203.0.113.88", time: "2026-04-29T18:42:11Z", status: "SUCCESS" },
    { id: "EVT-8918", event: "UNAUTHORIZED_ACCESS_ATTEMPT", user: "UNKNOWN", ip: "45.22.19.11", time: "2026-04-29T14:12:00Z", status: "DENIED" },
    { id: "EVT-8917", event: "USER_ROLE_CHANGE", user: "admin@rayn.law", ip: "192.168.1.1", time: "2026-04-29T09:00:23Z", status: "SUCCESS" },
    { id: "EVT-8916", event: "LOGIN_SUCCESS", user: "a.taylor@rayn.law", ip: "192.168.1.42", time: "2026-04-29T08:55:01Z", status: "SUCCESS" },
  ]

  if (role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in">
        <ShieldAlert className="h-12 w-12 text-red-500/50" />
        <h2 className="text-xl font-serif italic text-white">Access Denied</h2>
        <p className="text-xs uppercase tracking-widest text-white/40 font-mono">This area is restricted to Super Administrators.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">System Audit</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Immutable Event Ledger</p>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold">
          <DownloadCloud className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="bg-white text-black border-none rounded-2xl shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] tracking-widest uppercase font-bold opacity-50">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-light flex items-center gap-2 font-serif">
                <ShieldAlert className="h-5 w-5" /> Normal
             </div>
             <p className="text-[10px] tracking-widest uppercase font-mono opacity-50 mt-2">1 anomaly detected in 48h</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none mt-8 flex-1 overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Recent Events</CardTitle>
          <CardDescription className="text-white/40 text-[10px] tracking-widest uppercase">Filtered by last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40 w-[120px]">Event ID</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Timestamp (UTC)</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Event Type</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">User / Actor</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">IP Address</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] font-mono text-xs">
                  <TableCell className="text-white/40">{log.id}</TableCell>
                  <TableCell className="text-white/60">{log.time}</TableCell>
                  <TableCell className="font-bold text-white/80">{log.event}</TableCell>
                  <TableCell className="text-white/60">{log.user}</TableCell>
                  <TableCell className="text-white/40">{log.ip}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`font-mono font-normal text-[9px] uppercase tracking-widest rounded ${log.status === 'SUCCESS' ? 'text-white/60 border-white/20' : 'text-red-400 border-red-500/30'}`}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
