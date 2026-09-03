# Cycle Hacker (working title)

This file is project context for Claude Code. Read it before writing any code. It summarizes product decisions made during brainstorming and gives a concrete starting point for a first build pass. Where something is still undecided, it says so explicitly, ask the human rather than guessing on those points.

## Confirmed for the first build pass

- Stack: the proposed stack below (React Native via Expo, Supabase/Postgres with row-level security, Expo notifications, plain TypeScript prediction engine) is confirmed, not just a proposal.
- Scope: this pass builds MVP steps 1-4 only (accounts/auth, solo tracking core loop, prediction engine, phase-based insight engine). Steps 5-7 (partner consent flow, partner-first proxy flow, notifications) are out of scope for now, but the data model already supports them so a later pass should not require a schema rewrite.

## What this is

A period and cycle tracking app for women and their partners. It goes beyond logging and prediction: it turns cycle-phase data into daily, actionable guidance across productivity, training, nutrition, mood, energy, and libido, and it treats partner support as a core feature, not an afterthought.

Two things make this different from Flo/Clue/Natural Cycles, and both should be treated as the product's core bet, not nice-to-haves:

1. Phase-based insight is actionable, not just informational (what to do today, not just an article to read).
2. Partner mode is genuinely useful and can be entered from either side of the relationship, she can invite him, or he can start tracking for her before she's even signed up.

## Non-goals for this first pass

Do not build these yet, they are explicitly out of scope until later phases:

- Trying-to-conceive (TTC) or fertility-focused features
- Perimenopause mode
- A multi-person support circle (friends, family), the product is scoped permanently to one partner, not just for MVP
- Wearable integration (Oura, Whoop, etc.)
- Community or expert-content features
- ML-based prediction, start with a simple rolling-average rule-based model, see Prediction engine below

## Core principle: supportive tracking, not surveillance

This governs several concrete engineering decisions below, treat it as a hard constraint, not a suggestion:

- A partner never sees another person's raw logs, journal entries, or individual symptom/mood entries. Only curated, derived output (phase status, generated suggestions).
- When one person creates a tracking profile for someone else (see Partner-first adoption flow), that data is scoped to what would reasonably be told to a partner (period dates, flow, free-text notes), not subjective self-report categories like mood or libido.
- The moment the person a profile is about creates her own account, control transfers to her completely. The person who set up the profile does not carry over any access, they re-enter through the normal consent flow and she chooses what to share, from zero.
- Revoking a partner's access is always one tap, no confirmation dialog demanding a reason, and does not notify the partner that they were removed.
- Deleting an account cascades: any cached data on a linked partner's side is purged too.

## MVP feature scope

Build in roughly this order, each one should be a usable, testable slice before moving to the next:

1. **Accounts and auth.** Standard signup (email or phone). Two onboarding entry points from the first screen: "I'm tracking my own cycle" and "I want to support someone" (see Partner-first adoption flow).
2. **Solo tracking core loop.** Daily check-in (period/flow when relevant, mood via quick tap, symptoms via multi-select chips, everything skippable, target under 15 seconds to complete). Home screen shows current cycle day, phase in plain language, and one headline insight. Calendar/timeline view of history and predictions.
3. **Prediction engine.** Rolling-average based cycle length and phase boundary calculation (menstrual, follicular, ovulatory, luteal). Must handle irregular cycles gracefully from the start, don't assume a clean 28-day cycle. Keep this as an isolated, testable module, it will get smarter later but should be correct and simple now.
4. **Phase-based insight engine.** A content/template system that maps phase plus category (physical, nutrition, productivity, mood, libido, sleep) to short, specific tips. Tone: describe patterns, never diagnose or prescribe ("energy often dips here," not "you will feel low"). This can start as a curated static content set keyed by phase, it does not need to be dynamically generated at MVP.
5. **Partner consent and sharing flow (she invites him).** Partner mode is opt-in, never part of initial onboarding, offered later via settings or a soft in-app prompt after a few logged cycles. Granular sharing toggles before any invite is generated: phase status (default on), curated support suggestions (default on), general mood trend (default off). Symptom/journal detail is never shareable, this is not a toggle, enforce it in the data layer, not just the UI.
6. **Partner-first adoption flow (he invites her).** From the "I want to support someone" onboarding path: he creates his own account, then a managed profile for someone else (first name plus known dates, no contact info required yet). Logging scope for this profile: period dates and flow only, plus an optional free-text note field, not the full symptom/mood chip set. He gets phase-based support suggestions from this data, with a "still learning" indicator while data is thin. He can invite her at any point (reversed invite direction versus the flow above). On acceptance, she sees a full transparency screen of everything logged before any of it becomes hers, and can keep, edit, or discard per entry. Once she confirms, her account becomes authoritative and his access resets to zero, he re-enters through the standard consent flow in step 5.
7. **Notifications.** Optional daily check-in nudge (user-set time), phase-transition heads-up, optional PMS-window warning. Keep this minimal and easy to fully disable.

## Data model, starting sketch

This is a starting point, not a locked schema, adjust as the build reveals real constraints:

- `users`: id, name, contact info, auth fields
- `cycle_profiles`: id, name, owner_user_id (nullable while proxy-only), created_by_user_id, is_proxy (bool), status
- `cycle_entries`: id, profile_id, date, flow_level, source (self or partner)
- `symptom_logs`: id, profile_id, date, symptom_type, value, source
- `mood_logs`: id, profile_id, date, value, source
- `partner_links`: id, profile_id, partner_user_id, status (pending/active/revoked), invited_by, created_at
- `sharing_settings`: id, partner_link_id, category, enabled (one row per toggle, not a single JSON blob, so access checks stay simple and auditable)
- `invites`: id, profile_id, token, created_by, direction (owner_invites_partner or partner_invites_owner), status, expires_at

Enforce sharing rules at the data access layer (row-level security or equivalent), not just in client UI. A partner's read query should be structurally incapable of returning raw symptom/journal rows, not merely hidden by the interface.

## Suggested stack (proposal, confirm before committing)

Not yet decided by the human, this is a reasonable starting default given the requirements (cross-platform, need for row-level access control mapped to the consent model, fast MVP velocity):

- Mobile: React Native via Expo, single codebase for iOS and Android given platform priority is still open
- Backend/data: Postgres-backed BaaS (e.g. Supabase) with row-level security policies implementing the sharing_settings model directly, or a lightweight Node/TypeScript API over Postgres if more control is needed
- Push notifications: Expo notifications (wraps APNs/FCM)
- Prediction engine: plain TypeScript module, pure functions, no ML dependency at this stage

## Open decisions, ask the human before assuming

Do not silently pick an answer on these, they materially affect scope or architecture:

- Business model: freemium subscription vs. flat fee vs. hybrid
- Whether a partner needs their own full account/login or can operate purely via invite-link session
- Platform priority: iOS-first, Android-first, or simultaneous
- Tone calibration for "hacker"/optimization framing in actual UI copy
- Whether "Cycle Hacker" is the final product name
- General wellness/productivity framing vs. medical-adjacent health app framing, affects what claims are safe to make in copy
- Exact onboarding question set and how much cycle history to ask her to backfill
- Exact notification timing rules and copy
- Account-merge/duplicate-detection logic if someone independently creates her own account before a partner-first invite reaches her
- Whether/how to nudge a partner to send an invite if a proxy profile goes uninvited for a long time, and what that threshold should be

## Working conventions

- TypeScript strict mode throughout
- Keep the prediction engine and insight-content system as isolated, independently testable modules, they will change fastest as real usage data comes in
- Every feature that touches another person's data (partner mode, proxy profiles) needs a corresponding access-control test, not just a UI test, verify at the query layer that restricted data cannot leak through
- No em dashes in UI copy or documentation
