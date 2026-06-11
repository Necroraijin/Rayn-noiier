# Rayn: B2B Legal AI SaaS Master Plan

## 1. Executive Summary
Rayn is transitioning from a standalone, localized desktop prototype into a highly scalable, multi-tenant B2B Software-as-a-Service (SaaS) platform tailored for law firms. The platform utilizes a native desktop client (Tauri + Next.js) for performance and security, backed by Amazon Web Services (AWS) for centralized data management, strict multi-tenancy isolation, licensing enforcement, and secure AI execution.

## 2. Current State (Phase 1: Desktop Foundation) - COMPLETED
- **Framework:** Tauri (Rust) + Next.js (React).
- **Architecture:** Strict Single Page Application (SPA). All routing is handled in-memory for maximum security against URL tampering.
- **Security:** Granular, feature-level RBAC (Role-Based Access Control). Users only load the UI modules they are explicitly permitted to see.
- **Data Storage:** Currently utilizing `@tauri-apps/plugin-store` for local, "single-player" mock data persistence.
- **Integrations:** UI and local storage logic prepared for Google Docs, Gmail, and WhatsApp.

## 3. Cloud Architecture & Multi-Tenancy (Phase 2) - PENDING
To support multiple firms (5 to 100+ users per firm) while maintaining strict data isolation, the architecture will migrate to a centralized AWS backend.

### 3.1 Multi-Tenant Data Isolation
- **The `firm_id` Core:** Every database record (Users, Matters, Documents, Audit Logs) will be hard-linked to a unique `firm_id`.
- **Row-Level Security:** Amazon RDS PostgreSQL (with pgvector) schema row-level security (RLS) policies will mathematically prevent User A at Firm X from querying data belonging to Firm Y.
- **Authentication:** Migrate from local mock auth to AWS Cognito User Pools to handle enterprise SSO, MFA, and secure session tokens.

### 3.2 Licensing & Tier Management
- **Master Admin Database:** A hidden database managed only by Rayn's creators tracking firm subscriptions.
- **Seat Caps:** When a firm's IT Admin attempts to provision a new user, the AWS backend will check their current active users against their `subscription_tier` limit (e.g., 20 users). If exceeded, the provisioning API call is rejected.
- **Feature Gating:** Subscription tiers can also gate entire modules (e.g., restricting the "Strategy Room" to Tier 3 licenses).

## 4. Secure AI Gateway & Quota Management (Phase 3) - PENDING
Directly embedding AI API keys into a distributed desktop application is a critical security vulnerability. 

### 4.1 The AWS Middleware API
- **AWS ECS / Lambda:** The desktop app will *never* communicate directly with LLMs. It will send requests to a custom Rayn API hosted on AWS.
- **Key Protection:** The Rayn AWS backend holds the actual AI API keys and model parameters securely in AWS Secrets Manager and IAM policy controls.
- **Token Tracking:** Before executing an AI request, the middleware checks the requesting firm's `ai_quota_used` against their `ai_quota_limit`.
- **Execution & Logging:** If within limits, the backend queries AWS Bedrock, returns the drafted text to the desktop client, and increments the firm's token usage in the billing database.

## 5. External Integrations (Phase 4) - PENDING
- **OAuth 2.0 Flow:** Establishing an AWS Cognito Federated Identity provider flow to allow lawyers to securely connect their firm's Google Workspace to export drafts to Docs and send emails.
- **Webhooks:** Finalizing the server-side endpoints (API Gateway / ECS) to handle incoming/outgoing WhatsApp Business API messages for the Client Portal.

## 6. Enterprise Multi-Agent AI System (Phase 5) - PENDING
The simple AI API gateway will be upgraded into a proactive, enterprise-grade Agentic RAG system built on **CrewAI** and **LangChain**, hosted on AWS ECS / App Runner.

### 6.1 Agentic RAG & Dual Vector Databases
- **Global Knowledge Base (Indian Law Only):** A centralized Vector Database containing Indian Case Laws, the Constitution, IPC (and BNS/BNSA replacements), CrPC, and Supreme Court judgments. Strict system guardrails will force agents to cite *only* Indian jurisdiction.
- **Private Firm Knowledge Base:** A multi-tenant Vector Database (`firm_id` isolated in Amazon RDS `pgvector` or OpenSearch) where user-uploaded case files, evidence, and historical firm documents are stored securely. 
- **Agentic Routing:** When a user queries the system, an orchestrator agent determines if it needs to pull precedents from the Global Indian Law DB, specific case facts from the Private Firm DB, or synthesize both.

### 6.2 The Legal Crew (CrewAI Framework)
Instead of one generic AI, tasks are delegated to specialized agents:
- **Research Agent:** Scours the Vector DBs for relevant case law.
- **Drafting Agent:** Uses the research to assemble clauses in the firm's specific tone.
- **Review/Compliance Agent:** Critiques the draft against the latest Indian statutes to ensure compliance before showing it to the human lawyer.

### 6.3 Proactive Web Search & Auto-Updating
- **The "Watchdog" Agent:** A scheduled ECS Fargate Task equipped with Web Search tools (e.g., Serper API) that continuously monitors official Indian government gazettes and Supreme Court portals.
- **Automated Ingestion:** When new amendments are passed, the Watchdog Agent synthesizes the changes and automatically pushes updates to the Global Knowledge Base Vector DB, ensuring the AI never provides outdated legal advice.

### 6.4 Continuous Learning (RLHF)
- **Feedback Loops:** When a lawyer manually edits an AI-generated draft in the Desktop App, the diff (changes made) is sent back to the AWS backend.
- **Firm Preferences DB:** The backend extracts the stylistic or legal corrections and updates a "Preferences Vector Profile" (stored in `pgvector`) specific to that `firm_id`. Future drafting agents will load this profile into their context window, ensuring the AI learns the specific partner's writing style over time.

## 7. Future Expansion & Unresolved Queries
*(This section is reserved for ongoing architectural decisions and features yet to be defined by the stakeholders).*

### Known Pending Topics:
1. **End-to-End (E2E) Communications:** Defining the exact encryption protocols and UI flow for secure messaging between lawyers and clients.
2. **Document Storage:** Defining the bucket architecture (Amazon S3) for handling large legal PDFs and evidence files securely per firm.

---
*Note: This plan serves as the architectural blueprint. Each phase will require specific implementation sprints, starting with setting up the AWS infrastructure and migrating the local database logic to cloud APIs.*