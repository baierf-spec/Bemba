-- Owner-only psql command, NOT a migration or a public RPC.
-- psql "$BEMBA_DATABASE_URL" -v ON_ERROR_STOP=1 -v user_id=VERIFIED_USER_UUID -f supabase/ops/bootstrap-admin.sql
begin;
select set_config('bemba.bootstrap_user', :'user_id', true);
do $$
declare target uuid := current_setting('bemba.bootstrap_user')::uuid;
begin
 if not exists(select 1 from auth.users where id=target and email_confirmed_at is not null) then
  raise exception 'Admin must be an existing email-confirmed user';
 end if;
 if not exists(select 1 from private.account_access where user_id=target and status='active' and role='seller') then
  raise exception 'Expected an active seller account; no change applied';
 end if;
 update private.account_access set role='admin',updated_at=now() where user_id=target;
 insert into public.moderation_records(target_user_id,action,reason,before_state,after_state)
 values(target,'bootstrap_admin','Owner-run administrator bootstrap','{"role":"seller"}','{"role":"admin"}');
end;
$$;
commit;
