// Simple obfuscation for client-side (for link generation display only)
// Real URL is NEVER exposed - only encrypted version is used

/**
 * Simple encode for generating links (client-side)
 * This is NOT the same as the server encryption
 */
export function encodeUrlClient(url: string): string {
    try {
        new URL(url);
        // Use btoa with obfuscation
        const encoded = btoa(encodeURIComponent(url).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
        ));
        return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } catch {
        throw new Error("Invalid URL");
    }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}
