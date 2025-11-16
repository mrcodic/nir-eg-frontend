import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const type = req.nextUrl.searchParams.get("type");

  try {
    if (!url) {
      throw new Error("Audio URL is required");
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch audio: ${response.status} ${response.statusText}`
      );
    }

    if (type === "pdf") {
      const arrayBuffer = await response.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
          "Content-Length":
            response.headers.get("Content-Length") ||
            arrayBuffer.byteLength.toString(),
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
          "Access-Control-Allow-Origin": "*",
          "Content-Disposition":
            response.headers.get("Content-Disposition") || "attachment",
        },
      });
    }

    // Get the audio blob
    const responseBlob = await response.blob();

    console.log("filename  ❤", response);

    // Create a response with the audio blob
    return new NextResponse(responseBlob, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Content-Length":
          response.headers.get("Content-Length") || String(responseBlob.size),
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        "Access-Control-Allow-Origin": "*",
        "Content-Disposition":
          response.headers.get("Content-Disposition") || "attachment",
      },
    });
  } catch (error) {
    console.error("Audio proxy error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch audio",
      },
      { status: 500 }
    );
  }
}
