"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTenant } from "@/lib/tenant-context"
import {
  Shield, Database, HardDrive, BrainCircuit, Activity,
  CheckCircle2, AlertTriangle, Loader2, RefreshCw, Server,
  Key, Lock, Cloud, Wifi, Zap
} from "lucide-react"

interface ServiceStatus {
  name: string
  service: string
  icon: React.ElementType
  status: "healthy" | "degraded" | "testing" | "offline"
  latency: number | null
  details: string[]
  color: string
}

export function AWSHub() {
  const { tenant } = useTenant()
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [testingService, setTestingService] = useState<string | null>(null)

  // Initialize service statuses based on tenant
  useEffect(() => {
    setServices([
      {
        name: "Authentication",
        service: `AWS Cognito · ${tenant.cognitoPoolId}`,
        icon: Shield,
        status: "healthy",
        latency: 23,
        details: [
          `User Pool: ${tenant.cognitoPoolId}`,
          `Active Sessions: ${tenant.seatsUsed}`,
          `MFA Enforcement: Enabled`,
          `Token Expiry: 3600s`,
        ],
        color: "emerald",
      },
      {
        name: "Primary Database",
        service: `Amazon RDS PostgreSQL · ${tenant.region}`,
        icon: Database,
        status: "healthy",
        latency: 8,
        details: [
          `Schema: ${tenant.rdsSchemaName}`,
          `Engine: PostgreSQL 16.2`,
          `Storage: 120 GB / 500 GB`,
          `Replication Lag: 0.2ms`,
          `Row-Level Security: Enabled`,
        ],
        color: "blue",
      },
      {
        name: "Document Storage",
        service: `Amazon S3 + KMS · ${tenant.s3Bucket}`,
        icon: HardDrive,
        status: "healthy",
        latency: 12,
        details: [
          `Bucket: ${tenant.s3Bucket}`,
          `Encryption: AES-256 (SSE-KMS)`,
          `KMS Key: ${tenant.kmsKeyId.slice(-20)}`,
          `Objects: ${tenant.id === "rayn" ? "14,291" : tenant.id === "apex" ? "3,820" : "1,204"}`,
          `Versioning: Enabled`,
        ],
        color: "orange",
      },
      {
        name: "Audit Log Store",
        service: `Amazon DynamoDB · Global Tables`,
        icon: Activity,
        status: "healthy",
        latency: 4,
        details: [
          `Table: rayn-audit-${tenant.id}`,
          `Read IOPS: 2,400 / 5,000`,
          `Write IOPS: 800 / 2,000`,
          `TTL: 7 Years`,
          `Point-in-time Recovery: Enabled`,
        ],
        color: "purple",
      },
      {
        name: "AI / LLM Endpoints",
        service: `Amazon Bedrock · ${tenant.region}`,
        icon: BrainCircuit,
        status: "healthy",
        latency: 145,
        details: [
          `Models: Claude 3.5 Sonnet, Llama 3.1`,
          `Context Limit: ${(tenant.aiContextLimit / 1000).toFixed(0)}k tokens`,
          `Monthly Budget: ${(tenant.aiMonthlyBudget / 1000000).toFixed(0)}M tokens`,
          `Tokens Used: ${(tenant.aiTokensUsed / 1000000).toFixed(1)}M`,
          `Guardrails: PII Redaction, Prompt Shield`,
        ],
        color: "cyan",
      },
      {
        name: "Monitoring",
        service: `Amazon CloudWatch · Alarms`,
        icon: Cloud,
        status: "healthy",
        latency: 18,
        details: [
          `Active Alarms: 0 / 24`,
          `Log Groups: 6`,
          `Dashboard: rayn-${tenant.id}-ops`,
          `Anomaly Detection: Enabled`,
        ],
        color: "yellow",
      },
    ])
  }, [tenant])

  const handleTestConnection = async (serviceName: string) => {
    setTestingService(serviceName)
    setServices(prev => prev.map(s =>
      s.name === serviceName ? { ...s, status: "testing" as const, latency: null } : s
    ))

    // Simulate network latency test
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const newLatency = Math.floor(Math.random() * 50) + 3
    setServices(prev => prev.map(s =>
      s.name === serviceName ? { ...s, status: "healthy" as const, latency: newLatency } : s
    ))
    setTestingService(null)
  }

  const getStatusBadge = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return (
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" /> Healthy
          </span>
        )
      case "testing":
        return (
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-yellow-400">
            <Loader2 className="w-3 h-3 animate-spin" /> Testing
          </span>
        )
      case "degraded":
        return (
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-yellow-400">
            <AlertTriangle className="w-3 h-3" /> Degraded
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-red-400">
            <AlertTriangle className="w-3 h-3" /> Offline
          </span>
        )
    }
  }

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Summary Banner */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-mono mb-2">Services Status</div>
          <div className="text-2xl font-mono text-emerald-400">{services.filter(s => s.status === "healthy").length}/{services.length}</div>
          <div className="text-[9px] text-emerald-400/40 font-mono uppercase mt-1">All Operational</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Region</div>
          <div className="text-2xl font-mono text-white/80">{tenant.region}</div>
          <div className="text-[9px] text-white/30 font-mono uppercase mt-1">Primary</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Encryption</div>
          <div className="text-2xl font-mono text-white/80 flex items-center gap-2"><Lock className="w-5 h-5" /> KMS</div>
          <div className="text-[9px] text-white/30 font-mono uppercase mt-1">AES-256 Active</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Uptime</div>
          <div className="text-2xl font-mono text-emerald-400">99.97%</div>
          <div className="text-[9px] text-white/30 font-mono uppercase mt-1">Last 30 Days</div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {services.map(svc => (
          <Card key={svc.name} className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[svc.color]}`}>
                    <svc.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-white/90">{svc.name}</CardTitle>
                    <CardDescription className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-0.5 max-w-[200px] truncate">{svc.service}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(svc.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {svc.details.map((detail, i) => {
                  const [label, ...rest] = detail.split(": ")
                  const value = rest.join(": ")
                  return (
                    <div key={i} className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/35 uppercase tracking-widest">{label}</span>
                      <span className="text-white/70 text-right">{value}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <div className="text-[10px] font-mono text-white/30">
                  {svc.latency !== null ? (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      {svc.latency}ms latency
                    </span>
                  ) : (
                    <span className="text-yellow-400">Testing...</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={testingService !== null}
                  onClick={() => handleTestConnection(svc.name)}
                  className="h-7 text-[9px] uppercase tracking-widest font-bold border-white/10 text-white/50 hover:text-white hover:bg-white/5 rounded-lg gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${testingService === svc.name ? "animate-spin" : ""}`} />
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Architecture Note */}
      <div className="border border-white/[0.06] rounded-xl p-6 bg-white/[0.01]">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-4 flex items-center gap-2">
          <Server className="w-3.5 h-3.5" /> Architecture Notes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-white/50 font-mono leading-relaxed">
          <div>
            <h4 className="text-white/70 font-bold mb-2 uppercase text-[10px] tracking-widest">Data Isolation</h4>
            <p>Each tenant operates within an isolated RDS schema with row-level security policies. Cross-tenant queries are blocked at the database level.</p>
          </div>
          <div>
            <h4 className="text-white/70 font-bold mb-2 uppercase text-[10px] tracking-widest">Encryption</h4>
            <p>All data at rest encrypted via tenant-specific KMS keys (RSA-4096). In-transit via TLS 1.3. S3 objects use SSE-KMS with bucket policies.</p>
          </div>
          <div>
            <h4 className="text-white/70 font-bold mb-2 uppercase text-[10px] tracking-widest">AI Guardrails</h4>
            <p>Bedrock endpoints enforce per-tenant context limits and token budgets. Prompt injection shields and PII auto-redaction are applied pre-inference.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
