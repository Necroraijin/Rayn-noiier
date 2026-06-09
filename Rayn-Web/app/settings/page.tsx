"use client"

import React from "react"
import { ShieldAlert } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import RoleManagement from "@/components/role-management"
import { FirmConfig } from "@/components/settings/firm-config"
import { BillingSettings } from "@/components/settings/billing-settings"
import { AIPolicySettings } from "@/components/settings/ai-policy-settings"
import { ClientPortalSettings } from "@/components/settings/client-portal-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { AWSHub } from "@/components/settings/aws-hub"
import AccessDenied from "@/components/access-denied"

export default function SettingsPage() {
  const { role } = useAuth()

  if (role !== "SUPER_ADMIN") {
    return <AccessDenied requiredRole="Super Admin" message="The Workspace Preferences panel is restricted to Super Administrators only." />
  }

  const tabTriggerClass = "rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 data-[state=active]:shadow-none px-0 py-3 text-[9px] uppercase font-bold tracking-widest md:text-[10px]"

  return (
    <div className="space-y-8 h-full flex flex-col items-start w-full">
      <div className="border-b border-white/10 pb-4 w-full">
        <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Workspace Preferences</h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">Firm Configuration & Architecture</p>
      </div>

      <Tabs defaultValue="firm" className="w-full space-y-8 flex-1 mt-8">
        <TabsList className="bg-transparent border-b border-white/10 h-auto p-0 w-full justify-start rounded-none space-x-6 overflow-x-auto pb-[1px]">
          <TabsTrigger value="firm" className={tabTriggerClass}>Firm</TabsTrigger>
          <TabsTrigger value="roles" className={tabTriggerClass}>Roles & Users</TabsTrigger>
          <TabsTrigger value="billing" className={tabTriggerClass}>Subscription</TabsTrigger>
          <TabsTrigger value="ai-policy" className={tabTriggerClass}>AI Policy</TabsTrigger>
          <TabsTrigger value="aws" className={tabTriggerClass}>AWS Cloud Stack</TabsTrigger>
          <TabsTrigger value="client" className={tabTriggerClass}>Client Portal</TabsTrigger>
          <TabsTrigger value="integrations" className={tabTriggerClass}>Integrations</TabsTrigger>
          <TabsTrigger value="security" className={tabTriggerClass}>Security</TabsTrigger>
        </TabsList>

        <TabsContent value="firm" className="space-y-8 w-full outline-none">
          <FirmConfig />
        </TabsContent>

        <TabsContent value="roles" className="space-y-8 w-full outline-none">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="billing" className="space-y-8 w-full outline-none">
          <BillingSettings />
        </TabsContent>

        <TabsContent value="ai-policy" className="space-y-8 w-full outline-none">
          <AIPolicySettings />
        </TabsContent>

        <TabsContent value="aws" className="space-y-8 w-full outline-none">
          <AWSHub />
        </TabsContent>

        <TabsContent value="client" className="space-y-8 w-full outline-none">
          <ClientPortalSettings />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-8 w-full outline-none">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-8 w-full outline-none">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
