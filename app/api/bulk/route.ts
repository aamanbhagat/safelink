import { NextRequest, NextResponse } from "next/server";
import { encryptUrl } from "@/lib/encryption";

// API Key for authentication (set in Vercel environment variables)
const API_KEY = process.env.SAFELINK_API_KEY || "your-api-key-here";

interface BulkRequest {
    urls: string[];
    apiKey: string;
}

interface SafelinkResult {
    original: string;
    safelink: string;
    success: boolean;
    error?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: BulkRequest = await request.json();

        // Validate API key
        if (!body.apiKey || body.apiKey !== API_KEY) {
            return NextResponse.json(
                { error: "Invalid or missing API key" },
                { status: 401 }
            );
        }

        // Validate URLs array
        if (!body.urls || !Array.isArray(body.urls)) {
            return NextResponse.json(
                { error: "URLs array is required" },
                { status: 400 }
            );
        }

        // Limit to 1000 URLs per request
        if (body.urls.length > 1000) {
            return NextResponse.json(
                { error: "Maximum 1000 URLs per request" },
                { status: 400 }
            );
        }

        // Get base URL from request
        const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;

        // Process each URL
        const results: SafelinkResult[] = body.urls.map((url) => {
            try {
                // Validate URL
                let processedUrl = url.trim();
                if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
                    processedUrl = "https://" + processedUrl;
                }

                new URL(processedUrl); // Validate

                const encrypted = encryptUrl(processedUrl);

                return {
                    original: url,
                    safelink: `${baseUrl}/go/${encrypted}`,
                    success: true,
                };
            } catch {
                return {
                    original: url,
                    safelink: "",
                    success: false,
                    error: "Invalid URL format",
                };
            }
        });

        // Summary
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            success: true,
            total: results.length,
            converted: successCount,
            failed: failCount,
            results,
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}

// GET method for API documentation
export async function GET() {
    return NextResponse.json({
        name: "SafeLink Bulk API",
        version: "1.0",
        endpoints: {
            "POST /api/bulk": {
                description: "Convert multiple URLs to safelinks",
                body: {
                    apiKey: "Your API key (required)",
                    urls: ["Array of URLs to convert (max 1000)"],
                },
                response: {
                    success: true,
                    total: "Total URLs processed",
                    converted: "Successfully converted count",
                    failed: "Failed count",
                    results: [
                        {
                            original: "Original URL",
                            safelink: "Generated safelink",
                            success: true,
                            error: "Error message if failed",
                        },
                    ],
                },
            },
        },
        example: {
            request: {
                apiKey: "your-api-key",
                urls: [
                    "https://example.com/file1",
                    "https://example.com/file2",
                ],
            },
        },
    });
}
