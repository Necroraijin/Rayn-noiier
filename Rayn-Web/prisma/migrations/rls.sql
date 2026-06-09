-- Enable Row-Level Security on Multi-Tenant Tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Case" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Create Tenant Isolation Policies using app.current_tenant_id context
CREATE POLICY tenant_isolation_user ON "User"
  FOR ALL
  USING ("tenantId" = current_setting('app.current_tenant_id', true));

CREATE POLICY tenant_isolation_case ON "Case"
  FOR ALL
  USING ("tenantId" = current_setting('app.current_tenant_id', true));

CREATE POLICY tenant_isolation_document ON "Document"
  FOR ALL
  USING ("tenantId" = current_setting('app.current_tenant_id', true));

CREATE POLICY tenant_isolation_audit ON "AuditLog"
  FOR ALL
  USING ("tenantId" = current_setting('app.current_tenant_id', true));
