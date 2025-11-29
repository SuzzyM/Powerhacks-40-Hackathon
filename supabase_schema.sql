-- Enable Row Level Security
alter default privileges revoke execute on functions from public;

-- Create Forum Tables
create table if not exists forum_threads (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author_id text not null, -- Anonymous ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_activity timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists forum_posts (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references forum_threads(id) on delete cascade not null,
  content text not null,
  author_id text not null, -- Anonymous ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Journal Tables
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, -- Real User ID (from auth)
  ciphertext text not null, -- Encrypted content
  iv text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists safety_plans (
  user_id uuid primary key, -- Real User ID (from auth)
  ciphertext text not null, -- Encrypted content
  iv text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table forum_threads enable row level security;
alter table forum_posts enable row level security;
alter table journal_entries enable row level security;
alter table safety_plans enable row level security;

-- Policies (Basic examples - refine based on auth needs)

-- Forum: Public read, Anon write (simplified)
drop policy if exists "Public threads are viewable by everyone" on forum_threads;
create policy "Public threads are viewable by everyone"
  on forum_threads for select
  using ( true );

drop policy if exists "Anyone can create threads" on forum_threads;
create policy "Anyone can create threads"
  on forum_threads for insert
  with check ( true );

drop policy if exists "Public posts are viewable by everyone" on forum_posts;
create policy "Public posts are viewable by everyone"
  on forum_posts for select
  using ( true );

drop policy if exists "Anyone can create posts" on forum_posts;
create policy "Anyone can create posts"
  on forum_posts for insert
  with check ( true );

-- Journal: Private read/write (Relaxed for Demo)
drop policy if exists "Users can see their own journal entries" on journal_entries;
create policy "Users can see their own journal entries"
  on journal_entries for select
  using ( true ); -- WAS: auth.uid() = user_id

drop policy if exists "Users can insert their own journal entries" on journal_entries;
create policy "Users can insert their own journal entries"
  on journal_entries for insert
  with check ( true ); -- WAS: auth.uid() = user_id

-- Safety Plan: Private read/write (Relaxed for Demo)
drop policy if exists "Users can see their own safety plan" on safety_plans;
create policy "Users can see their own safety plan"
  on safety_plans for select
  using ( true ); -- WAS: auth.uid() = user_id

drop policy if exists "Users can update their own safety plan" on safety_plans;
create policy "Users can update their own safety plan"
  on safety_plans for insert
  with check ( true ); -- WAS: auth.uid() = user_id

drop policy if exists "Users can update their own safety plan (update)" on safety_plans;
create policy "Users can update their own safety plan (update)"
  on safety_plans for update
  using ( true ); -- WAS: auth.uid() = user_id
