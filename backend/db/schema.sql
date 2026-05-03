create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null check (role in ('ADMIN', 'EXAMINER', 'STUDENT')),
  status text not null check (status in ('ACTIVE', 'INACTIVE')),
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_lower_idx on users (lower(email));

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on users;

create trigger users_set_updated_at
before update on users
for each row
execute function set_updated_at();
