# SycophAI

An anti-sycophantic AI writing assistant. Paste your writing, get honest feedback — then see how sycophantic the feedback itself was.

## How it works

1. **Pass 1 — Critique**: Your writing is sent to Claude with a system prompt that strips out validating, agreeable behavior. It responds like a skilled editor, not a yes-machine.
2. **Pass 2 — Audit**: The critique is sent to a second Claude call that scores it for sycophancy (0–10) and flags which types were detected.
3. **Output**: You see the critique + a sycophancy score panel showing what type of sycophancy appeared (if any).

## Sycophancy types detected

- **Affirmative opener** — starts with praise ("Great!", "This is interesting!")
- **Hedge-then-validate** — mild critique followed by net-positive impression
- **Capitulation** — backs down from valid criticism without reason
- **Uncritical mirroring** — reflects the writer's own framing without interrogation
- **Vague softening** — non-committal language that avoids direct critique

## Setup (local)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/sycoph-ai.git
cd sycoph-ai

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.local.example .env.local
# Open .env.local and paste your Anthropic API key

# 4. Run locally
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Deploy — Vercel handles the rest

## Tech stack

- Next.js 15 (App Router)
- Anthropic SDK (server-side API calls)
- Tailwind CSS
- TypeScript
