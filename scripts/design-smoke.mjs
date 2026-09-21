import assert from 'node:assert/strict';
const base = process.env.SMOKE_URL || 'http://127.0.0.1:3000';
const pages = [
 ['/', 'More customers'], ['/demo/marketplace', 'Discover products'],
 ['/demo/products/kitenge-handbag', 'Kitenge Handbag'], ['/demo/store', 'Chisomo Fashion'],
 ['/demo/dashboard', 'Welcome back'], ['/demo/dashboard/products', 'Manage your products'],
 ['/demo/dashboard/products/new', 'Add a new product'],
 ['/demo/dashboard/products/kitenge-handbag/edit', 'Edit your product'],
 ['/demo/dashboard/storefront', 'Customize your storefront'], ['/demo/dashboard/ai', 'Create amazing content'],
 ['/demo/dashboard/analytics', 'Store views over time'], ['/demo/dashboard/inquiries', 'Stay connected'],
 ['/demo/dashboard/billing', 'Billing &amp; Plans'], ['/demo/dashboard/settings', 'Store settings'],
 ...[1, 2, 3, 4].map(step => [`/demo/onboarding/${step}`, 'Create your store']),
];
for (const [path, title] of pages) {
 const response = await fetch(new URL(path, base));
 const html = await response.text();
 assert.equal(response.status, 200, path);
 assert.ok(html.includes(title), `${path}: expected heading`);
 if (path.startsWith('/demo/')) {
  assert.match(html, /noindex/, `${path}: preview must not be indexed`);
  assert.match(html, /Design preview/, `${path}: clearly labelled demo`);
 }
 assert.doesNotMatch(html, /Proceed to checkout|Withdraw funds|Seller earnings|New order!/, path);
 console.log(`PASS ${path}`);
}
for (const name of ['seller-hero', 'handbag', 'sneakers', 'skincare', 'lamp', 'plant', 'basket', 'headphones', 'coffee']) {
 const response = await fetch(new URL(`/images/${name}.webp`, base));
 assert.equal(response.status, 200, name);
 assert.match(response.headers.get('content-type') || '', /image\/webp/);
 assert.ok((await response.arrayBuffer()).byteLength > 1000);
}
const missing = await fetch(new URL('/demo/products/not-a-real-product', base));
assert.equal(missing.status, 404);
console.log('PASS 9 local assets and missing-product 404');
