-- Private bucket: never expose unmoderated uploads with a public URL.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('store-media','store-media',false,5242880,array['image/jpeg','image/png','image/webp']);
create function private.owns_media_path(path text, pending_only boolean default false) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.media_assets a where a.storage_path=path and private.owns_store(a.store_id) and (not pending_only or a.status='pending'));
$$;
revoke all on function private.owns_media_path(text,boolean) from public,anon;
grant execute on function private.owns_media_path(text,boolean) to authenticated;
create policy bemba_read_own_media on storage.objects for select to authenticated using(bucket_id='store-media' and private.owns_media_path(name));
create policy bemba_insert_pending_media on storage.objects for insert to authenticated with check(bucket_id='store-media' and private.owns_media_path(name,true));
-- No UPDATE/upsert policy: reviewed bytes cannot be silently replaced. New image = new asset.
-- No public SELECT policy. M3 byte validation/public rendition route is required before public use.
