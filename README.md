# Cycle Hacker (working title)

Period and cycle tracking app for women and their partners. See `CLAUDE.md` for full product context.

## Structure

- `apps/mobile` - Expo (React Native) app
- `packages/prediction-engine` - rolling-average cycle length and phase boundary calculation, pure TypeScript
- `packages/insight-content` - phase-based tip content and headline insight selection, pure TypeScript
- `packages/supabase-client` - typed Supabase client and query helpers
- `supabase/` - database migrations, RLS policies, and access-control tests

## Getting started

```bash
pnpm install
cp .env.example .env   # fill in Supabase URL and anon key
supabase start          # local Postgres + auth, requires Docker
supabase db reset        # apply migrations and seed data
pnpm --filter mobile start
```

## Scope of this pass

This build covers MVP steps 1-4 from `CLAUDE.md`: accounts and auth, the solo daily
check-in and home/calendar loop, the prediction engine, and the phase-based insight
engine. Partner consent flow, the partner-first proxy flow, and notifications are
out of scope for now; the database schema already supports them so a later pass
does not require a schema rewrite.

## Testing

```bash
pnpm --filter @cyclehacker/prediction-engine test
pnpm --filter @cyclehacker/insight-content test
pnpm --filter mobile test
supabase start
supabase db reset
supabase status -o env  # copy API_URL, ANON_KEY, SERVICE_ROLE_KEY into your shell
pnpm --filter @cyclehacker/supabase-tests test   # access-control tests
```
