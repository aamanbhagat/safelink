import { NextRequest, NextResponse } from "next/server";
import { encryptUrl } from "@/lib/encryption";

// API Key for authentication
const API_KEY = process.env.SAFELINK_API_KEY || "your-api-key-here";

interface SingleRequest {
    url: string;
    apiKey: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: SingleRequest = await request.json();

        // Validate API key
        if (!body.apiKey || body.apiKey !== API_KEY) {
            return NextResponse.json(
                { error: "Invalid or missing API key" },
                { status: 401 }
            );
        }

        // Validate URL
        if (!body.url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        let processedUrl = body.url.trim();
        if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
            processedUrl = "https://" + processedUrl;
        }

        try {
            new URL(processedUrl);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            );
        }

        // Get base URL
        const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;

        // Encrypt and generate safelink
        const encrypted = encryptUrl(processedUrl);
        const safelink = `${baseUrl}/go/${encrypted}`;

        return NextResponse.json({
            success: true,
            original: body.url,
            safelink,
        });

    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        name: "SafeLink Single API",
        version: "1.0",
        endpoint: "POST /api/convert",
        body: {
            apiKey: "Your API key (required)",
            url: "URL to convert",
        },
        response: {
            success: true,
            original: "Original URL",
            safelink: "Generated safelink",
        },
    });
}
