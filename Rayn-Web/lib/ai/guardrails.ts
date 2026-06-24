/**
 * AI Security and Compliance Guardrails Module
 * Scans inputs for PII leaks and prompt injections before executing Bedrock models.
 */

// ── PII REDACTION REGEX PATTERNS ─────────────────────────────────────
const PII_PATTERNS = {
  // Indian PAN (Permanent Account Number): 5 letters, 4 digits, 1 letter
  PAN_NUMBER: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g,
  
  // Indian Aadhaar Number: 12 digits (space or hyphen separated optionally)
  AADHAAR_NUMBER: /\b\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  
  // Standard Email Pattern
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // Standard Phone Patterns (Mobile and landlines)
  PHONE: /(\+91[\-\s]?)?[0-9]{10}\b|\b[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{4}\b/g,
  
  // Passport numbers (Alpha followed by digits)
  PASSPORT: /\b[A-Z]{1}[0-9]{7,8}\b/g,
}

/**
 * Sanitizes input query string, redacting sensitive corporate/PII values
 */
export function redactPII(text: string): string {
  let sanitized = text
  
  sanitized = sanitized.replace(PII_PATTERNS.PAN_NUMBER, "[REDACTED_PAN]")
  sanitized = sanitized.replace(PII_PATTERNS.AADHAAR_NUMBER, "[REDACTED_AADHAAR]")
  sanitized = sanitized.replace(PII_PATTERNS.EMAIL, "[REDACTED_EMAIL]")
  sanitized = sanitized.replace(PII_PATTERNS.PHONE, "[REDACTED_PHONE]")
  sanitized = sanitized.replace(PII_PATTERNS.PASSPORT, "[REDACTED_PASSPORT]")
  
  return sanitized
}

/**
 * Detects common Prompt Injection attack vectors
 */
export function detectPromptInjection(text: string): { isInjected: boolean; reason?: string } {
  const lowerText = text.toLowerCase()
  
  // Common injection attack signatures
  const injectionSignatures = [
    "ignore previous instructions",
    "ignore the instructions above",
    "bypass system policy",
    "system prompt bypass",
    "forget what you were told",
    "you are now an unfiltered",
    "disregard all guidelines",
    "new instruction:",
    "translate the following into",
  ]
  
  for (const sig of injectionSignatures) {
    if (lowerText.includes(sig)) {
      return {
        isInjected: true,
        reason: `Potential Prompt Injection detected: Match on signature "${sig}"`
      }
    }
  }
  
  // Simple check for excessive system commands
  if (lowerText.includes("system:") && lowerText.includes("user:") && lowerText.split("system:").length > 2) {
    return {
      isInjected: true,
      reason: "Structured formatting override attempt detected."
    }
  }
  
  return { isInjected: false }
}

/**
 * Main Guardrails Security Wrapper
 */
export async function applyGuardrails(
  text: string,
  guardrailIdentifier?: string,
  guardrailVersion?: string
): Promise<{
  success: boolean
  sanitizedText: string
  blocked: boolean
  blockedReason?: string
}> {
  // 1. Local checks: Prompt Injection Detection
  const injection = detectPromptInjection(text)
  if (injection.isInjected) {
    return {
      success: false,
      sanitizedText: text,
      blocked: true,
      blockedReason: injection.reason
    }
  }

  // 2. Local checks: PII Redaction
  const redacted = redactPII(text)

  // 3. AWS Bedrock Guardrails configuration parameters
  // (This can be optionally mapped to InvokeModelCommand request payloads in client calls)
  const bedrockGuardrailConfig = guardrailIdentifier ? {
    guardrailIdentifier,
    guardrailVersion: guardrailVersion || "DRAFT"
  } : undefined

  return {
    success: true,
    sanitizedText: redacted,
    blocked: false
  }
}
