"use server";

// Server Action to generate encrypted safelinks
import { encryptUrl } from "@/lib/encryption";

export async function generateSafelink(destinationUrl: string): Promise<{ success: boolean; safelink?: string; error?: string }> {
    try {
        // Validate URL
        new URL(destinationUrl);

        // Encrypt the URL (only server knows the key)
        const encryptedSlug = encryptUrl(destinationUrl);

        return {
            success: true,
            safelink: `/go/${encryptedSlug}`,
        };
    } catch {
        return {
            success: false,
            error: "Invalid URL provided",
        };
    }
}
