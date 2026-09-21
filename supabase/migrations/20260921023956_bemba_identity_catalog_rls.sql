-- Bemba M2. No order, payment, payout or inbox tables.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name varchar(120) not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table private.account_access (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'seller' check (role in ('seller','admin')),
 status text not null default 'active' check(status in ('active','restricted','suspended')),
 reason text, changed_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (
 id uuid primary key default gen_random_uuid(), slug varchar(80) not null unique,
 name varchar(80) not null, sort_order int not null default 0, active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.stores (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null unique references public.profiles(id),
 slug varchar(80) not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug)>=3 and slug not in ('admin','api','auth','dashboard','pricing','support','bemba','new')),
 name varchar(120) not null check(length(trim(name))>0), description varchar(2000) not null default '',
 category_id uuid references public.categories(id), city varchar(80) not null,
 country_code char(2) not null default 'ZM' check(country_code='ZM'),
 publication text not null default 'draft' check(publication in ('draft','published','archived')),
 onboarding_step smallint not null default 1 check(onboarding_step between 1 and 4), submitted_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.media_assets (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.stores(id),
 uploaded_by uuid not null references public.profiles(id), storage_path text not null unique,
 mime_type text not null check(mime_type in ('image/jpeg','image/png','image/webp')),
 bytes int not null check(bytes between 1 and 5242880), width int not null check(width>0), height int not null check(height>0),
 status text not null default 'pending' check(status in ('pending','ready','rejected')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(id,store_id), check(width::bigint*height<=20000000),
 check(storage_path=store_id::text||'/'||id::text||'/original')
);
create table public.storefront_settings (
 store_id uuid primary key references public.stores(id) on delete cascade,
 tagline varchar(160) not null default '', theme text not null default 'forest' check(theme in ('forest','earth','ochre')),
 button_style text not null default 'rounded' check(button_style in ('rounded','square')),
 logo_asset_id uuid, cover_asset_id uuid,
 foreign key(logo_asset_id,store_id) references public.media_assets(id,store_id),
 foreign key(cover_asset_id,store_id) references public.media_assets(id,store_id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.store_contacts (
 store_id uuid primary key references public.stores(id) on delete cascade,
 whatsapp_e164 varchar(16) not null check(whatsapp_e164 ~ '^\+[1-9][0-9]{7,14}$'),
 public_email varchar(254), pickup_note varchar(1000) not null default '', delivery_note varchar(1000) not null default '',
 timezone text not null default 'Africa/Lusaka' check(timezone='Africa/Lusaka'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.store_hours (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.stores(id) on delete cascade,
 weekday smallint not null check(weekday between 0 and 6), closed boolean not null default true, opens time, closes time,
 unique(store_id,weekday), check((closed and opens is null and closes is null) or (not closed and opens is not null and closes is not null and closes>opens)),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.stores(id),
 category_id uuid not null references public.categories(id), slug varchar(140) not null check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title varchar(120) not null check(length(trim(title))>0), description varchar(5000) not null default '',
 price_minor bigint check(price_minor between 0 and 100000000000), currency char(3) not null default 'ZMW' check(currency='ZMW'),
 availability text not null default 'available' check(availability in ('available','unavailable','made_to_order')),
 publication text not null default 'draft' check(publication in ('draft','published','archived')),
 marketplace_visible boolean not null default true, published_at timestamptz,
 search_document tsvector generated always as (to_tsvector('simple',title||' '||description)) stored,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(store_id,slug), unique(id,store_id)
);
create table public.product_images (
 id uuid primary key default gen_random_uuid(), product_id uuid not null, store_id uuid not null,
 asset_id uuid not null, position smallint not null check(position between 0 and 4), alt_text varchar(250) not null default '',
 foreign key(product_id,store_id) references public.products(id,store_id) on delete cascade,
 foreign key(asset_id,store_id) references public.media_assets(id,store_id),
 unique(product_id,position), unique(product_id,asset_id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.store_moderation (
 store_id uuid primary key references public.stores(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','approved','rejected','hidden')),
 reason text, reviewed_by uuid references public.profiles(id), reviewed_at timestamptz,
 revision bigint not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_moderation (
 product_id uuid primary key references public.products(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','approved','rejected','hidden')),
 reason text, reviewed_by uuid references public.profiles(id), reviewed_at timestamptz,
 revision bigint not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.reports (
 id uuid primary key default gen_random_uuid(), reporter_id uuid references public.profiles(id) on delete set null,
 store_id uuid references public.stores(id), product_id uuid references public.products(id),
 reason text not null check(reason in ('prohibited','misleading','spam','other')), details varchar(2000) not null,
 status text not null default 'open' check(status in ('open','reviewing','resolved','dismissed')),
 assigned_to uuid references public.profiles(id), resolution varchar(2000), resolved_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(num_nonnulls(store_id,product_id)=1)
);
create table public.moderation_records (
 id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id) on delete set null,
 target_user_id uuid references public.profiles(id), target_store_id uuid references public.stores(id), target_product_id uuid references public.products(id),
 report_id uuid references public.reports(id), action text not null check(action in ('approve','reject','hide','restrict','suspend','restore','bootstrap_admin')),
 reason varchar(2000) not null, before_state jsonb not null default '{}', after_state jsonb not null default '{}', created_at timestamptz not null default now(),
 check(num_nonnulls(target_user_id,target_store_id,target_product_id)=1)
);
create table public.analytics_events (
 id uuid primary key default gen_random_uuid(), event_key uuid not null unique,
 kind text not null check(kind in ('store_view','product_view','whatsapp_click')),
 store_id uuid not null references public.stores(id), product_id uuid, actor_id uuid references public.profiles(id) on delete set null,
 session_hash text, referrer_host varchar(253), occurred_at timestamptz not null default now(),
 foreign key(product_id,store_id) references public.products(id,store_id),
 check((kind='store_view' and product_id is null) or (kind='product_view' and product_id is not null) or kind='whatsapp_click')
);
create table public.ai_usage (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), store_id uuid not null references public.stores(id), product_id uuid,
 request_key uuid not null unique, status text not null check(status in ('reserved','succeeded','failed','expired')),
 provider varchar(40) not null, model varchar(120) not null, input_tokens int check(input_tokens>=0), output_tokens int check(output_tokens>=0),
 reserved_at timestamptz not null default now(), completed_at timestamptz, error_code varchar(80),
 foreign key(product_id,store_id) references public.products(id,store_id)
);
create table private.ai_daily_quotas (
 user_id uuid not null references public.profiles(id), quota_date date not null,
 reserved_count int not null default 0 check(reserved_count>=0), limit_count int not null check(limit_count>=0), primary key(user_id,quota_date)
);
-- Only fixed, schema-qualified lookup helpers bypass RLS. No caller-controlled SQL.
create function private.is_active_user() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from private.account_access where user_id=auth.uid() and status='active'); $$;
create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from private.account_access where user_id=auth.uid() and status='active' and role='admin') and coalesce(auth.jwt()->>'aal','')='aal2'; $$;
create function private.owns_store(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select private.is_active_user() and exists(select 1 from public.stores where id=target and owner_id=auth.uid()); $$;
create function private.can_read_store(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.stores s join private.account_access a on a.user_id=s.owner_id join public.store_moderation m on m.store_id=s.id
 where s.id=target and s.publication='published' and a.status='active' and m.status='approved'); $$;
create function private.can_read_product(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.products p join public.product_moderation m on m.product_id=p.id where p.id=target and p.publication='published' and m.status='approved' and private.can_read_store(p.store_id)); $$;
create function public.get_account_access() returns table(role text,status text,reason text) language sql stable security definer set search_path='' as $$
 select a.role,a.status,a.reason from private.account_access a where a.user_id=auth.uid() and auth.uid() is not null; $$;
revoke all on function public.get_account_access() from public,anon;
grant execute on function public.get_account_access() to authenticated;
create function private.provision_user() returns trigger language plpgsql security definer set search_path='' as $$
 begin
 insert into public.profiles(id,display_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'display_name',''),120));
 insert into private.account_access(user_id) values(new.id);
 return new; end; $$;
create trigger provision_bemba_user after insert on auth.users for each row execute function private.provision_user();
-- Existing identities receive seller permissions only; user metadata never grants admin.
insert into public.profiles(id,display_name) select id,left(coalesce(raw_user_meta_data->>'display_name',''),120) from auth.users on conflict do nothing;
insert into private.account_access(user_id) select id from auth.users on conflict do nothing;
create function private.touch_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now(); return new; end; $$;
create function private.pending_store() returns trigger language plpgsql security definer set search_path='' as $$
 begin insert into public.store_moderation(store_id) values(new.id) on conflict(store_id) do update set status='pending',reviewed_by=null,reviewed_at=null,reason=null,revision=public.store_moderation.revision+1; return new; end; $$;
create function private.pending_product() returns trigger language plpgsql security definer set search_path='' as $$
 begin insert into public.product_moderation(product_id) values(new.id) on conflict(product_id) do update set status='pending',reviewed_by=null,reviewed_at=null,reason=null,revision=public.product_moderation.revision+1; return new; end; $$;
create trigger store_review after insert or update on public.stores for each row execute function private.pending_store();
create trigger product_review after insert or update on public.products for each row execute function private.pending_product();
create function private.reset_related_review() returns trigger language plpgsql security definer set search_path='' as $$
 declare sid uuid; pid uuid;
 begin
 if TG_OP='DELETE' then sid=old.store_id; else sid=new.store_id; end if;
 if TG_TABLE_NAME='product_images' then
 if TG_OP='DELETE' then pid=old.product_id; else pid=new.product_id; end if;
 update public.product_moderation set status='pending',reviewed_by=null,reviewed_at=null,revision=revision+1 where product_id=pid;
 else update public.store_moderation set status='pending',reviewed_by=null,reviewed_at=null,revision=revision+1 where store_id=sid;
 end if;
 return null; end; $$;
alter table public.profiles enable row level security;
revoke all on public.profiles from anon,authenticated;
alter table public.categories enable row level security;
revoke all on public.categories from anon,authenticated;
alter table public.stores enable row level security;
revoke all on public.stores from anon,authenticated;
alter table public.media_assets enable row level security;
revoke all on public.media_assets from anon,authenticated;
alter table public.storefront_settings enable row level security;
revoke all on public.storefront_settings from anon,authenticated;
alter table public.store_contacts enable row level security;
revoke all on public.store_contacts from anon,authenticated;
alter table public.store_hours enable row level security;
revoke all on public.store_hours from anon,authenticated;
alter table public.products enable row level security;
revoke all on public.products from anon,authenticated;
alter table public.product_images enable row level security;
revoke all on public.product_images from anon,authenticated;
alter table public.store_moderation enable row level security;
revoke all on public.store_moderation from anon,authenticated;
alter table public.product_moderation enable row level security;
revoke all on public.product_moderation from anon,authenticated;
alter table public.reports enable row level security;
revoke all on public.reports from anon,authenticated;
alter table public.moderation_records enable row level security;
revoke all on public.moderation_records from anon,authenticated;
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon,authenticated;
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon,authenticated;
alter table private.account_access enable row level security;
revoke all on private.account_access from anon,authenticated;
alter table private.ai_daily_quotas enable row level security;
revoke all on private.ai_daily_quotas from anon,authenticated;
create trigger touch_profiles before update on public.profiles for each row execute function private.touch_updated_at();
create trigger touch_categories before update on public.categories for each row execute function private.touch_updated_at();
create trigger touch_stores before update on public.stores for each row execute function private.touch_updated_at();
create trigger touch_media_assets before update on public.media_assets for each row execute function private.touch_updated_at();
create trigger touch_storefront_settings before update on public.storefront_settings for each row execute function private.touch_updated_at();
create trigger touch_store_contacts before update on public.store_contacts for each row execute function private.touch_updated_at();
create trigger touch_store_hours before update on public.store_hours for each row execute function private.touch_updated_at();
create trigger touch_products before update on public.products for each row execute function private.touch_updated_at();
create trigger touch_product_images before update on public.product_images for each row execute function private.touch_updated_at();
create trigger touch_store_moderation before update on public.store_moderation for each row execute function private.touch_updated_at();
create trigger touch_product_moderation before update on public.product_moderation for each row execute function private.touch_updated_at();
create trigger touch_reports before update on public.reports for each row execute function private.touch_updated_at();
create trigger review_storefront_settings after insert or update or delete on public.storefront_settings for each row execute function private.reset_related_review();
create trigger review_store_contacts after insert or update or delete on public.store_contacts for each row execute function private.reset_related_review();
create trigger review_store_hours after insert or update or delete on public.store_hours for each row execute function private.reset_related_review();
create trigger review_product_images after insert or update or delete on public.product_images for each row execute function private.reset_related_review();
grant select on public.profiles to authenticated;
grant update(display_name) on public.profiles to authenticated;
create policy own_profile on public.profiles for select to authenticated using(id=(select auth.uid()) or private.is_admin());
create policy edit_profile on public.profiles for update to authenticated using(id=(select auth.uid()) and private.is_active_user()) with check(id=(select auth.uid()) and private.is_active_user());
grant select on public.categories to anon,authenticated;
create policy active_categories on public.categories for select to anon,authenticated using(active or private.is_admin());
grant select on public.stores to anon,authenticated;
grant insert(owner_id,slug,name,description,category_id,city,country_code,onboarding_step) on public.stores to authenticated;
grant update(slug,name,description,category_id,city,publication,onboarding_step,submitted_at) on public.stores to authenticated;
create policy read_stores on public.stores for select to anon,authenticated using(private.can_read_store(id) or (owner_id=(select auth.uid()) and private.is_active_user()) or private.is_admin());
create policy create_store on public.stores for insert to authenticated with check(owner_id=(select auth.uid()) and private.is_active_user());
create policy edit_store on public.stores for update to authenticated using(private.owns_store(id)) with check(private.owns_store(id) and owner_id=(select auth.uid()));
grant select on public.storefront_settings to anon,authenticated;
create policy read_storefront_settings on public.storefront_settings for select to anon,authenticated using(private.can_read_store(store_id) or private.owns_store(store_id) or private.is_admin());
grant insert(store_id,tagline,theme,button_style,logo_asset_id,cover_asset_id) on public.storefront_settings to authenticated;
create policy insert_storefront_settings on public.storefront_settings for insert to authenticated with check(private.owns_store(store_id));
grant update(tagline,theme,button_style,logo_asset_id,cover_asset_id) on public.storefront_settings to authenticated;
create policy update_storefront_settings on public.storefront_settings for update to authenticated using(private.owns_store(store_id)) with check(private.owns_store(store_id));
grant select on public.store_contacts to anon,authenticated;
create policy read_store_contacts on public.store_contacts for select to anon,authenticated using(private.can_read_store(store_id) or private.owns_store(store_id) or private.is_admin());
grant insert(store_id,whatsapp_e164,public_email,pickup_note,delivery_note,timezone) on public.store_contacts to authenticated;
create policy insert_store_contacts on public.store_contacts for insert to authenticated with check(private.owns_store(store_id));
grant update(whatsapp_e164,public_email,pickup_note,delivery_note,timezone) on public.store_contacts to authenticated;
create policy update_store_contacts on public.store_contacts for update to authenticated using(private.owns_store(store_id)) with check(private.owns_store(store_id));
grant select on public.store_hours to anon,authenticated;
create policy read_store_hours on public.store_hours for select to anon,authenticated using(private.can_read_store(store_id) or private.owns_store(store_id) or private.is_admin());
grant insert(store_id,weekday,closed,opens,closes) on public.store_hours to authenticated;
create policy insert_store_hours on public.store_hours for insert to authenticated with check(private.owns_store(store_id));
grant update(weekday,closed,opens,closes) on public.store_hours to authenticated;
create policy update_store_hours on public.store_hours for update to authenticated using(private.owns_store(store_id)) with check(private.owns_store(store_id));
grant delete on public.store_hours to authenticated;
create policy delete_store_hours on public.store_hours for delete to authenticated using(private.owns_store(store_id));
grant select on public.products to anon,authenticated;
create policy read_products on public.products for select to anon,authenticated using(private.can_read_product(id) or private.owns_store(store_id) or private.is_admin());
grant insert(store_id,category_id,slug,title,description,price_minor,currency,availability,marketplace_visible) on public.products to authenticated;
create policy insert_products on public.products for insert to authenticated with check(private.owns_store(store_id));
grant update(category_id,slug,title,description,price_minor,availability,publication,marketplace_visible) on public.products to authenticated;
create policy update_products on public.products for update to authenticated using(private.owns_store(store_id)) with check(private.owns_store(store_id));
grant select on public.product_images to anon,authenticated;
create policy read_product_images on public.product_images for select to anon,authenticated using(private.can_read_product(product_id) or private.owns_store(store_id) or private.is_admin());
grant insert(product_id,store_id,asset_id,position,alt_text) on public.product_images to authenticated;
create policy insert_product_images on public.product_images for insert to authenticated with check(private.owns_store(store_id));
grant update(position,alt_text) on public.product_images to authenticated;
create policy update_product_images on public.product_images for update to authenticated using(private.owns_store(store_id)) with check(private.owns_store(store_id));
grant delete on public.product_images to authenticated;
create policy delete_product_images on public.product_images for delete to authenticated using(private.owns_store(store_id));
grant select on public.media_assets to anon,authenticated;
create policy read_media_assets on public.media_assets for select to anon,authenticated using(false or private.owns_store(store_id) or private.is_admin());
grant insert(id,store_id,uploaded_by,storage_path,mime_type,bytes,width,height) on public.media_assets to authenticated;
create policy insert_media_assets on public.media_assets for insert to authenticated with check(private.owns_store(store_id) and uploaded_by=(select auth.uid()));
grant select on public.store_moderation,public.product_moderation,public.reports,public.moderation_records,public.ai_usage to authenticated;
create policy read_store_review on public.store_moderation for select to authenticated using(private.owns_store(store_id) or private.is_admin());
create policy read_product_review on public.product_moderation for select to authenticated using(exists(select 1 from public.products p where p.id=product_id and private.owns_store(p.store_id)) or private.is_admin());
create policy admin_reports on public.reports for select to authenticated using(private.is_admin());
create policy admin_audit on public.moderation_records for select to authenticated using(private.is_admin());
create policy own_ai_usage on public.ai_usage for select to authenticated using(user_id=(select auth.uid()) or private.is_admin());
-- Analytics/report writes, moderation transitions and AI reservations are later guarded server operations.
-- No direct client INSERT policy or grant is provided for those tables.
revoke all on all functions in schema private from public,anon,authenticated;
grant execute on function private.is_active_user(),private.is_admin(),private.owns_store(uuid),private.can_read_store(uuid),private.can_read_product(uuid) to anon,authenticated;
create index products_store_publication on public.products(store_id,publication,created_at desc,id);
create index products_category_price on public.products(category_id,publication,price_minor,id);
create index products_search on public.products using gin(search_document);
create index stores_publication on public.stores(publication,created_at desc);
create index stores_category on public.stores(category_id);
create index assets_store on public.media_assets(store_id);
create index assets_uploader on public.media_assets(uploaded_by);
create index images_asset on public.product_images(asset_id,store_id);
create index store_review_queue on public.store_moderation(status,updated_at);
create index product_review_queue on public.product_moderation(status,updated_at);
create index reports_queue on public.reports(status,created_at);
create index reports_store on public.reports(store_id);
create index reports_product on public.reports(product_id);
create index events_store_time on public.analytics_events(store_id,occurred_at,kind);
create index events_product_time on public.analytics_events(product_id,occurred_at);
create index ai_user_time on public.ai_usage(user_id,reserved_at);
-- Seed only taxonomy; no fake sellers, products, reviews or sales.
insert into public.categories(slug,name,sort_order) values
 ('fashion','Fashion',1),('beauty','Beauty',2),('electronics','Electronics',3),('home','Home',4),('food','Food',5),('other','Other',6);
