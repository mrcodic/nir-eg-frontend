// helpers/safe-redirect-server.ts
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

/**
 * Redirects to `destination` only if the current pathname is different.
 * Prevents redirect loops when the destination page itself encounters an error.
 *
 * @returns `null` when the redirect is suppressed (already on the target page).
 */
export async function safeRedirectServer(
  destination: string,
): Promise<never | null> {
  const headersList = await headers();
  const currentPathname = headersList.get("x-pathname") ?? "/";

  const destinationPathname = destination.split("?")?.[0] ?? destination;

  if (currentPathname === destinationPathname) {
    console.warn(
      `[safeRedirectServer] Suppressed redirect loop: already on "${currentPathname}"`,
    );
    return null;
  }

  return redirect(destination);
}
