# Migrations

`20260101000000_init_schema.sql` is the schema for MVP steps 1-4 (accounts,
solo tracking, prediction, insight content). It creates the full data model
from `CLAUDE.md`, including `partner_links`, `sharing_settings`, and
`invites`, even though the partner consent flow (step 5) and the
partner-first proxy flow (step 6) are not built yet, so those steps do not
require a schema rewrite.

**Important constraint for whoever builds step 5/6:** no RLS policy in this
migration grants a partner (`partner_user_id`) `SELECT` on raw
`cycle_entries`, `symptom_logs`, or `mood_logs`. Only a profile's
`owner_user_id` or `created_by_user_id` can read those tables at all. That is
what makes a partner's read query structurally incapable of returning raw
logs right now, per the "supportive tracking, not surveillance" principle in
`CLAUDE.md`, not just something the UI happens to not expose yet.

When partner-facing reads are added, they must go through a new
`SECURITY DEFINER` function or view that returns only derived output (phase
status, curated suggestions), gated by `sharing_settings.enabled` and
`partner_links.status = 'active'`. Do not add a policy that grants a partner
direct `SELECT` on the raw log tables, even a filtered one, since the
"symptom/journal detail is never shareable" rule in `CLAUDE.md` is meant to
be enforced at the data layer, not left to careful querying.
