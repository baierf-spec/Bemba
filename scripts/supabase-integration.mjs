import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
// Real Supabase HTTP test, never substituted with fixtures. Dedicated local/staging project only.
const url=process.env.TEST_SUPABASE_URL;
const key=process.env.TEST_SUPABASE_PUBLISHABLE_KEY;
const secret=process.env.TEST_SUPABASE_SECRET_KEY;
assert.ok(url && key && secret,'Set TEST_SUPABASE_URL, TEST_SUPABASE_PUBLISHABLE_KEY and TEST_SUPABASE_SECRET_KEY for a dedicated test project.');
const host=new URL(url).hostname;
assert.ok(['127.0.0.1','localhost'].includes(host) || host===`${process.env.TEST_ALLOW_REMOTE_PROJECT_REF}.supabase.co`,'Remote tests require an explicit matching TEST_ALLOW_REMOTE_PROJECT_REF. Never target production.');
const options={auth:{persistSession:false,autoRefreshToken:false}};
const admin=createClient(url,secret,options);const a=createClient(url,key,options);const b=createClient(url,key,options);const anon=createClient(url,key,options);
const run=randomUUID().replaceAll('-','').slice(0,12);const password=`Test-only-${randomUUID()}!`;
const ids=[];
const outcomes=[];
const check=(label)=>{outcomes.push(label);console.log('PASS',label);};
try{
 for(const [client,label] of [[a,'a'],[b,'b']]){
  const email=`bemba-m2-${run}-${label}@example.test`;
  const signup=await client.auth.signUp({email,password,options:{data:{display_name:`TEST M2 ${label}`,role:'admin'}}});
  assert.ifError(signup.error);assert.ok(signup.data.user?.id);ids.push(signup.data.user.id);
  // Test-only confirmation via Auth Admin API. Email transport is a separate manual acceptance gate.
  const confirmed=await admin.auth.admin.updateUserById(signup.data.user.id,{email_confirm:true});assert.ifError(confirmed.error);
  const login=await client.auth.signInWithPassword({email,password});assert.ifError(login.error);assert.ok(login.data.session);
 }
 check('real Auth signUp, test-only email confirmation and password signIn for two users');
 const profile=await a.from('profiles').select('id,display_name').single();assert.ifError(profile.error);assert.equal(profile.data.id,ids[0]);check('seller sees own automatically provisioned profile');
 const access=await a.rpc('get_account_access');assert.ifError(access.error);assert.equal(access.data[0].role,'seller');check('metadata cannot grant administrator');
 const store=await a.from('stores').insert({owner_id:ids[0],slug:`test-m2-${run}`,name:'TEST M2 disposable store',city:'Lusaka'}).select('id').single();assert.ifError(store.error);
 const denied=await b.from('stores').update({name:'Unwanted change'}).eq('id',store.data.id).select('id');assert.ifError(denied.error);assert.equal(denied.data.length,0);check('second user cannot modify seller store');
 const privateProfiles=await anon.from('profiles').select('id');assert.ok(privateProfiles.error || privateProfiles.data.length===0);
 const privateStores=await anon.from('stores').select('id').eq('id',store.data.id);assert.ifError(privateStores.error);assert.equal(privateStores.data.length,0);check('anonymous visitors cannot read profiles or draft stores');
 const badLogin=await anon.auth.signInWithPassword({email:`bemba-m2-${run}-a@example.test`,password:'Incorrect-password-123'});assert.ok(badLogin.error);check('invalid credentials return an error');
 const aid=randomUUID();const path=`${store.data.id}/${aid}/original`;
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
 const asset=await a.from('media_assets').insert({id:aid,store_id:store.data.id,uploaded_by:ids[0],storage_path:path,mime_type:'image/png',bytes:png.length,width:1,height:1});assert.ifError(asset.error);
 const upload=await a.storage.from('store-media').upload(path,png,{contentType:'image/png'});assert.ifError(upload.error);
 assert.ifError((await a.storage.from('store-media').download(path)).error);
 assert.ok((await b.storage.from('store-media').download(path)).error);
 assert.ok((await anon.storage.from('store-media').download(path)).error);
 assert.ok((await a.storage.from('store-media').upload(path,png,{contentType:'image/png',upsert:true})).error);
 check('real private Storage upload/download; unrelated, anonymous and overwrite denied');
 // Only remove data created by this run, in this explicitly selected test project.
 assert.ifError((await admin.storage.from('store-media').remove([path])).error);
 assert.ifError((await admin.from('media_assets').delete().eq('id',aid)).error);
 assert.ifError((await admin.from('stores').delete().eq('id',store.data.id)).error);
 await a.auth.signOut();assert.ok((await a.auth.getUser()).error);check('signout removes session');
 console.log(`${outcomes.length} live integration groups passed. Email delivery, UI cookie journey and MFA remain separate tests.`);
}finally{
 // On a failure, retain constrained fixture rows for investigation rather than deleting broadly.
 for(const id of ids){const result=await admin.auth.admin.deleteUser(id);if(result.error)console.warn('Test user cleanup incomplete; inspect dedicated test project.');}
}
