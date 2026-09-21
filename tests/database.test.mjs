import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// Real PostgreSQL/WASM executes all application migrations and RLS.
// Only Supabase-owned Auth/Storage relation/function contracts are supplied below.
// This is NOT a Supabase Auth or Storage HTTP integration test.
test('M2 migration replay and tenant isolation in PostgreSQL', async t => {
 const db=new PGlite();
 try {
 await db.exec(`create role anon; create role authenticated;
 create schema auth; create schema storage;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$ select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid $$;
 create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb) $$;
 grant usage on schema auth,storage to anon,authenticated;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
 alter table storage.objects enable row level security;
 grant select,insert,update,delete on storage.objects to anon,authenticated;`);
 const migrations=(await readdir('supabase/migrations')).filter(x=>x.endsWith('.sql')).sort();
 for(const file of migrations)await db.exec(await readFile('supabase/migrations/'+file,'utf8'));
 const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
 await db.query(`insert into auth.users(id,email,raw_user_meta_data) values($1,'a@example.test','{"role":"admin","display_name":"Seller A"}'),($2,'b@example.test','{"display_name":"Seller B"}')`,[a,b]);
 async function as(role,id,sql,args=[],aal='aal1'){
  await db.exec('reset role');await db.query(`select set_config('request.jwt.claims',$1,false)`,[JSON.stringify(id?{sub:id,aal}:{})]);await db.exec('set role '+role);
  try{return await db.query(sql,args);}finally{await db.exec('reset role');}
 }
 await t.test('signup trigger creates profile and never accepts metadata admin role',async()=>{
  const access=await as('authenticated',a,'select * from public.get_account_access()');assert.equal(access.rows[0].role,'seller');
  const profiles=await as('authenticated',a,'select * from public.profiles');assert.equal(profiles.rows.length,1);assert.equal(profiles.rows[0].id,a);
 });
 const sa=(await as('authenticated',a,`insert into public.stores(owner_id,slug,name,city) values($1,'seller-a','Seller A','Lusaka') returning id`,[a])).rows[0].id;
 const sb=(await as('authenticated',b,`insert into public.stores(owner_id,slug,name,city) values($1,'seller-b','Seller B','Ndola') returning id`,[b])).rows[0].id;
 await t.test('seller updates own profile and storefront',async()=>{
  assert.equal((await as('authenticated',a,`update public.profiles set display_name='Updated' where id=$1 returning id`,[a])).rows.length,1);
  assert.equal((await as('authenticated',a,`update public.stores set name='Updated' where id=$1 returning id`,[sa])).rows.length,1);
 });
 await t.test('unrelated user cannot read or mutate another seller',async()=>{
  assert.equal((await as('authenticated',b,'select * from public.stores where id=$1',[sa])).rows.length,0);
  assert.equal((await as('authenticated',b,`update public.stores set name='Hijacked' where id=$1 returning id`,[sa])).rows.length,0);
  assert.equal((await as('authenticated',b,`update public.profiles set display_name='Hijacked' where id=$1 returning id`,[a])).rows.length,0);
 });
 await t.test('ownership/role/moderation escalation denied',async()=>{
  await assert.rejects(as('authenticated',a,'update public.stores set owner_id=$1 where id=$2',[b,sa]));
  await assert.rejects(as('authenticated',b,`insert into public.stores(owner_id,slug,name,city) values($1,'forged','Forged','Lusaka')`,[a]));
  await assert.rejects(as('authenticated',a,`update private.account_access set role='admin' where user_id=$1`,[a]));
  await assert.rejects(as('authenticated',a,`update public.store_moderation set status='approved' where store_id=$1`,[sa]));
 });
 await t.test('public cannot read private profiles or drafts',async()=>{
  await assert.rejects(as('anon',null,'select * from public.profiles'));
  assert.equal((await as('anon',null,'select * from public.stores')).rows.length,0);
  await assert.rejects(as('anon',null,'select * from public.get_account_access()'));
 });
 const category=(await db.query('select id from public.categories limit 1')).rows[0].id;
 const product=(await as('authenticated',a,`insert into public.products(store_id,category_id,slug,title) values($1,$2,'basket','Basket') returning id`,[sa,category])).rows[0].id;
 await as('authenticated',a,`update public.stores set publication='published' where id=$1`,[sa]);
 await as('authenticated',a,`update public.products set publication='published' where id=$1`,[product]);
 await t.test('publication requires independent approval and edits revoke it',async()=>{
  assert.equal((await as('anon',null,'select * from public.products')).rows.length,0);
  await db.query(`update public.store_moderation set status='approved' where store_id=$1`,[sa]);
  await db.query(`update public.product_moderation set status='approved' where product_id=$1`,[product]);
  assert.equal((await as('anon',null,'select * from public.products')).rows.length,1);
  await as('authenticated',a,`update public.products set title='Changed' where id=$1`,[product]);
  assert.equal((await as('anon',null,'select * from public.products')).rows.length,0);
 });
 const asset='00000000-0000-4000-8000-000000000003';const path=`${sa}/${asset}/original`;
 await as('authenticated',a,`insert into public.media_assets(id,store_id,uploaded_by,storage_path,mime_type,bytes,width,height) values($1,$2,$3,$4,'image/png',100,10,10)`,[asset,sa,a,path]);
 await t.test('private storage accepts only owned pending asset; no foreign read or overwrite',async()=>{
  await as('authenticated',a,`insert into storage.objects(bucket_id,name) values('store-media',$1)`,[path]);
  assert.equal((await as('authenticated',a,'select * from storage.objects')).rows.length,1);
  assert.equal((await as('authenticated',b,'select * from storage.objects')).rows.length,0);
  assert.equal((await as('anon',null,'select * from storage.objects')).rows.length,0);
  await assert.rejects(as('authenticated',b,`insert into storage.objects(bucket_id,name) values('store-media',$1)`,[path]));
  assert.equal((await as('authenticated',a,`update storage.objects set name='replacement' returning id`)).rows.length,0);
  await assert.rejects(as('authenticated',a,`update public.media_assets set status='ready' where id=$1`,[asset]));
 });
 await t.test('cross-store image links rejected by ownership or composite FK',async()=>{
  await assert.rejects(as('authenticated',b,`insert into public.product_images(product_id,store_id,asset_id,position) values($1,$2,$3,0)`,[product,sb,asset]));
 });
 await t.test('suspension immediately hides store and blocks mutation with existing identity',async()=>{
  await db.query(`update private.account_access set status='suspended' where user_id=$1`,[a]);
  assert.equal((await as('anon',null,'select * from public.stores')).rows.length,0);
  assert.equal((await as('authenticated',a,`update public.stores set name='Bypass' where id=$1 returning id`,[sa])).rows.length,0);
  assert.equal((await as('authenticated',a,'select * from storage.objects')).rows.length,0);
 });
 await t.test('admin policies require current role and MFA',async()=>{
  await db.query(`update private.account_access set role='admin' where user_id=$1`,[b]);
  assert.equal((await as('authenticated',b,'select * from public.profiles')).rows.length,1);
  assert.equal((await as('authenticated',b,'select * from public.profiles',[],'aal2')).rows.length,2);
 });
 await t.test('all 17 application tables have RLS enabled',async()=>{
  const rows=(await db.query(`select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname in ('public','private') and relkind='r'`)).rows;
  assert.equal(rows.length,17);assert.ok(rows.every(x=>x.relrowsecurity));
 });
 }finally{await db.close();}
});
