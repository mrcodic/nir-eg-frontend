// app/api/tenant/[...path]/route.ts
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const UPSTREAM_ORIGIN =
  process.env.TENANT_UPSTREAM_ORIGIN ?? "https://admin.nir-edu.com";

async function proxy(req: NextRequest, params: { path: string[] }) {
  const host = (await headers()).get("host") ?? "";
  const upstreamUrl = new URL(`${UPSTREAM_ORIGIN}/${params.path.join("/")}`);
  upstreamUrl.search = new URL(req.url).search;

  // Build headers to send upstream
  const outbound = new Headers();
  //  tell backend which tenant
  outbound.set("X-Tenant-Domain", host);

  // set a session id incase if the user is a guest to rate limit him
  // if the user is a guest, generate a random id
  if (!req.cookies.get(`session_id`)) {
    outbound.set(`session_id`, crypto.randomUUID());
  }

  // forward all the headers
  req.headers.forEach((value, key) => {
    outbound.set(key, value);
  });

  // Forward other important headers you need (User-Agent, Accept-Language) if desired
  const forwarded = await fetch(upstreamUrl.toString(), {
    method: req.method,
    headers: outbound,
    // pass body only for non-GET/HEAD
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    // redirect: "manual",
  });

  // Create response headers to send back to client
  const resHeaders = new Headers(forwarded.headers);

  return new Response(forwarded.body, {
    status: forwarded.status,
    headers: resHeaders,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxy(req, params);
}
export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxy(req, params);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxy(req, params);
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxy(req, params);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxy(req, params);
}
