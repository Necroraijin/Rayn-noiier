import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient } from "../aws";

const MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0";
const MAX_TOKENS = 4096;
const TEMPERATURE = 0.2;

/**
 * Invoke AWS Bedrock Claude model with the Anthropic Messages API format.
 * Uses the shared bedrockClient from lib/aws.ts which includes credentials.
 */
async function invokeBedrockClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await bedrockClient.send(command);

  // Decode the response body
  const rawBody = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(rawBody);

  // Claude Messages API returns: { content: [{ type: "text", text: "..." }], ... }
  if (parsed.content && Array.isArray(parsed.content) && parsed.content.length > 0) {
    return parsed.content
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("\n");
  }

  // Fallback: return stringified response if format is unexpected
  return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
}

// ── 1. Research Agent ──────────────────────────────────────────────────
export async function runResearchAgent(
  userQuery: string,
  privateDocsContext: string,
  globalPrecedentsContext: string,
  webSearchContext: string
): Promise<string> {
  const systemPrompt = `You are ARBITER's Lead Legal Research Agent specializing in Indian Jurisprudence.
Your task is to thoroughly analyze the user's legal question or request, and synthesize data from three distinct source streams:
1. INTERNAL CASE FILES: Private documents, briefs, or client materials.
2. PRECEDENT DATABASE: Matched similarity cases from Supreme Court / High Courts of India.
3. LIVE WEB RESEARCH: Up-to-date Indian legal news, amendments, and notifications retrieved live from the web.

Instructions:
- Prioritize Indian statutory codes, acts, and procedural rules (such as BNS - Bharatiya Nyaya Sanhita, BNSS, BSA, or legacy IPC, CrPC, IEA).
- Cite case precedents with specific party names, citation identifiers, and years.
- Structure your output clearly in markdown:
  * **FACTS SUMMARY**: Core facts of the client's scenario.
  * **LEGAL ISSUES & CONFLICTS**: Specific legal questions to resolve.
  * **STATUTORY ANALYSIS**: Sections of Indian statutes applicable (e.g. Contract Act, Companies Act, BNS, etc.).
  * **SUPPORTING PRECEDENTS**: Relevant ruling citations from SC/HC.
  * **CURRENT LEGAL OUTLOOK (WEB)**: Critical recent developments or context from live web search.`

  const userPrompt = `User Query: ${userQuery}

--- SOURCE STREAM 1 (Internal Case Files) ---
${privateDocsContext || "No internal documents found."}

--- SOURCE STREAM 2 (Precedents & Indian Statutes) ---
${globalPrecedentsContext || "No global precedents found in vector index."}

--- SOURCE STREAM 3 (Live Web Search Results) ---
${webSearchContext || "No live web search context available."}`

  return await invokeBedrockClaude(systemPrompt, userPrompt);
}

// ── 2. Drafting Agent ──────────────────────────────────────────────────
export async function runDraftingAgent(
  userInstructions: string,
  researchNotes: string
): Promise<string> {
  const systemPrompt = `You are ARBITER's Principal Drafting Counsel, acting as a highly experienced Indian Advocate.
Your goal is to draft formal, legally binding documents, clauses, or agreements (such as Memorandums of Understanding (MOU), Non-Disclosure Agreements (NDA), Service Level Agreements (SLA), Share Purchase Agreements, or plain court briefs) according to Indian laws.

Instructions:
- Adhere strictly to the Indian Contract Act, 1872, Specific Relief Act, Arbitration and Conciliation Act, and other relevant codes.
- Use traditional and professional legal phrasing (e.g. "Whereas", "In Witness Whereof", "Now Therefore It Is Mutually Agreed").
- Organize clauses logically with numbering (e.g., Article 1: Definitions, Article 2: Scope, etc.).
- Incorporate specific dispute resolution clauses specifying Arbitration in India under the Arbitration and Conciliation Act, with seat/venue.
- Output ONLY the professional legal text. Do not add chatty intros, friendly warnings, or summaries before the document.`

  const userPrompt = `Drafting Request: ${userInstructions}

--- Research Notes & Statutory Guidelines ---
${researchNotes}`

  return await invokeBedrockClaude(systemPrompt, userPrompt);
}

// ── 3. Review/Compliance Agent ──────────────────────────────────────────
export async function runReviewAgent(
  draftText: string,
  userQuery: string
): Promise<string> {
  const systemPrompt = `You are ARBITER's Chief Compliance and Quality Auditor for Indian Legal Matters.
Your task is to scrutinize the drafted legal document or clauses for legal risk, statutory compliance under Indian laws, and alignment with the client's goals.

Instructions:
- Cross-examine references to legacy codes vs. current codes (e.g. check if BNS 2023 or IPC 1860 is more appropriate depending on the case date).
- Identify stamp duty compliance risks, registration requirements, or boilerplate gaps (e.g. missing severability, force majeure, or governing law).
- Output a detailed compliance audit structured in markdown:
  1. **CITATION VALIDITY & VERIFICATION**: (Pass/Fail with detailed reasons).
  2. **DETECTED RISK VECTORS**: Specific loopholes, liabilities, or unfavorable terms.
  3. **STAMP DUTY & REGISTRATION WARNINGS**: Check if this draft is subject to mandatory stamp duty/registration under the Indian Stamp Act, 1899.
  4. **CORRECTIVE RECOMMENDATIONS**: List exact improvements or substitute clauses.`

  const userPrompt = `Client's Original Intent: ${userQuery}

--- Drafted Legal Text for Review ---
${draftText}`

  return await invokeBedrockClaude(systemPrompt, userPrompt);
}
