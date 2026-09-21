export type WhatsAppContact = {
  phone: string;
  productTitle: string;
  productUrl: string;
};

/** Only call with a phone and product resolved from permitted database content. */
export function buildWhatsAppUrl({ phone, productTitle, productUrl }: WhatsAppContact): string {
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error("A valid E.164 phone number is required.");
  if (!productTitle.trim() || productTitle.length > 120 || /[\r\n]/.test(productTitle)) {
    throw new Error("A product title between 1 and 120 characters is required.");
  }
  const url = new URL(productUrl);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("A public HTTPS product URL is required.");
  }
  const message = `Hello! I'm interested in ${productTitle.trim()} on Bemba. Is it available?\n${url.href}`;
  return `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(message)}`;
}
