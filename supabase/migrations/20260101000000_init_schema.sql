-- Cycle Hacker: initial schema for MVP steps 1-4.
-- See supabase/migrations/README.md for the RLS constraint that step 5/6
-- partner-facing reads must respect.

create extension if not exists "pgcrypto";

-- ---------- users ----------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users_select_self" on public.users
  for select using (id = auth.uid());
create policy "users_update_self" on public.users
  for update using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, phone)
  values (new.id, new.email, new.phone);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- cycle_profiles ----------
create table public.cycle_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid references public.users (id) on delete set null,
  created_by_user_id uuid not null references public.users (id) on delete cascade,
  is_proxy boolean not null default false,
  status text not null default 'active' check (status in ('active', 'archived')),
  -- Onboarding survey answers. Seed guesses for the prediction engine's
  -- rolling average before any real cycle_entries exist; typical_symptoms
  -- and goals are not read by any other feature yet, just captured for later.
  initial_cycle_length_estimate smallint check (initial_cycle_length_estimate between 10 and 60),
  initial_period_length_estimate smallint check (initial_period_length_estimate between 1 and 14),
  typical_symptoms text[],
  goals text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cycle_profiles enable row level security;

create policy "cycle_profiles_select_controller" on public.cycle_profiles
  for select using (owner_user_id = auth.uid() or created_by_user_id = auth.uid());
create policy "cycle_profiles_insert_self" on public.cycle_profiles
  for insert with check (created_by_user_id = auth.uid());
create policy "cycle_profiles_update_controller" on public.cycle_profiles
  for update using (owner_user_id = auth.uid() or created_by_user_id = auth.uid());
create policy "cycle_profiles_delete_controller" on public.cycle_profiles
  for delete using (owner_user_id = auth.uid() or created_by_user_id = auth.uid());

-- ---------- cycle_entries ----------
create table public.cycle_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.cycle_profiles (id) on delete cascade,
  date date not null,
  flow_level text not null check (flow_level in ('none', 'spotting', 'light', 'medium', 'heavy')),
  source text not null default 'self' check (source in ('self', 'partner')),
  created_at timestamptz not null default now(),
  unique (profile_id, date)
);

alter table public.cycle_entries enable row level security;

-- Only the profile's controller (owner or, while proxy-only, its creator)
-- can read or write raw entries. No partner-facing grant exists here; see
-- supabase/migrations/README.md before adding one.
create policy "cycle_entries_all_controller" on public.cycle_entries
  for all using (
    profile_id in (
      select id from public.cycle_profiles
      where owner_user_id = auth.uid() or created_by_user_id = auth.uid()
    )
  )
  with check (
    profile_id in (
      select id from public.cycle_profiles
      where owner_user_id = auth.uid() or created_by_user_id = auth.uid()
    )
  );

-- ---------- symptom_logs ----------
-- symptom_type is grouped into five UI categories (flow, bodily, energy,
-- cravings, libido); 'energy'/'cravings'/'libido' are each also a
-- general/quick-access entry alongside their own granular symptoms, matching
-- the check-in screen's "frequently used" tiles vs. "all symptoms" chips.
create table public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.cycle_profiles (id) on delete cascade,
  date date not null,
  symptom_type text not null check (symptom_type in (
    'clots',
    'cramps', 'headache', 'backache', 'nausea', 'bloating', 'tender_breasts',
    'energy', 'low_energy', 'fatigue', 'wired', 'restless',
    'cravings', 'cravings_sweet', 'cravings_salty', 'cravings_chocolate', 'cravings_carbs',
    'libido', 'libido_low', 'libido_neutral', 'libido_high'
  )),
  -- 1=Low, 2=Meh, 3=Fine, 4=High, 5=Super high. A plain chip tap (no hold-drag
  -- dial) logs 3 (Fine) as a neutral default.
  intensity smallint not null default 3 check (intensity between 1 and 5),
  source text not null default 'self' check (source in ('self', 'partner')),
  created_at timestamptz not null default now(),
  unique (profile_id, date, symptom_type)
);

alter table public.symptom_logs enable row level security;

create policy "symptom_logs_all_controller" on public.symptom_logs
  for all using (
    profile_id in (
      select id from public.cycle_profiles
      where owner_user_id = auth.uid() or created_by_user_id = auth.uid()
    )
  )
  with check (
    profile_id in (
      select id from public.cycle_profiles
      where owner_user_id = auth.uid() or created_by_user_id = auth.uid()
    )
  );

-- ---------- mood_logs ----------
create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.cycle_profiles (id) on delete cascade,
  date date not null,
  value smallint not null check (value between 1 and 5),
  source text not null default 'self' check (source in ('self', 'partner')),
  created_at timestamptz not null default now(),
  unique (profile_id, date)
);

alter table public.mood_logs enable row level security;

create policy "mood_logs_all_controller" on public.mood_logs
  for all using (
    profile_id in (
      select id from public.cycle_profiles
      where owner_user_id = auth.uid() or created_by_user_id = auth.uid()
    )
  )
  with check (
    profile_id in (
      select id from public.cycle_profiles
      where owner_user_id = auth.uid() or created_by_user_id = auth.uid()
    )
  );

-- ---------- partner_links ----------
create table public.partner_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.cycle_profiles (id) on delete cascade,
  partner_user_id uuid not null references public.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  invited_by uuid not null references public.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, partner_user_id)
);

alter table public.partner_links enable row level security;

create policy "partner_links_select_participant" on public.partner_links
  for select using (
    partner_user_id = auth.uid()
    or profile_id in (select id from public.cycle_profiles where owner_user_id = auth.uid())
  );
create policy "partner_links_insert_owner" on public.partner_links
  for insert with check (
    profile_id in (select id from public.cycle_profiles where owner_user_id = auth.uid())
    or invited_by = auth.uid()
  );
create policy "partner_links_update_participant" on public.partner_links
  for update using (
    partner_user_id = auth.uid()
    or profile_id in (select id from public.cycle_profiles where owner_user_id = auth.uid())
  );

-- ---------- sharing_settings ----------
create table public.sharing_settings (
  id uuid primary key default gen_random_uuid(),
  partner_link_id uuid not null references public.partner_links (id) on delete cascade,
  category text not null check (category in (
    'phase_status', 'flow', 'symptoms', 'mood', 'libido', 'notes', 'headline_insight'
  )),
  enabled boolean not null default false,
  unique (partner_link_id, category)
);

alter table public.sharing_settings enable row level security;

create policy "sharing_settings_owner_only" on public.sharing_settings
  for all using (
    partner_link_id in (
      select pl.id from public.partner_links pl
      join public.cycle_profiles cp on cp.id = pl.profile_id
      where cp.owner_user_id = auth.uid()
    )
  )
  with check (
    partner_link_id in (
      select pl.id from public.partner_links pl
      join public.cycle_profiles cp on cp.id = pl.profile_id
      where cp.owner_user_id = auth.uid()
    )
  );

-- ---------- invites ----------
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.cycle_profiles (id) on delete cascade,
  token text not null unique,
  created_by uuid not null references public.users (id),
  direction text not null check (direction in ('owner_invites_partner', 'partner_invites_owner')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.invites enable row level security;

create policy "invites_select_creator_or_owner" on public.invites
  for select using (
    created_by = auth.uid()
    or profile_id in (select id from public.cycle_profiles where owner_user_id = auth.uid())
  );
create policy "invites_insert_creator" on public.invites
  for insert with check (created_by = auth.uid());
create policy "invites_update_creator_or_owner" on public.invites
  for update using (
    created_by = auth.uid()
    or profile_id in (select id from public.cycle_profiles where owner_user_id = auth.uid())
  );

-- ---------- indexes ----------
create index cycle_entries_profile_date_idx on public.cycle_entries (profile_id, date);
create index symptom_logs_profile_date_idx on public.symptom_logs (profile_id, date);
create index mood_logs_profile_date_idx on public.mood_logs (profile_id, date);
create index cycle_profiles_owner_idx on public.cycle_profiles (owner_user_id);
create index cycle_profiles_created_by_idx on public.cycle_profiles (created_by_user_id);
create index partner_links_profile_idx on public.partner_links (profile_id);
create index partner_links_partner_user_idx on public.partner_links (partner_user_id);
create index sharing_settings_link_idx on public.sharing_settings (partner_link_id);
create index invites_profile_idx on public.invites (profile_id);
create index invites_token_idx on public.invites (token);

-- ---------- account deletion ----------
-- Deleting the auth.users row cascades through public.users (on delete
-- cascade) to every cycle_profiles row this user created, and from there to
-- its cycle_entries/symptom_logs/mood_logs and any partner_links/
-- sharing_settings/invites tied to those profiles or to this user as a
-- partner, satisfying the "deleting an account cascades" rule in CLAUDE.md.
create or replace function public.delete_own_account()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.delete_own_account() to authenticated;
