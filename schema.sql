-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  updated_at timestamp with time zone
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Create a table for memos
create table memos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table memos enable row level security;

create policy "Users can view own memos" on memos
  for select using (auth.uid() = user_id);

create policy "Users can insert own memos" on memos
  for insert with check (auth.uid() = user_id);

create policy "Users can update own memos" on memos
  for update using (auth.uid() = user_id);

create policy "Users can delete own memos" on memos
  for delete using (auth.uid() = user_id);

-- Create a table for sessions
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  memo_id uuid references memos not null,
  questions jsonb default '[]'::jsonb,
  conclusion text,
  next_action text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table sessions enable row level security;

create policy "Users can view own sessions" on sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions" on sessions
  for update using (auth.uid() = user_id);

create policy "Users can delete own sessions" on sessions
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, updated_at)
  values (new.id, new.email, now());
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at on memos
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at_memos
  before update on memos
  for each row
  execute procedure moddatetime (updated_at);

create trigger handle_updated_at_sessions
  before update on sessions
  for each row
  execute procedure moddatetime (updated_at);
