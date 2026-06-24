import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract"
import { Client } from "pg"

// Initialize AWS Clients
const s3 = new S3Client({})
const bedrock = new BedrockRuntimeClient({})
const textract = new TextractClient({})

// Database URL from environment variables
const dbUrl = process.env.DATABASE_URL || ""

// ── Helper: Read Stream to String ────────────────────────────────────
async function streamToString(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on("data", (chunk: any) => chunks.push(chunk))
    stream.on("error", reject)
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}

// ── Helper: Read Stream to Buffer ────────────────────────────────────
async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on("data", (chunk: any) => chunks.push(chunk))
    stream.on("error", reject)
    stream.on("end", () => resolve(Buffer.concat(chunks)))
  })
}

// ── Helper: Call Bedrock Titan to Generate Embeddings ─────────────────
async function getTitanEmbedding(text: string): Promise<number[]> {
  const modelId = "amazon.titan-embed-text-v2:0"
  const body = JSON.stringify({
    inputText: text,
    dimensions: 1536,
    normalize: true
  })

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body
  })

  const response = await bedrock.send(command)
  const result = JSON.parse(new TextDecoder().decode(response.body))
  return result.embedding
}

// ── Helper: Extract Text from PDF using AWS Textract ─────────────────
async function extractTextWithTextract(bucket: string, key: string): Promise<string> {
  const command = new DetectDocumentTextCommand({
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  })

  const response = await textract.send(command)
  if (!response.Blocks) return ""

  // Filter text blocks and join them
  return response.Blocks
    .filter(block => block.BlockType === "LINE")
    .map(block => block.Text)
    .join("\n")
}

// ── Helper: Text Chunker ─────────────────────────────────────────────
function chunkText(text: string, chunkSize = 800): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentLength = 0

  for (const word of words) {
    currentChunk.push(word)
    currentLength += word.length + 1 // +1 for space

    if (currentLength >= chunkSize) {
      chunks.push(currentChunk.join(" "))
      currentChunk = []
      currentLength = 0
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "))
  }

  return chunks
}

// ─── MAIN LAMBDA HANDLER ──────────────────────────────────────────────
export async function handler(event: any) {
  console.log("Ingestion event received:", JSON.stringify(event, null, 2))

  const pgClient = new Client({ connectionString: dbUrl })
  await pgClient.connect()

  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "))

      console.log(`Processing file: s3://${bucket}/${key}`)

      // Key format: tenants/[tenantId]/cases/[caseId]/[uniqueId]-[filename]
      const keyParts = key.split("/")
      if (keyParts.length < 5) {
        console.warn(`File path format incorrect. Expected key structure 'tenants/tenantId/cases/caseId/uniqueId-filename'. Got: ${key}`)
        continue
      }

      const tenantId = keyParts[1]
      const caseIdRaw = keyParts[3]
      const caseId = caseIdRaw === "unassigned" ? null : caseIdRaw
      const fileFullName = keyParts[4]
      
      // Strip out unique uuid prefix from filename
      const filename = fileFullName.replace(/^[a-z0-9]+-/, "")
      const extension = filename.split(".").pop()?.toLowerCase() || ""

      let extractedText = ""

      // ── Step 1: Extract Document Text ──────────────────────────────
      if (extension === "pdf") {
        console.log("PDF detected. Invoking AWS Textract for OCR extraction...")
        extractedText = await extractTextWithTextract(bucket, key)
      } else if (extension === "txt" || extension === "json") {
        console.log("Plaintext document detected. Fetching S3 content...")
        const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
        extractedText = await streamToString(response.Body)
      } else {
        console.log(`Unsupported file extension '.${extension}'. Skipping ingestion.`)
        continue
      }

      if (!extractedText.trim()) {
        console.warn(`Extracted text is empty for document: ${filename}`)
        continue
      }

      console.log(`Successfully extracted ${extractedText.length} characters of text.`)

      // ── Step 2: Chunk & Generate Embeddings ────────────────────────
      const chunks = chunkText(extractedText)
      console.log(`Chunked document into ${chunks.length} segments. Calculating vector embeddings...`)

      // Calculate embedding of entire document or primary chunks
      // For standard legal document RAG, we will average or index the primary chunk
      const documentTextSummary = extractedText.substring(0, 1500)
      const documentEmbedding = await getTitanEmbedding(documentTextSummary)
      const documentVectorStr = `[${documentEmbedding.join(",")}]`

      const documentId = `doc-${Math.random().toString(36).substring(2, 11)}`
      const fileUrl = `https://${bucket}.s3.amazonaws.com/${key}`

      // ── Step 3: Insert Document Meta & Embeddings into DB ──────────
      console.log("Indexing document vector data into PostgreSQL pgvector...")
      
      // Execute transaction inside Postgres to ensure ACID integrity
      await pgClient.query("BEGIN")
      
      // Execute raw insert for pgvector binding
      await pgClient.query(
        `INSERT INTO "Document" (id, name, "s3Key", url, type, "uploadedBy", "tenantId", "caseId", embedding, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CAST($9 AS vector), NOW())`,
        [
          documentId,
          filename,
          key,
          fileUrl,
          extension.toUpperCase(),
          "AWS Ingestion Pipeline",
          tenantId,
          caseId,
          documentVectorStr
        ]
      )

      await pgClient.query("COMMIT")
      console.log(`Ingestion completed successfully for: ${filename} (ID: ${documentId})`)
    }
  } catch (error: any) {
    await pgClient.query("ROLLBACK")
    console.error("Critical error in S3 Ingestion pipeline:", error)
    throw error
  } finally {
    await pgClient.end()
  }
}
