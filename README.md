# SycophAI

An anti-sycophantic AI writing assistant. Paste your writing, get honest feedback — then see how sycophantic the feedback itself was.

## How it works

1. **Pass 1 — Critique**: Your writing is sent to Gemini 2.5 Flash Lite with a system prompt that strips out validating, agreeable behavior. It responds like a skilled editor, not a yes-machine.
2. **Pass 2 — Audit**: The critique is sent to a second Gemini call that scores it for sycophancy (0–10) and flags which types were detected.
3. **Output**: You see the critique + a sycophancy score panel showing what type of sycophancy appeared (if any).

## Sycophancy types detected

- **Affirmative opener** — starts with praise ("Great!", "This is interesting!")
- **Hedge-then-validate** — mild critique followed by net-positive impression
- **Capitulation** — backs down from valid criticism without reason
- **Uncritical mirroring** — reflects the writer's own framing without interrogation
- **Vague softening** — non-committal language that avoids direct critique

## Setup (local)

## Vercel Hosting Link

https://sycoph-ai.vercel.app/
