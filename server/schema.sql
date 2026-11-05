-- TreyOS guestbook and hit counter (Neon Postgres). Only the treyos-api functions connect.

create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 40),
  message text not null check (char_length(message) between 1 and 500),
  website text check (website is null or website ~ '^https?://'),
  created_at timestamptz not null default now()
);

create table if not exists public.hits (
  id int primary key default 1 check (id = 1),
  count bigint not null default 0
);
insert into public.hits (id, count) values (1, 0) on conflict do nothing;

create table if not exists public.guestbook_rate (
  ip_hash text not null,
  at timestamptz not null default now()
);
create index if not exists guestbook_rate_ip_at on public.guestbook_rate (ip_hash, at);


create or replace function public.sign_guestbook(p_name text, p_message text, p_website text default null, p_hp text default '', p_ip text default 'unknown')
returns public.guestbook
language plpgsql set search_path = public
as $$
declare
  v_name text := btrim(coalesce(p_name, ''));
  v_message text := btrim(coalesce(p_message, ''));
  v_website text := nullif(btrim(coalesce(p_website, '')), '');
  v_ip text := coalesce(p_ip, 'unknown');
  v_hash text := encode(sha256(convert_to('treyos-guestbook:' || btrim(v_ip), 'UTF8')), 'hex');
  v_row public.guestbook;
begin
  if coalesce(p_hp, '') <> '' then raise exception 'rejected'; end if;
  if char_length(v_name) not between 1 and 40 then raise exception 'name must be 1 to 40 characters'; end if;
  if char_length(v_message) not between 1 and 500 then raise exception 'message must be 1 to 500 characters'; end if;
  if v_website is not null and v_website !~ '^https?://' then raise exception 'website must start with http:// or https://'; end if;
  if (v_name || ' ' || v_message) ~* '\m(fuck|shit|cunt|nigger|faggot|retard)' then raise exception 'keep it friendly'; end if;

  delete from public.guestbook_rate where at < now() - interval '1 hour';
  if (select count(*) from public.guestbook_rate where ip_hash = v_hash) >= 3 then
    raise exception 'slow down: try again later';
  end if;
  insert into public.guestbook_rate (ip_hash) values (v_hash);

  insert into public.guestbook (name, message, website) values (v_name, v_message, v_website) returning * into v_row;
  return v_row;
end;
$$;

create or replace function public.list_guestbook(p_limit int default 50)
returns setof public.guestbook
language sql stable set search_path = public
as $$
  select * from public.guestbook order by created_at desc limit least(greatest(coalesce(p_limit, 50), 1), 100);
$$;

create or replace function public.hit()
returns bigint
language sql set search_path = public
as $$
  update public.hits set count = count + 1 where id = 1 returning count;
$$;

create or replace function public.hit_count()
returns bigint
language sql stable set search_path = public
as $$
  select count from public.hits where id = 1;
$$;

