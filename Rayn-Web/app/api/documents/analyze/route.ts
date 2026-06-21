import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    const tenantId = (session?.user as any)?.tenantId || "rayn"

    const { text } = await req.json()
    if (!text) {
      return NextResponse.json({ error: "Missing required parameter: text" }, { status: 400 })
    }

    // ── SAAS PLAN & CONTEXT GATING ──────────────────────────────────────
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    const inputTokens = Math.ceil(text.length / 4)

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

    let resultText = ""
    const systemPrompt = `You are a highly capable AI Legal Assistant.
Analyze the following legal text. Please extract the key clauses, summarize the main points, and flag any potential risks or unusual liabilities. Format your output strictly in markdown, using headings, clear bullet points, and bold text for emphasis where appropriate. Maintain a professional, objective legal tone.`

    // Check if AWS Credentials are set
    const hasAwsCreds = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)

    if (hasAwsCreds) {
      try {
        const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "ap-south-1" })

        const payload = {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
        }

        const command = new InvokeModelCommand({
          modelId: "anthropic.claude-3-5-sonnet-20240620-v1",
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify(payload),
        })

        const resp = await client.send(command)

        // Try to extract response body text; fall back to stringifying the response
        let bodyText = ""
        try {
          // In some environments resp.Body has transformToString
          if ((resp as any).body && typeof (resp as any).body.transformToString === "function") {
            bodyText = await (resp as any).body.transformToString()
          } else if ((resp as any).body instanceof Uint8Array) {
            bodyText = new TextDecoder().decode((resp as any).body)
          } else if (typeof (resp as any).body === "string") {
            bodyText = (resp as any).body
          } else {
            bodyText = JSON.stringify(resp)
          }
        } catch (e) {
          bodyText = JSON.stringify(resp)
        }

        resultText = bodyText
      } catch (bedrockError: any) {
        console.warn("AWS Bedrock execution failed, falling back to simulated analysis:", bedrockError)
        resultText = generateMockAnalysis(text)
      }
    } else {
      console.log("AWS Credentials not configured. Using simulated analysis fallback.")
      resultText = generateMockAnalysis(text)
    }

    // ── INCREMENT USAGE ──────────────────────────────────────────────────
    if (tenant) {
      const outputTokens = Math.ceil(resultText.length / 4)
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

    return NextResponse.json({
      success: true,
      result: resultText,
    })
  } catch (error: any) {
    console.error("Document analysis error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

// Simulated local fallback analysis engine
function generateMockAnalysis(text: string): string {
  const sampleSnippet = text.length > 200 ? text.substring(0, 200) + "..." : text
  return `## AI Document Analysis (Simulated Fallback)

> [!NOTE]
> This analysis was generated locally because the AWS Bedrock environment credentials are not active.

### 📋 Executive Summary
A preliminary review of the document snippet:
*"${sampleSnippet}"*

### 🔑 Key Clauses Identified
1. **Governing Law / Jurisdiction:** Defaulting to organization regional jurisdiction configuration.
2. **Term and Termination:** Standard operational parameters.
3. **Covenants:** Standard obligations between the contracting parties.

### ⚠️ Liability & Risk Assessment
* **Anomalies:** No standard liability caps or mutual indemnifications were parsed in the short text.
* **Risk Level:** **LOW/MEDIUM** (requires complete clause validation once AWS Bedrock connection is active).
`
}
