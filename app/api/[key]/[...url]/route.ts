import { NextRequest, NextResponse } from "next/server";
import { encryptUrl } from "@/lib/encryption";

// Get API key from environment or use default for testing
const API_KEY = process.env.SAFELINK_API_KEY || "demo123";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string; url: string[] }> }
) {
    const { key, url } = await params;

    // Validate API key
    if (key !== API_KEY) {
        return NextResponse.json(
            { error: "Invalid API key" },
            { status: 401 }
        );
    }

    // Get the URL from the remaining path segments
    const targetUrl = url?.join("/") || "";

    if (!targetUrl) {
        return NextResponse.json(
            {
                error: "URL is required",
                usage: "/api/{apikey}/{url}",
                example: "/api/demo123/https://example.com/file.zip"
            },
            { status: 400 }
        );
    }

    try {
        // Ensure URL has protocol
        let processedUrl = targetUrl;
        if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
            processedUrl = "https://" + processedUrl;
        }

        // Validate URL
        new URL(processedUrl);

        // Get base URL from request
        const host = request.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;

        // Encrypt and generate safelink
        const encrypted = encryptUrl(processedUrl);
        const safelink = `${baseUrl}/go/${encrypted}`;

        // Check if user wants JSON or text
        const format = request.nextUrl.searchParams.get("format");

        if (format === "json") {
            return NextResponse.json({
                success: true,
                original: processedUrl,
                safelink,
            });
        }

        if (format === "text") {
            return new NextResponse(safelink, {
                headers: { "Content-Type": "text/plain" },
            });
        }

        // Default: redirect to the safelink
        return NextResponse.redirect(safelink);

    } catch {
        return NextResponse.json(
            { error: "Invalid URL format" },
            { status: 400 }
        );
    }
}
