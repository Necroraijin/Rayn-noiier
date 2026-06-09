"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DownloadCloud, ShieldAlert, Filter, Activity, Shield, AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTenant } from "@/lib/tenant-context"
import { useAuditLog, AuditCategory, AuditSeverity } from "@/lib/audit-logger"
import AccessDenied from "@/components/access-denied"

const SEVERITY_STYLES: Record<AuditSeverity, { badge: string; dot: string }> = {
  SUCCESS: { badge: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", dot: "bg-emerald-500" },
  INFO: { badge: "text-white/60 border-white/20 bg-white/5", dot: "bg-white/40" },
  WARNING: { badge: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5", dot: "bg-yellow-500" },
  CRITICAL: { badge: "text-red-400 border-red-500/30 bg-red-500/5", dot: "bg-red-500" },
  DENIED: { badge: "text-red-400 border-red-500/30 bg-red-500/5", dot: "bg-red-500" },
}

const CATEGORY_COLORS: Record<AuditCategory, string> = {
  AUTH: "text-blue-400",
  RBAC: "text-purple-400",
  DATA: "text-cyan-400",
  AI: "text-emerald-400",
  SYSTEM: "text-yellow-400",
  BILLING: "text-orange-400",
  SECURITY: "text-red-400",
}

// Mock event generator for real-time simulation
const LIVE_EVENTS = [
  { category: "AUTH" as const, event: "SESSION_REFRESH", actor: "senior@rayn.law", severity: "SUCCESS" as const, details: "Token refreshed automatically" },
  { category: "DATA" as const, event: "DOCUMENT_VIEW", actor: "associate@rayn.law", severity: "INFO" as const, details: "Viewed brief_settlement.pdf" },
  { category: "AI" as const, event: "AI_QUERY_EXECUTED", actor: "counsel@rayn.law", severity: "INFO" as const, details: "Strategy simulation consumed 8,200 tokens" },
  { category: "SECURITY" as const, event: "SUSPICIOUS_IP_DETECTED", actor: "SYSTEM", severity: "WARNING" as const, details: "Unrecognized IP 203.0.113.99 attempted access" },
  { category: "DATA" as const, event: "FILE_DOWNLOAD", actor: "paralegal@rayn.law", severity: "INFO" as const, details: "Downloaded discovery_batch_04.zip" },
  { category: "SYSTEM" as const, event: "HEALTH_CHECK", actor: "SYSTEM", severity: "SUCCESS" as const, details: "All services responding normally" },
]

export default function AuditLogPage() {
  const { role } = useAuth()
  const { tenant } = useTenant()
  const { events, log } = useAuditLog(tenant.id)
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | "ALL">("ALL")
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | "ALL">("ALL")
  const [isLive, setIsLive] = useState(true)
  const [newEventCount, setNewEventCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Live event generator
  useEffect(() => {
    if (!isLive || role !== "SUPER_ADMIN") return

    intervalRef.current = setInterval(() => {
      const template = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)]
      log({
        tenantId: tenant.id,
        category: template.category,
        event: template.event,
        actor: template.actor,
        ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        severity: template.severity,
        details: template.details,
      })
      setNewEventCount(prev => prev + 1)
    }, 4000 + Math.random() * 6000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isLive, tenant.id, role, log])

  if (role !== "SUPER_ADMIN") {
    return <AccessDenied requiredRole="Super Admin" message="The Audit Ledger is restricted to Super Administrators only." />
  }

  const filteredEvents = events.filter(e => {
    if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false
    if (severityFilter !== "ALL" && e.severity !== severityFilter) return false
    return true
  })

  const severityCounts = {
    SUCCESS: events.filter(e => e.severity === "SUCCESS").length,
    INFO: events.filter(e => e.severity === "INFO").length,
    WARNING: events.filter(e => e.severity === "WARNING").length,
    CRITICAL: events.filter(e => e.severity === "CRITICAL").length,
    DENIED: events.filter(e => e.severity === "DENIED").length,
  }

  return (
    <div className="space-y-8 h-full flex flex-col animate-in fade-in">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">System Audit</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">
            Immutable Event Ledger · {tenant.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
              isLive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-white/40"
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" : "bg-white/30"}`} />
            {isLive ? "Live" : "Paused"}
          </button>
          <Button variant="outline" size="sm" className="h-9 gap-2 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold">
            <DownloadCloud className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.entries(severityCounts) as [AuditSeverity, number][]).map(([sev, count]) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(severityFilter === sev ? "ALL" : sev)}
            className={`p-4 rounded-xl border transition-all text-left ${
              severityFilter === sev
                ? `${SEVERITY_STYLES[sev].badge} ring-1`
                : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${SEVERITY_STYLES[sev].dot}`} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">{sev}</span>
            </div>
            <div className="text-2xl font-mono text-white/80">{count}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-white/30" />
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono mr-2">Category:</span>
        {["ALL", "AUTH", "RBAC", "DATA", "AI", "SYSTEM", "BILLING", "SECURITY"].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat as AuditCategory | "ALL")}
            className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all ${
              categoryFilter === cat
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Table */}
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none flex-1 overflow-hidden flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">
              Events ({filteredEvents.length})
            </CardTitle>
            {newEventCount > 0 && isLive && (
              <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-emerald-400 animate-pulse">
                <Activity className="w-3 h-3" /> +{newEventCount} new
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40 w-[100px]">ID</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Timestamp</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40 w-[80px]">Category</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Event</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Actor</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Details</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40 w-[90px]">IP</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40 text-right w-[90px]">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.slice(0, 50).map((evt) => (
                <TableRow key={evt.id} className="border-white/5 hover:bg-white/[0.02] font-mono text-xs animate-in fade-in duration-300">
                  <TableCell className="text-white/30">{evt.id}</TableCell>
                  <TableCell className="text-white/50">
                    {new Date(evt.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                  </TableCell>
                  <TableCell>
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${CATEGORY_COLORS[evt.category]}`}>
                      {evt.category}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-white/80">{evt.event}</TableCell>
                  <TableCell className="text-white/50">{evt.actor}</TableCell>
                  <TableCell className="text-white/40 max-w-[200px] truncate">{evt.details}</TableCell>
                  <TableCell className="text-white/30">{evt.ip}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`font-mono font-normal text-[9px] uppercase tracking-widest rounded ${SEVERITY_STYLES[evt.severity].badge}`}>
                      {evt.severity}
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
