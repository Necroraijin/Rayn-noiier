"use client"


// ── Audit Event Types ───────────────────────────────────────────────
export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL" | "SUCCESS" | "DENIED"
export type AuditCategory = "AUTH" | "RBAC" | "DATA" | "AI" | "SYSTEM" | "BILLING" | "SECURITY"

export interface AuditEvent {
  id: string
  timestamp: string
  tenantId: string
  category: AuditCategory
  event: string
  actor: string
  ip: string
  severity: AuditSeverity
  details?: string
  resourceId?: string
}

// ── In-Memory Audit Store ───────────────────────────────────────────
type Listener = (events: AuditEvent[]) => void

class AuditLogger {
  private events: AuditEvent[] = []
  private listeners: Set<Listener> = new Set()
  private counter = 9000

  constructor() {
    // Seed with initial events per tenant
    this.seed()
  }

  private seed() {
    const seedEvents: Omit<AuditEvent, "id">[] = [
      { timestamp: "2026-06-08T17:31:02Z", tenantId: "rayn", category: "DATA", event: "DOCUMENT_ANALYSIS_VIEW", actor: "senior@rayn.law", ip: "192.168.1.42", severity: "INFO", details: "Viewed analysis for Matter M-1024" },
      { timestamp: "2026-06-08T17:15:44Z", tenantId: "rayn", category: "DATA", event: "MATTER_STATUS_UPDATE", actor: "counsel@rayn.law", ip: "192.168.1.18", severity: "INFO", details: "Updated M-1026 status to Active" },
      { timestamp: "2026-06-08T16:42:11Z", tenantId: "rayn", category: "DATA", event: "FILE_DOWNLOAD", actor: "client@rayn.law", ip: "203.0.113.88", severity: "INFO", details: "Downloaded motion_to_compel.pdf" },
      { timestamp: "2026-06-08T15:12:00Z", tenantId: "rayn", category: "SECURITY", event: "UNAUTHORIZED_ACCESS_ATTEMPT", actor: "UNKNOWN", ip: "45.22.19.11", severity: "DENIED", details: "Failed login attempt with invalid credentials (3rd attempt)" },
      { timestamp: "2026-06-08T14:00:23Z", tenantId: "rayn", category: "RBAC", event: "USER_ROLE_CHANGE", actor: "admin@rayn.law", ip: "192.168.1.1", severity: "WARNING", details: "Changed David Sullivan from Intern to Associate" },
      { timestamp: "2026-06-08T13:55:01Z", tenantId: "rayn", category: "AUTH", event: "LOGIN_SUCCESS", actor: "senior@rayn.law", ip: "192.168.1.42", severity: "SUCCESS", details: "MFA verified via TOTP" },
      { timestamp: "2026-06-08T13:40:12Z", tenantId: "rayn", category: "AI", event: "AI_ANALYSIS_RUN", actor: "associate@rayn.law", ip: "192.168.1.55", severity: "INFO", details: "Document analysis consumed 12,400 tokens" },
      { timestamp: "2026-06-08T12:30:00Z", tenantId: "rayn", category: "SYSTEM", event: "KMS_KEY_ROTATION", actor: "SYSTEM", ip: "internal", severity: "SUCCESS", details: "Master encryption key rotated (RSA-4096)" },
      { timestamp: "2026-06-08T11:20:00Z", tenantId: "rayn", category: "BILLING", event: "SEAT_ADDED", actor: "admin@rayn.law", ip: "192.168.1.1", severity: "INFO", details: "Added 1 seat (total: 15)" },
      { timestamp: "2026-06-08T10:05:00Z", tenantId: "rayn", category: "SECURITY", event: "IP_WHITELIST_UPDATED", actor: "admin@rayn.law", ip: "192.168.1.1", severity: "WARNING", details: "Added CIDR block 10.0.0.0/8" },
      // Apex events
      { timestamp: "2026-06-08T16:00:00Z", tenantId: "apex", category: "AUTH", event: "LOGIN_SUCCESS", actor: "admin@apexlegal.com", ip: "10.0.1.5", severity: "SUCCESS", details: "Admin login from Berlin office" },
      { timestamp: "2026-06-08T14:30:00Z", tenantId: "apex", category: "DATA", event: "MATTER_CREATED", actor: "partner@apexlegal.com", ip: "10.0.1.12", severity: "INFO", details: "Created matter AX-403: DataPrime Breach Response" },
      { timestamp: "2026-06-08T12:15:00Z", tenantId: "apex", category: "AI", event: "AI_CONTEXT_LIMIT_WARNING", actor: "SYSTEM", ip: "internal", severity: "WARNING", details: "Tenant approaching 80% of monthly AI budget" },
      // Meridian events
      { timestamp: "2026-06-08T15:00:00Z", tenantId: "meridian", category: "AUTH", event: "LOGIN_SUCCESS", actor: "admin@meridian.co.uk", ip: "172.16.0.5", severity: "SUCCESS", details: "Admin login from London chambers" },
      { timestamp: "2026-06-08T13:00:00Z", tenantId: "meridian", category: "DATA", event: "FILE_UPLOAD", actor: "counsel@meridian.co.uk", ip: "172.16.0.12", severity: "INFO", details: "Uploaded witness_statement_ashworth.pdf (AES-256 encrypted)" },
    ]

    this.events = seedEvents.map((e, i) => ({
      ...e,
      id: `EVT-${8900 + i}`,
    }))
    this.counter = 8900 + seedEvents.length
  }

  log(event: Omit<AuditEvent, "id" | "timestamp">) {
    const newEvent: AuditEvent = {
      ...event,
      id: `EVT-${++this.counter}`,
      timestamp: new Date().toISOString(),
    }
    this.events = [newEvent, ...this.events]
    this.notify()
    return newEvent
  }

  getEvents(tenantId?: string): AuditEvent[] {
    if (tenantId) return this.events.filter(e => e.tenantId === tenantId)
    return [...this.events]
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.events))
  }
}

// Singleton instance
export const auditLogger = new AuditLogger()

// ── React Hook ──────────────────────────────────────────────────────
import { useState, useEffect } from "react"

export function useAuditLog(tenantId?: string) {
  const [events, setEvents] = useState<AuditEvent[]>(() => auditLogger.getEvents(tenantId))

  useEffect(() => {
    const unsub = auditLogger.subscribe(() => {
      setEvents(auditLogger.getEvents(tenantId))
    })
    return unsub
  }, [tenantId])

  const log = (event: Omit<AuditEvent, "id" | "timestamp">) => auditLogger.log(event)

  return { events, log }
}
