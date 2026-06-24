import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

/**
 * Execute Prisma operations within an isolated transaction where PostgreSQL Row-Level Security (RLS)
 * is bound to the active tenant ID.
 */
export async function withTenantContext<T>(
  tenantId: string,
  operation: (tx: any) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    // Set the PostgreSQL session variable for tenant isolation
    await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = $1`, tenantId)
    return await operation(tx)
  })
}

/**
 * Returns a Prisma client instance extended to automatically execute all queries
 * within the context of the active tenant ID using Row-Level Security (RLS).
 */
export function getTenantDb(tenantId: string) {
  return prisma.$extends({
    query: {
      $allOperations({ model, operation, args, query }) {
        return prisma.$transaction(async (tx) => {
          await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = $1`, tenantId)
          return await query(args)
        })
      }
    }
  })
}
export type TenantDbClient = ReturnType<typeof getTenantDb>
