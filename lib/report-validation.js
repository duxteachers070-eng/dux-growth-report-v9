export const MAX_BYTES = 256 * 1024;
export const REPORT_ID = /^[a-f0-9]{48}$/;

export function validateReport(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  for (const key of ["student", "campus", "teacher", "level", "period"]) {
    if (typeof value[key] !== "string" || !value[key].trim() || value[key].length > 200) return false;
  }
  if (!Array.isArray(value.skills) || value.skills.length < 1 || value.skills.length > 20) return false;
  for (const skill of value.skills) {
    if (!skill || ["id", "label", "korean"].some((key) => typeof skill[key] !== "string" || skill[key].length > 200)) return false;
    if (["previous", "current"].some((key) => !Number.isFinite(skill[key]) || skill[key] < 0 || skill[key] > 100)) return false;
    if (!Number.isFinite(skill.weight) || skill.weight <= 0 || skill.weight > 100) return false;
  }

  const safe = (input, depth = 0) => {
    if (depth > 8) return false;
    if (typeof input === "string") return input.length <= 20000;
    if (typeof input === "number") return Number.isFinite(input);
    if (input == null || typeof input === "boolean") return true;
    if (Array.isArray(input)) return input.length <= 100 && input.every((item) => safe(item, depth + 1));
    return typeof input === "object" && Object.entries(input).every(([key, item]) =>
      !["__proto__", "constructor", "prototype"].includes(key) && safe(item, depth + 1));
  };
  return safe(value);
}

export function randomReportId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function responseHeaders() {
  return {
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
}
