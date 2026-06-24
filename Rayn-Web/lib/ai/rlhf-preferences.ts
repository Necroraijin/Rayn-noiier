import { prisma } from "../db"
import { getBedrockEmbedding } from "./vector-store"
import { bedrockClient } from "../aws"
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

export async function learnWritingStyle(
  tenantId: string,
  category: string,
  original: string,
  corrected: string
): Promise<void> {
  try {
    const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    const prompt = `Compare these two drafts:
Original: "${original}"
Corrected: "${corrected}"

Extract the style correction, preference, or legal clause improvement rule that the user made. Keep it in a single concise sentence (e.g., "Prefer 'Closing Date' over 'consummation date' for mergers"). Do not add conversational elements.`

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    })

    const response = await bedrockClient.send(command)
    const result = JSON.parse(new TextDecoder().decode(response.body))
    const rationale = result.content?.[0]?.text?.trim() || "Style correction updated."

    // Generate embedding for the style rule to enable context matching in future drafts
    const embedding = await getBedrockEmbedding(rationale)
    const vectorStr = `[${embedding.join(",")}]`

    const prefId = `pref-${Math.random().toString(36).substring(2, 11)}`

    // Execute raw SQL insert to populate pgvector column
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Preference" (id, category, original, corrected, rationale, embedding, "tenantId")
       VALUES ($1, $2, $3, $4, $5, CAST($6 AS vector), $7)`,
      prefId,
      category,
      original,
      corrected,
      rationale,
      vectorStr,
      tenantId
    )
    console.log(`RLHF: Successfully learned writing style rule for tenant ${tenantId}: "${rationale}"`)
  } catch (error) {
    console.error("Failed to execute RLHF learning loop:", error)
  }
}
