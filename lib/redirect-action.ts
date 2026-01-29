"use server";

// Server Action for final redirect - URL is never exposed to client
import { decryptUrl } from "@/lib/encryption";

export async function getRedirectUrl(slug: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Decrypt server-side only
        const url = decryptUrl(slug);
        return { success: true, url };
    } catch {
        return { success: false, error: "Invalid or expired link" };
    }
}

export async function validateSlug(slug: string): Promise<boolean> {
    try {
        decryptUrl(slug);
        return true;
    } catch {
        return false;
    }
}
