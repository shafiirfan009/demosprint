-- Demo Sprint brief pipeline v2
-- Run in Supabase SQL editor

alter table public.leads
  add column if not exists brief_id uuid,
  add column if not exists attachments jsonb default '[]'::jsonb,
  add column if not exists summary_pdf_path text,
  add column if not exists email_status text default 'pending',
  add column if not exists email_error text,
  add column if not exists created_at timestamptz default now();

create unique index if not exists leads_brief_id_uq on public.leads (brief_id);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Keep RLS insert for anon if you still use direct browser fallback.
alter table public.leads enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'allow_anon_insert'
  ) then
    create policy "allow_anon_insert" on public.leads
      for insert to anon
      with check (true);
  end if;
end $$;

-- Private storage bucket for attachments + generated PDF summaries.
insert into storage.buckets (id, name, public)
values ('brief-assets', 'brief-assets', false)
on conflict (id) do nothing;

