import test from 'node:test';
import assert from 'node:assert/strict';
import { credentials, safeDestination, profileName } from '../src/lib/auth/validation.ts';
test('auth validation rejects invalid email/password and limits profile text',()=>{
 const f=new FormData();f.set('email',' A@Example.test ');f.set('password','long-password-123');assert.equal(credentials(f).email,'a@example.test');
 f.set('password','short');assert.throws(()=>credentials(f));
 assert.throws(()=>profileName('x'.repeat(121)));assert.equal(profileName(' Seller '),'Seller');
});
test('auth redirects only to fixed local destinations',()=>{
 for(const v of ['https://evil.test','//evil.test','/admin','\\evil.test',null])assert.equal(safeDestination(v),'/dashboard');
 assert.equal(safeDestination('/auth/reset-password'),'/auth/reset-password');
});
