# LearnAnything

Daily product-management practice that turns a large curriculum into short lessons, challenges, and feedback loops.

[Open the live product](https://learnanything.pro)

## What it does

- Delivers daily PM lessons and applied challenges with streak and progress tracking.
- Evaluates free-form answers and returns actionable feedback instead of a binary score.
- Runs experiments, lifecycle flows, and payments as one production product system.

## AI system

- A Groq-backed judge returns strict structured output; application code validates and clamps every score and delta before use.
- Ten agent specifications coordinate research, curriculum, quality, growth, and lifecycle work, with a Conductor routing work to nine specialists and enforcing publish gates.
- A2A and `llms.txt` manifests make the product legible to agents and AI search systems.

## Stack

Next.js 15, React 19, TypeScript, Prisma/PostgreSQL, Groq, and Vitest.

## Verify

```bash
npm install
npm test
npm run typecheck
```
