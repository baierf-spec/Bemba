import assert from 'node:assert/strict';
const base=process.env.SMOKE_URL||'http://127.0.0.1:3000';
for(const path of ['/auth/login','/auth/register','/auth/forgot-password','/auth/check-email','/auth/error']){
 const r=await fetch(base+path);assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);assert.match(r.headers.get('x-robots-tag'),/noindex/);console.log('PASS auth page',path);
}
const f=new URLSearchParams({intent:'login',email:'bad',password:'short'});
const csrf=await fetch(base+'/auth/session',{method:'POST',body:f,headers:{Origin:'https://unrelated.test'},redirect:'manual'});assert.equal(csrf.status,403);console.log('PASS cross-origin auth submission denied');
const unavailable=await fetch(base+'/auth/session',{method:'POST',body:f,headers:{Origin:'http://localhost:3000'},redirect:'manual'});assert.equal(unavailable.status,303);assert.ok(unavailable.headers.get('location').endsWith('/auth/error')||unavailable.headers.get('location').includes('invalid_input'));console.log('PASS missing configuration or bad credentials handled without secret disclosure');
