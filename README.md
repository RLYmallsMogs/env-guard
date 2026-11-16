# env-guard

One-shot .env validator. Run before deploying — catch missing variables early.

## Setup

```bash
# list required vars (one per line):
echo "DATABASE_URL" > required.txt
echo "API_KEY" >> required.txt

node check.js
```

Exits with code 1 if anything is missing. Perfect for pre-deploy hooks.
