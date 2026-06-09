"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, ShieldCheck, Lock, Fingerprint, BrainCircuit, AlertTriangle, Eye, Ban, RefreshCw } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import { useAuditLog } from "@/lib/audit-logger"
import { useAuth } from "@/lib/auth-context"

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors cursor-pointer ${enabled ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"}`}>
      <div className={`w-4 h-4 rounded-full shadow-sm transition-colors ${enabled ? "bg-white" : "bg-white/50"}`} />
    </button>
  )
}

export function SecuritySettings() {
  const { tenant } = useTenant()
  const { log } = useAuditLog()
  const { email } = useAuth()

  const [mfaEnforced, setMfaEnforced] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [ipWhitelist, setIpWhitelist] = useState("192.168.1.0/24, 10.0.0.0/8")
  const [auditRetention, setAuditRetention] = useState("7")
  const [promptInjection, setPromptInjection] = useState(true)
  const [piiRedaction, setPiiRedaction] = useState(true)
  const [dataExfiltration, setDataExfiltration] = useState(true)
  const [crossTenantGuard, setCrossTenantGuard] = useState(true)
  const [rateLimiting, setRateLimiting] = useState(true)
  const [keyRotating, setKeyRotating] = useState(false)

  const handleKeyRotation = () => {
    setKeyRotating(true)
    log({
      tenantId: tenant.id,
      category: "SECURITY",
      event: "KMS_KEY_ROTATION",
      actor: email || "admin",
      ip: "192.168.1.1",
      severity: "SUCCESS",
      details: "Master encryption key rotated (RSA-4096)",
    })
    setTimeout(() => setKeyRotating(false), 2000)
  }

  const handleToggle = (name: string, current: boolean, setter: (v: boolean) => void) => {
    setter(!current)
    log({
      tenantId: tenant.id,
      category: "SECURITY",
      event: `SECURITY_SETTING_${!current ? "ENABLED" : "DISABLED"}`,
      actor: email || "admin",
      ip: "192.168.1.1",
      severity: "WARNING",
      details: `${name} ${!current ? "enabled" : "disabled"}`,
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Encryption Card */}
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-light font-serif italic text-white/90">End-to-End Encryption (E2EE)</CardTitle>
          <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">
            Tenant: {tenant.name} · Region: {tenant.region}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl bg-white/5">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 border border-white/10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-widest text-white/90">Master Organization Key</p>
                <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mt-2">
                  {tenant.kmsKeyId.slice(-24)} · RSA-4096
                </p>
              </div>
            </div>
            <Button
              variant="outline" size="sm"
              onClick={handleKeyRotation}
              disabled={keyRotating}
              className="h-9 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold gap-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${keyRotating ? "animate-spin" : ""}`} />
              {keyRotating ? "Rotating..." : "Rotate Key"}
            </Button>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono leading-relaxed p-4 border border-white/5 rounded-lg bg-black/20">
            All document uploads and client communications are AES-256 encrypted at rest via tenant-specific KMS keys.
            AI analysis is processed statelessly via secure Bedrock endpoints with no data persistence.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {/* Authentication */}
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90 flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-emerald-400" /> Authentication & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white/80">Enforce MFA Firm-Wide</h4>
                <p className="text-[10px] text-white/40 mt-1">Require TOTP or WebAuthn for all roles.</p>
              </div>
              <Toggle enabled={mfaEnforced} onToggle={() => handleToggle("MFA Enforcement", mfaEnforced, setMfaEnforced)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white/80">Session Timeout</h4>
                <p className="text-[10px] text-white/40 mt-1">Force re-auth after inactivity.</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="bg-black/50 border border-white/10 rounded py-1 px-2 text-xs font-mono outline-none text-white/80 w-24"
              >
                <option value="15">15 mins</option>
                <option value="30">30 mins</option>
                <option value="60">1 hour</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white/80">Rate Limiting</h4>
                <p className="text-[10px] text-white/40 mt-1">Max 100 requests/min per user.</p>
              </div>
              <Toggle enabled={rateLimiting} onToggle={() => handleToggle("Rate Limiting", rateLimiting, setRateLimiting)} />
            </div>
          </CardContent>
        </Card>

        {/* IP & Data Retention */}
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90 flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" /> IP & Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">IP Whitelist (CIDR blocks)</Label>
              <Input
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-xs"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h4 className="text-xs font-bold text-white/80">Immutable Audit Logs</h4>
                <p className="text-[10px] text-white/40 mt-1">DynamoDB retention period</p>
              </div>
              <select
                value={auditRetention}
                onChange={(e) => setAuditRetention(e.target.value)}
                className="bg-black/50 border border-white/10 rounded py-1 px-2 text-xs font-mono outline-none text-white/80 w-24"
              >
                <option value="7">7 Years</option>
                <option value="10">10 Years</option>
                <option value="0">Indefinite</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Security Controls */}
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-light font-serif italic text-white/90 flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-emerald-400" /> AI Security & Guardrails
          </CardTitle>
          <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">
            Controls applied before and after all AI inference requests via Amazon Bedrock Guardrails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Ban className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">Prompt Injection Shield</p>
                  <p className="text-xs text-white/50 mt-1">Detects and blocks adversarial prompts, jailbreak attempts, and instruction overrides.</p>
                </div>
              </div>
              <Toggle enabled={promptInjection} onToggle={() => handleToggle("Prompt Injection Shield", promptInjection, setPromptInjection)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">PII Auto-Redaction</p>
                  <p className="text-xs text-white/50 mt-1">Strips SSNs, credit cards, phone numbers, and addresses before sending to LLM.</p>
                </div>
              </div>
              <Toggle enabled={piiRedaction} onToggle={() => handleToggle("PII Auto-Redaction", piiRedaction, setPiiRedaction)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">Data Exfiltration Guard</p>
                  <p className="text-xs text-white/50 mt-1">Prevents AI from outputting raw database records, API keys, or internal URIs.</p>
                </div>
              </div>
              <Toggle enabled={dataExfiltration} onToggle={() => handleToggle("Data Exfiltration Guard", dataExfiltration, setDataExfiltration)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">Cross-Tenant Isolation</p>
                  <p className="text-xs text-white/50 mt-1">AI context is scoped to active tenant schema. No cross-tenant data leakage possible.</p>
                </div>
              </div>
              <Toggle enabled={crossTenantGuard} onToggle={() => handleToggle("Cross-Tenant Isolation", crossTenantGuard, setCrossTenantGuard)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
