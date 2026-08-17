import {
  extractTenantFromHostServer,
  getClientIpForwardingHeaders,
} from "@/helpers/fetchers/server-utils";
import { getCookie } from "@/utils/api";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl =
    searchParams.get("url") && decodeURIComponent(searchParams.get("url"));

  console.log("✨ targetUrl : ", targetUrl);

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 },
    );
  }

  try {
    const [{ host }, clientIpHeaders, token] = await Promise.all([
      extractTenantFromHostServer(),
      getClientIpForwardingHeaders(),
      getCookie(),
    ]);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "X-Tenant-Domain": host,
        ...clientIpHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.statusText}` },
        { status: response.status },
      );
    }

    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("💥 Blob Proxy server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
