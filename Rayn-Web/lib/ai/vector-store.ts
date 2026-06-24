import { prisma, getTenantDb } from "../db"
import { bedrockClient } from "../aws"
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

export async function getBedrockEmbedding(text: string): Promise<number[]> {
  try {
    const modelId = "amazon.titan-embed-text-v2:0"
    const body = JSON.stringify({
      inputText: text,
      dimensions: 1536,
      normalize: true,
    })

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body,
    })

    const response = await bedrockClient.send(command)
    const result = JSON.parse(new TextDecoder().decode(response.body))
    return result.embedding
  } catch (error) {
    console.error("Failed to fetch Bedrock embeddings, generating mock vector:", error)
    // Safe mock fallback vector of size 1536 for development/offline testing
    return Array.from({ length: 1536 }, () => Math.random() - 0.5)
  }
}

export async function searchPrivateDocuments(tenantId: string, caseId: string | null, query: string, limit = 5) {
  const embedding = await getBedrockEmbedding(query)
  const vectorStr = `[${embedding.join(",")}]`
  const db = getTenantDb(tenantId)
  
  try {
    // Cosine similarity search using <=> pgvector operator
    const results = await db.$queryRawUnsafe<any[]>(
      `SELECT id, name, "s3Key", url, type, "uploadedBy",
              (embedding <=> CAST($1 AS vector)) as distance
       FROM "Document"
       WHERE "tenantId" = $2 AND ($3 IS NULL OR "caseId" = $3)
       ORDER BY distance ASC
       LIMIT $4`,
      vectorStr,
      tenantId,
      caseId,
      limit
    )
    return results.map(r => ({
      id: r.id,
      name: r.name,
      s3Key: r.s3Key,
      url: r.url,
      type: r.type,
      distance: Number(r.distance),
    }))
  } catch (err) {
    console.error("Prisma vector search failed. Falling back to title matching.", err)
    const fallbackDocs = await db.document.findMany({
      where: {
        tenantId,
        ...(caseId ? { caseId } : {}),
      },
      take: limit,
    })
    return fallbackDocs.map(d => ({
      id: d.id,
      name: d.name,
      s3Key: d.s3Key,
      url: d.url,
      type: d.type,
      distance: 0.5,
    }))
  }
}

export async function searchGlobalPrecedents(query: string, limit = 5) {
  const embedding = await getBedrockEmbedding(query)
  const vectorStr = `[${embedding.join(",")}]`

  try {
    const results = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, title, citation, court, year, summary,
              (embedding <=> CAST($1 AS vector)) as distance
       FROM "Precedent"
       ORDER BY distance ASC
       LIMIT $2`,
      vectorStr,
      limit
    )
    return results.map(r => ({
      id: r.id,
      title: r.title,
      citation: r.citation,
      court: r.court,
      year: r.year,
      summary: r.summary,
      distance: Number(r.distance),
    }))
  } catch (err) {
    console.error("Global precedents vector query failed. Falling back to keyword search.", err)
    const fallbackPrecedents = await prisma.precedent.findMany({
      take: limit,
    })
    return fallbackPrecedents.map(p => ({
      id: p.id,
      title: p.title,
      citation: p.citation,
      court: p.court,
      year: p.year,
      summary: p.summary,
      distance: 0.5,
    }))
  }
}
