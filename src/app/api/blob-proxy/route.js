import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl =
    searchParams.get("url") && decodeURIComponent(searchParams.get("url"));

  console.log("✨ targetUrl : ", targetUrl);

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    const parsedUrl = new URL(targetUrl);
    // if (!parsedUrl.hostname.endsWith("more-english.net")) {
    //   return NextResponse.json({ error: "Invalid domain" }, { status: 403 });
    // }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.statusText}` },
        { status: response.status }
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
      { status: 500 }
    );
  }
}
