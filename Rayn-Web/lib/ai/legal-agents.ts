import { ChatBedrockConverse } from "@langchain/aws"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

const model = new ChatBedrockConverse({
  model: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  region: process.env.AWS_REGION || "us-east-1",
  temperature: 0.2,
})

// ── 1. Research Agent ──────────────────────────────────────────────────
export async function runResearchAgent(
  userQuery: string,
  privateDocsContext: string,
  globalPrecedentsContext: string
): Promise<string> {
  const systemPrompt = `You are ARBITER's Senior Legal Research Agent specializing in Indian Jurisdiction.
Your task is to analyze the user's legal question and synthesize information from two source streams:
1. INTERNAL CASE DATA: Client files, evidence, and internal firm briefs.
2. GLOBAL LEGAL LAWS: Indian statutes, Constitution, BNS/IPC, CrPC, and Supreme Court precedent citations.

Rules:
- Strictly prioritize Indian legal precedents and acts.
- Cite specific file names, case names, citation numbers, and years.
- Do not fabricate or hallucinate citations. If a citation is missing from the sources, state it clearly.
- Create a structured Research Note containing: Case Facts Summary, Key Legal Questions, Relevant Statutes, and Supporting Precedents.`

  const userPrompt = `User Query: ${userQuery}

--- SOURCE STREAM 1 (Internal Case Files) ---
${privateDocsContext || "No internal documents found."}

--- SOURCE STREAM 2 (Global Precedents & Indian Statutes) ---
${globalPrecedentsContext || "No global precedents found in vector index."}`

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ])

  return typeof response.content === "string" ? response.content : JSON.stringify(response.content)
}

// ── 2. Drafting Agent ──────────────────────────────────────────────────
export async function runDraftingAgent(
  userInstructions: string,
  researchNotes: string
): Promise<string> {
  const systemPrompt = `You are ARBITER's Legal Drafting Agent.
Your task is to draft precise, formal, and enforceable legal clauses or briefs based on the provided Research Notes.

Rules:
- Adopt a professional, firm-specific, and analytical tone.
- Embed any relevant citations (statutes and cases) directly into the body of the clauses.
- Clearly organize clauses with standard numbering format.
- Output ONLY the legal text/clauses. Do not add introductory or conversational pleasantries.`

  const userPrompt = `Drafting Instructions: ${userInstructions}

--- Research Notes & Citations ---
${researchNotes}`

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ])

  return typeof response.content === "string" ? response.content : JSON.stringify(response.content)
}

// ── 3. Review/Compliance Agent ──────────────────────────────────────────
export async function runReviewAgent(
  draftText: string,
  userQuery: string
): Promise<string> {
  const systemPrompt = `You are ARBITER's Senior Compliance and Quality Review Agent.
Your task is to critique the drafted legal text against the original user query and Indian statutory compliance rules.

Rules:
- Verify that all cited case precedents or sections (IPC, BNS, CrPC) exist and are relevant.
- Detect any compliance anomalies (e.g., missing standard confidentiality clauses, liability caps that violate Indian public policy, etc.).
- Produce a structured compliance critique summarizing:
  1. Integrity of Citations (Pass/Fail + details)
  2. Detected Gaps or Risks
  3. Actionable Corrections`

  const userPrompt = `Original Request: ${userQuery}

--- Drafted Text for Review ---
${draftText}`

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ])

  return typeof response.content === "string" ? response.content : JSON.stringify(response.content)
}
