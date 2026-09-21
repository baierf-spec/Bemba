import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppUrl } from "../src/lib/whatsapp.ts";

const valid = { phone: "+260971234567", productTitle: "Basket & bowl", productUrl: "https://bemba.com/products/test/basket" };

test("WhatsApp link targets saved E.164 number and encodes product context", () => {
  const result = new URL(buildWhatsAppUrl(valid));
  assert.equal(result.origin, "https://wa.me");
  assert.equal(result.pathname, "/260971234567");
  assert.equal(result.searchParams.get("text"), "Hello! I'm interested in Basket & bowl on Bemba. Is it available?\nhttps://bemba.com/products/test/basket");
});
test("rejects invalid phone numbers and link injection", () => {
  for (const phone of ["0971234567", "+00000000", "+26097&text=other", "+2601234567890123456"]) {
    assert.throws(() => buildWhatsAppUrl({ ...valid, phone }));
  }
});
test("rejects unsafe product URLs and multiline/empty/oversized titles", () => {
  for (const productUrl of ["javascript:alert(1)", "http://bemba.com/item", "https://user:pass@bemba.com/item"]) {
    assert.throws(() => buildWhatsAppUrl({ ...valid, productUrl }));
  }
  for (const productTitle of ["", " ", "x".repeat(121), "Basket\nForged text"]) {
    assert.throws(() => buildWhatsAppUrl({ ...valid, productTitle }));
  }
});
