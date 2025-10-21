-- Generated Recipes table for user-specific AI recipes
create table if not exists public.generated_recipes (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  name text not null,
  description text,
  cook_time text,
  prep_time text,
  difficulty text,
  servings integer,
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  cuisine text,
  nutrition jsonb,
  tags jsonb,
  image_url text,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

-- Helpful indexes
create index if not exists idx_generated_recipes_user on public.generated_recipes(user_id);
create index if not exists idx_generated_recipes_recipe on public.generated_recipes(recipe_id);

-- Enable RLS
alter table public.generated_recipes enable row level security;

-- Policies (idempotent-ish: ignore errors if they already exist)
do $$ begin
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'generated_recipes' and p.policyname = 'gen_recipes_select_own'
  ) then
    create policy gen_recipes_select_own on public.generated_recipes
      for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'generated_recipes' and p.policyname = 'gen_recipes_insert_own'
  ) then
    create policy gen_recipes_insert_own on public.generated_recipes
      for insert with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'generated_recipes' and p.policyname = 'gen_recipes_update_own'
  ) then
    create policy gen_recipes_update_own on public.generated_recipes
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'generated_recipes' and p.policyname = 'gen_recipes_delete_own'
  ) then
    create policy gen_recipes_delete_own on public.generated_recipes
      for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Ensure saved_recipes has proper uniqueness and RLS (optional hardening)
alter table if exists public.saved_recipes enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'saved_recipes_user_recipe_unique'
  ) then
    alter table if exists public.saved_recipes
      add constraint saved_recipes_user_recipe_unique unique (user_id, recipe_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies p where p.policyname = 'saved_select_own' and p.tablename = 'saved_recipes'
  ) then
    create policy saved_select_own on public.saved_recipes for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies p where p.policyname = 'saved_insert_own' and p.tablename = 'saved_recipes'
  ) then
    create policy saved_insert_own on public.saved_recipes for insert with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies p where p.policyname = 'saved_delete_own' and p.tablename = 'saved_recipes'
  ) then
    create policy saved_delete_own on public.saved_recipes for delete using (auth.uid() = user_id);
  end if;
end $$;


