# Superhero Training Tracker 🦸

12-week hypertrophy program tracker with PWA support.

**Live:** https://gym-tracker-app-pi.vercel.app  
**Password:** `superman-luke-12`

## Stack
- Next.js 14 (App Router)
- Neon PostgreSQL
- Tailwind CSS
- Vercel deployment

## Data Management

### Database (Neon)
Connection URL in `~/.openclaw/secrets/neon-database-url`

Tables:
- `workout_sessions` - gym visits (date, day_type A/B/C, week_number, notes, energy_level)
- `workout_sets` - individual sets (session_id, exercise, set_number, weight_kg, reps, rpe)
- `body_metrics` - weight tracking (date, weight_kg)

### Logging workouts via CLI
```bash
cd ~/.openclaw/workspace
node scripts/gym-tracker.js start A 1        # Start Day A, Week 1
node scripts/gym-tracker.js log 1 "Bench Press" 1 60 8  # Session 1, set 1, 60kg x 8
node scripts/gym-tracker.js end 1 "Good session" 4      # End with notes + energy (1-5)
```

### Updating target weights
Edit `lib/db.ts` → `targetWeights` object. Redeploy after changes.

### Updating session summaries
Edit `lib/db.ts` → `sessionSummaries` object. Add entries keyed by session ID:
```typescript
sessionSummaries: Record<number, { summary: string; wins: string[]; nextFocus: string }>
```

### Deploy changes
```bash
cd ~/.openclaw/workspace/gym-tracker-app
git add . && git commit -m "Update" && git push
VERCEL_TOKEN=$(cat ~/.openclaw/secrets/vercel-token) vercel --prod --yes --token "$VERCEL_TOKEN"
```

## Local Dev
```bash
cp .env.example .env.local  # Add DATABASE_URL
npm install && npm run dev
```
