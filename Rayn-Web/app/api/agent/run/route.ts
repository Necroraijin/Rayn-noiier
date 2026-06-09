import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { searchPrivateDocuments, searchGlobalPrecedents } from "@/lib/ai/vector-store"
import { runResearchAgent, runDraftingAgent, runReviewAgent } from "@/lib/ai/legal-agents"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    const tenantId = (session?.user as any)?.tenantId || "rayn"

    const { query, caseId } = await req.json()
    if (!query) {
      return NextResponse.json({ error: "Missing required parameter: query" }, { status: 400 })
    }

    // ── SAAS PLAN & CONTEXT GATING ──────────────────────────────────────
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    const inputTokens = Math.ceil(query.length / 4)

    if (tenant) {
      // 1. Context Size limit gate
      if (inputTokens > tenant.aiContextLimit) {
        return NextResponse.json({
          error: `AI Context Limit Exceeded: Your plan allows up to ${tenant.aiContextLimit} tokens per request. Current request size: ${inputTokens} tokens. Please upgrade your subscription plan.`
        }, { status: 403 })
      }

      // 2. Monthly Budget limit gate
      if (tenant.aiTokensUsed >= tenant.aiMonthlyBudget) {
        return NextResponse.json({
          error: `AI Monthly Quota Exceeded: You have used ${tenant.aiTokensUsed} of your ${tenant.aiMonthlyBudget} monthly tokens. Please upgrade your subscription plan.`
        }, { status: 403 })
      }
    }

    // ── STEP 1: Retrieval (Agentic RAG context) ────────────────────────
    const privateDocs = await searchPrivateDocuments(tenantId, caseId || null, query, 3)
    const privateContext = privateDocs
      .map(doc => `[File: ${doc.name}] Context: ${doc.url} (Relevance Distance: ${doc.distance.toFixed(4)})`)
      .join("\n\n")

    const globalPrecedents = await searchGlobalPrecedents(query, 3)
    const globalContext = globalPrecedents
      .map(prec => `[Precedent: ${prec.title} (${prec.year})] Citation: ${prec.citation} (${prec.court})\nSummary: ${prec.summary}`)
      .join("\n\n")

    // ── STEP 2: Research Agent ──────────────────────────────────────────
    const researchNotes = await runResearchAgent(query, privateContext, globalContext)

    // ── STEP 3: Drafting Agent ──────────────────────────────────────────
    const draftedText = await runDraftingAgent(query, researchNotes)

    // ── STEP 4: Review / Compliance Agent ──────────────────────────────
    const complianceCritique = await runReviewAgent(draftedText, query)

    // ── INCREMENT USAGE ──────────────────────────────────────────────────
    if (tenant) {
      const outputTokens = Math.ceil((researchNotes.length + draftedText.length + complianceCritique.length) / 4)
      const totalTokens = inputTokens + outputTokens

      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          aiTokensUsed: {
            increment: totalTokens
          }
        }
      })
    }

    // Return the response package
    return NextResponse.json({
      success: true,
      researchNotes,
      draftedText,
      complianceCritique,
      retrievedDocuments: privateDocs.map(d => ({ name: d.name, key: d.s3Key })),
    })
  } catch (error: any) {
    console.error("Multi-agent orchestrator error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
