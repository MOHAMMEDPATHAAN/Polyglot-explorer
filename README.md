# Polyglot Explorer

A multilingual language-learning app with 7 modes (Kids, Educational, PG/Adult, Business, Travel, Exam Prep, Immersion) — lessons with an interactive exercise player, an AI tutor, speaking practice with live transcription, writing practice with AI feedback, reading comprehension, a vocabulary dictionary with spaced-repetition flashcards, progress analytics, and an admin panel.

**Stack:** Next.js 16 (App Router, TypeScript, Tailwind v4) · Supabase (auth, Postgres, storage, RLS) · Capacitor.js (mobile wrapper) · Anthropic SDK (`claude-sonnet-4-6`) for the AI Tutor and Writing Feedback · recharts · lucide-react.

## Infrastructure status

- **Supabase** is already fully provisioned — project ref `pwuhsatvagenkuljvypl` (region `ap-south-1`), all 8 migrations applied (schema, RLS policies, storage buckets, seed content for Spanish/English/French courses). Nothing to set up there.
- **Vercel** project `polyglot-explorer` already exists, empty and ready for its first deployment.

## Deploying

1. Push this folder to a new GitHub repository.
2. In the Vercel dashboard, connect that GitHub repo to the existing `polyglot-explorer` project (Project Settings → Git → Connect Repository), or import it fresh and it'll detect Next.js automatically.
3. In Vercel Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` — see `.env.local` for the value
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — see `.env.local` for the value (safe to expose publicly — it's the anon key, access is governed by RLS)
   - `ANTHROPIC_API_KEY` — your own key, required for the AI Tutor and Writing Feedback features to work. Without it, those two features return a clean "not configured" message instead of erroring — the rest of the app works fine without it.
   - `NEXT_PUBLIC_SITE_URL` — set to your deployed URL once you have it (used for OAuth redirect callbacks)
4. Deploy. Vercel will auto-detect Next.js and run `npm run build`.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Mobile (Capacitor)

`capacitor.config.ts` is configured to point the native shell at the deployed web app (this app uses server actions, API routes, and auth that can't be statically exported, so Capacitor wraps the live deployment rather than a static bundle). After deploying:

```bash
npx cap add ios      # requires Xcode, run on macOS
npx cap add android   # requires Android Studio
npx cap sync
```

Update the `server.url` in `capacitor.config.ts` to match your real deployed URL first.

## Notes / known limitations

- OAuth providers (Google/Apple/GitHub) need their app credentials configured in the Supabase Auth dashboard before sign-in with those providers will work.
- Speaking practice uses the browser's Web Speech API plus a Levenshtein text-similarity score — it's a reasonable approximation, not true phoneme-level pronunciation scoring.
- Only Educational, Business, and Kids modes have seeded course content out of the box; the other modes have working UI and data layer but need content added via the Admin panel.
- Account deletion (Settings page) deactivates the profile; a full `auth.users` row deletion needs a service-role key and should be added as a privileged server-side follow-up if needed.

