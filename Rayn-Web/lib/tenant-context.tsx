"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

// ── Tenant Type ─────────────────────────────────────────────────────
export interface Tenant {
  id: string
  name: string
  domain: string
  region: string
  logo: string
  plan: "professional" | "enterprise" | "unlimited"
  seatsTotal: number
  seatsUsed: number
  aiContextLimit: number // tokens per request
  aiMonthlyBudget: number // total tokens per month
  aiTokensUsed: number
  kmsKeyId: string
  cognitoPoolId: string
  rdsSchemaName: string
  s3Bucket: string
  createdAt: string
}

// ── Mock Tenant Database ────────────────────────────────────────────
const TENANT_DB: Tenant[] = [
  {
    id: "rayn",
    name: "Rayn & Partners LLP",
    domain: "rayn.law",
    region: "us-east-1",
    logo: "R",
    plan: "enterprise",
    seatsTotal: 15,
    seatsUsed: 10,
    aiContextLimit: 200000,
    aiMonthlyBudget: 50000000,
    aiTokensUsed: 28400000,
    kmsKeyId: "arn:aws:kms:us-east-1:****:key/mrk-rayn-prod-2026",
    cognitoPoolId: "us-east-1_RaynProd",
    rdsSchemaName: "tenant_rayn",
    s3Bucket: "rayn-legal-docs-prod",
    createdAt: "2024-03-15",
  },
  {
    id: "apex",
    name: "Apex Legal Group",
    domain: "apexlegal.com",
    region: "eu-west-1",
    logo: "A",
    plan: "professional",
    seatsTotal: 8,
    seatsUsed: 3,
    aiContextLimit: 100000,
    aiMonthlyBudget: 20000000,
    aiTokensUsed: 8200000,
    kmsKeyId: "arn:aws:kms:eu-west-1:****:key/mrk-apex-prod-2026",
    cognitoPoolId: "eu-west-1_ApexProd",
    rdsSchemaName: "tenant_apex",
    s3Bucket: "apex-legal-docs-prod",
    createdAt: "2025-01-22",
  },
  {
    id: "meridian",
    name: "Meridian Chambers",
    domain: "meridian.co.uk",
    region: "ap-south-1",
    logo: "M",
    plan: "professional",
    seatsTotal: 5,
    seatsUsed: 2,
    aiContextLimit: 100000,
    aiMonthlyBudget: 10000000,
    aiTokensUsed: 3100000,
    kmsKeyId: "arn:aws:kms:ap-south-1:****:key/mrk-mer-prod-2026",
    cognitoPoolId: "ap-south-1_MeridianProd",
    rdsSchemaName: "tenant_meridian",
    s3Bucket: "meridian-legal-docs-prod",
    createdAt: "2025-09-10",
  },
]

// ── Tenant-scoped mock data ─────────────────────────────────────────
export interface TenantCase {
  id: string
  title: string
  client: string
  status: "Active" | "Closed" | "Pending"
  progress: number
  assignee: string
  practiceArea: string
}

export interface TenantUser {
  id: string
  name: string
  email: string
  role: string
  status: "Active" | "Suspended" | "Invited"
  lastActive: string
  mfaEnabled: boolean
}

const TENANT_CASES: Record<string, TenantCase[]> = {
  rayn: [
    { id: "M-1024", title: "Smith v. OmniCorp", client: "OmniCorp", status: "Active", progress: 85, assignee: "Sarah Jenkins", practiceArea: "Corporate Litigation" },
    { id: "M-1025", title: "Estate of M. Jane", client: "Jane Estate", status: "Active", progress: 32, assignee: "Michael Tass", practiceArea: "Estate Law" },
    { id: "M-1026", title: "Techstart Merger", client: "Techstart Inc", status: "Active", progress: 65, assignee: "Marcus Dean", practiceArea: "M&A" },
    { id: "M-1027", title: "Global Tech Patent Defense", client: "Global Tech", status: "Pending", progress: 10, assignee: "Laura Chen", practiceArea: "IP Prosecution" },
    { id: "M-1028", title: "Estate of V. Richardson", client: "Richardson Family", status: "Active", progress: 72, assignee: "James Whitfield", practiceArea: "Estate Law" },
  ],
  apex: [
    { id: "AX-401", title: "NovaChem Regulatory Filing", client: "NovaChem", status: "Active", progress: 45, assignee: "Nadia Petrova", practiceArea: "Regulatory Compliance" },
    { id: "AX-402", title: "Greenfield Land Dispute", client: "Greenfield Corp", status: "Active", progress: 60, assignee: "Tom Harrington", practiceArea: "Real Estate" },
    { id: "AX-403", title: "DataPrime Breach Response", client: "DataPrime", status: "Pending", progress: 5, assignee: "Nadia Petrova", practiceArea: "Data Privacy" },
  ],
  meridian: [
    { id: "MC-201", title: "Crown v. Ashworth", client: "R. Ashworth", status: "Active", progress: 50, assignee: "Eleanor Voss", practiceArea: "Criminal Defense" },
    { id: "MC-202", title: "Brighton Estates Conveyance", client: "Brighton Ltd", status: "Active", progress: 80, assignee: "Eleanor Voss", practiceArea: "Conveyancing" },
  ],
}

const TENANT_USERS: Record<string, TenantUser[]> = {
  rayn: [
    { id: "u1", name: "System Administrator", email: "admin@rayn.law", role: "Super Admin", status: "Active", lastActive: "Just now", mfaEnabled: true },
    { id: "u2", name: "James Whitfield", email: "equity@rayn.law", role: "Equity Partner", status: "Active", lastActive: "2 mins ago", mfaEnabled: true },
    { id: "u3", name: "Laura Chen", email: "partner@rayn.law", role: "Salaried Partner", status: "Active", lastActive: "15 mins ago", mfaEnabled: true },
    { id: "u4", name: "Marcus Dean", email: "counsel@rayn.law", role: "Counsel", status: "Active", lastActive: "1 hour ago", mfaEnabled: false },
    { id: "u5", name: "Sarah Jenkins", email: "senior@rayn.law", role: "Senior Associate", status: "Active", lastActive: "30 mins ago", mfaEnabled: false },
    { id: "u6", name: "Michael Tass", email: "associate@rayn.law", role: "Associate", status: "Active", lastActive: "45 mins ago", mfaEnabled: false },
    { id: "u7", name: "David Sullivan", email: "intern@rayn.law", role: "Junior Associate", status: "Active", lastActive: "2 hours ago", mfaEnabled: false },
    { id: "u8", name: "Jessica Rivera", email: "paralegal@rayn.law", role: "Paralegal", status: "Active", lastActive: "1 hour ago", mfaEnabled: false },
    { id: "u9", name: "Finance Dept.", email: "billing@rayn.law", role: "Billing Admin", status: "Active", lastActive: "3 hours ago", mfaEnabled: true },
    { id: "u10", name: "OmniCorp Legal", email: "client@rayn.law", role: "Guest Client", status: "Active", lastActive: "1 day ago", mfaEnabled: false },
  ],
  apex: [
    { id: "u11", name: "Apex Admin", email: "admin@apexlegal.com", role: "Super Admin", status: "Active", lastActive: "5 mins ago", mfaEnabled: true },
    { id: "u12", name: "Nadia Petrova", email: "partner@apexlegal.com", role: "Equity Partner", status: "Active", lastActive: "1 hour ago", mfaEnabled: true },
    { id: "u13", name: "Tom Harrington", email: "associate@apexlegal.com", role: "Associate", status: "Active", lastActive: "3 hours ago", mfaEnabled: false },
  ],
  meridian: [
    { id: "u14", name: "Meridian Admin", email: "admin@meridian.co.uk", role: "Super Admin", status: "Active", lastActive: "10 mins ago", mfaEnabled: true },
    { id: "u15", name: "Eleanor Voss", email: "counsel@meridian.co.uk", role: "Counsel", status: "Active", lastActive: "2 hours ago", mfaEnabled: false },
  ],
}

// ── Context ─────────────────────────────────────────────────────────
interface TenantContextType {
  tenant: Tenant
  tenants: Tenant[]
  switchTenant: (id: string) => void
  cases: TenantCase[]
  users: TenantUser[]
  addUser: (user: Omit<TenantUser, "id">) => void
  removeUser: (id: string) => void
  updateUser: (id: string, updates: Partial<TenantUser>) => void
  consumeTokens: (count: number) => void
  addSeat: () => void
  removeSeat: () => void
  updatePlan: (plan: Tenant["plan"]) => void
}

const TenantContext = createContext<TenantContextType | null>(null)

export const useTenant = () => {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error("useTenant must be used within TenantProvider")
  return ctx
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(TENANT_DB)
  const [activeTenantId, setActiveTenantId] = useState<string>("rayn")
  const [userStore, setUserStore] = useState<Record<string, TenantUser[]>>(TENANT_USERS)

  // Persist tenant selection
  useEffect(() => {
    const saved = localStorage.getItem("rayn_tenant")
    if (saved && TENANT_DB.find(t => t.id === saved)) {
      setActiveTenantId(saved)
    }
  }, [])

  const tenant = tenants.find(t => t.id === activeTenantId) || tenants[0]
  const cases = TENANT_CASES[activeTenantId] || []
  const users = userStore[activeTenantId] || []

  const switchTenant = useCallback((id: string) => {
    setActiveTenantId(id)
    localStorage.setItem("rayn_tenant", id)
  }, [])

  const addUser = useCallback((user: Omit<TenantUser, "id">) => {
    setUserStore(prev => ({
      ...prev,
      [activeTenantId]: [...(prev[activeTenantId] || []), { ...user, id: `u${Date.now()}` }],
    }))
    // increment seats used
    setTenants(prev => prev.map(t => t.id === activeTenantId ? { ...t, seatsUsed: t.seatsUsed + 1 } : t))
  }, [activeTenantId])

  const removeUser = useCallback((id: string) => {
    setUserStore(prev => ({
      ...prev,
      [activeTenantId]: (prev[activeTenantId] || []).filter(u => u.id !== id),
    }))
    setTenants(prev => prev.map(t => t.id === activeTenantId ? { ...t, seatsUsed: Math.max(0, t.seatsUsed - 1) } : t))
  }, [activeTenantId])

  const updateUser = useCallback((id: string, updates: Partial<TenantUser>) => {
    setUserStore(prev => ({
      ...prev,
      [activeTenantId]: (prev[activeTenantId] || []).map(u => u.id === id ? { ...u, ...updates } : u),
    }))
  }, [activeTenantId])

  const consumeTokens = useCallback((count: number) => {
    setTenants(prev => prev.map(t => t.id === activeTenantId ? { ...t, aiTokensUsed: t.aiTokensUsed + count } : t))
  }, [activeTenantId])

  const addSeat = useCallback(() => {
    setTenants(prev => prev.map(t => t.id === activeTenantId ? { ...t, seatsTotal: t.seatsTotal + 1 } : t))
  }, [activeTenantId])

  const removeSeat = useCallback(() => {
    setTenants(prev => prev.map(t => t.id === activeTenantId && t.seatsTotal > t.seatsUsed ? { ...t, seatsTotal: t.seatsTotal - 1 } : t))
  }, [activeTenantId])

  const updatePlan = useCallback((plan: Tenant["plan"]) => {
    const limits: Record<string, { ctx: number; budget: number }> = {
      professional: { ctx: 100000, budget: 20000000 },
      enterprise: { ctx: 200000, budget: 50000000 },
      unlimited: { ctx: 500000, budget: 200000000 },
    }
    setTenants(prev => prev.map(t => t.id === activeTenantId ? {
      ...t,
      plan,
      aiContextLimit: limits[plan].ctx,
      aiMonthlyBudget: limits[plan].budget,
    } : t))
  }, [activeTenantId])

  return (
    <TenantContext.Provider value={{
      tenant, tenants, switchTenant,
      cases, users,
      addUser, removeUser, updateUser,
      consumeTokens, addSeat, removeSeat, updatePlan,
    }}>
      {children}
    </TenantContext.Provider>
  )
}
