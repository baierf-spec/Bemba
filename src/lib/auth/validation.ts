export function credentials(form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error("invalid_input");
  if (password.length < 12 || password.length > 128) throw new Error("invalid_input");
  return { email, password };
}
export function safeDestination(value: string | null): string {
  return value === "/auth/reset-password" ? value : "/dashboard";
}
export function profileName(value: FormDataEntryValue | null): string {
  const name = typeof value === "string" ? value.trim() : "";
  if (!name || name.length > 120) throw new Error("invalid_input");
  return name;
}
