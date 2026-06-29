export type AuthFailureStrategy =
  | "redirect-login"
  | "redirect-unauthorized"
  | "silent-null";

const silentEndpoints = new Set([
  "students/profile",
  "students/profile/promo_code",
  // "settings/books"
]);

function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/^\//, "").split("?")[0];
}

export function getAuthFailureStrategy(endpoint: string): AuthFailureStrategy {
  const normalized = normalizeEndpoint(endpoint);

  if (silentEndpoints.has(normalized)) {
    return "silent-null";
  }

  return "redirect-login";
}
