# BOLT for Alexa+ — Simulated Human-Governed Assistant

**Amazon Developer Hackathon 2026 · Alexa+ track · Simulated-experience path**

This repository contains a functional, zero-dependency browser application that **simulates** an Alexa+ conversational workflow for managing a delayed customer order. It is NOT connected to Amazon, Alexa+, real voice assistants, external business systems, customer records, or LLM services.

**The problem:** an assistant may read shipping updates and prepare a draft, but it should not send messages or change external records before a human reviews the precise request. It should explain discrepancies between sources without silently trusting a single system.

## How to run

Requires Node.js 20+. No AWS account, SDK, API key, npm installation or network calls are required for the local demonstration.

1. Clone https://github.com/ondmindmanagement-hub/bolt-alexa-hackathon.git
2. Open the repository in Terminal.
3. Run npm test
4. Run npm start
5. Open http://127.0.0.1:8080/ in Safari or Chrome.

The public GitHub Pages preview serves identical HTML/CSS/JS.

## Five complete demonstration flows

1. Check shipment status — reads three bundled synthetic sources, notices their disagreement.
2. Prepare a local summary — creates text without sending a message.
3. Request customer notification — needs an exact human phrase APPROVE REQ-###, and only simulates approval.
4. Request a priority change — needs exact approval, never modifies a real record.
5. Delete customer records — categorically denied by fail-closed policy.

Every interaction adds an item to an in-memory event log. You can export the log to a JSON file, marked as synthetic. This is NOT independently authenticated or tamper-proof production auditing.

## Architecture

Simulated Alexa+ utterance (typed example, no microphone)
→ Deterministic client-side intent classification
→ Policy: local read/draft / approval required / deny
→ Exact per-request human confirmation
→ Local synthetic result and decision record
→ Optional manual JSON export

All user-derived DOM text is escaped via textContent. No customer details are collected. No background messages, payments, or network calls are made by the browser application.

## Source / required technology honesty

- HTML, CSS, vanilla JavaScript; Node.js standard library for local server.
- Alexa+ simulated-experience path, permitted as an alternative in the official hackathon requirements. NO real Alexa+ MCP/Agent Skill or SDK integration is claimed.
- NO Bee device, Ring API, AWS, OpenCV, commercial model API or production BOLT application is used.
- The interface accepts typed transcripts; it does not receive speech from an Amazon device.
- All evidence records are invented fixtures and do not show business savings or customer error statistics.

## Honest product feedback for Amazon

The simulated-experience option enabled a working, reproducible human-approval UX without a production Alexa+ preview. It allowed us to test status comparison, decision explanations and policy guardrails with zero secrets and zero running costs. For a real Alexa+ product we would need preview onboarding, verified conversational intent handling, real user identity, durable auditing, a safe action service and a legitimate customer/business problem. The simulation is the intended contest-facing prototype, not an integrated assistant.

## What changed after the original submission

The original October 2026 repository included only a CLI policy stub and 3 simple tests. Version 0.2 adds the responsive public browser application, five example tasks, one-use in-memory human confirmations bound to request IDs, rejection and default-deny behavior, auditable evidence display, local JSON export, 15 dedicated simulator tests, and a small local server. No private macOS BOLT code is included.

## Boundaries

This is an experimental human-interface demonstrator: it does not independently verify human identity, enforce policy outside the process, recognize arbitrary speech reliably, or control third-party services. Approval produces a simulated outcome only.

Unfire · Omar Baró · hello@unfire.technology · https://unfire.technology
