"use server";

import { createSession, completeStep1, validateStep2, useSession } from "@/lib/session";
import { decryptUrl } from "@/lib/encryption";

/**
 * Initialize session for step 1
 */
export async function initSessionAction(slug: string): Promise<{ token: string }> {
    const token = createSession(slug);
    return { token };
}

/**
 * Complete step 1 and get step 2 URL with new token
 */
export async function completeStep1Action(token: string, slug: string): Promise<{ success: boolean; step2Url?: string }> {
    const newToken = completeStep1(token, slug);

    if (!newToken) {
        return { success: false };
    }

    // Return step 2 URL with the NEW token (has step1Completed=true)
    return {
        success: true,
        step2Url: `/go/${slug}/step2?t=${encodeURIComponent(newToken)}`
    };
}

/**
 * Validate step 2 access
 */
export async function validateStep2Action(token: string | null, slug: string): Promise<{ valid: boolean; reason?: string }> {
    return validateStep2(token, slug);
}

/**
 * Complete step 2 and get redirect URL
 */
export async function completeStep2Action(token: string, slug: string): Promise<{ success: boolean; url?: string; error?: string }> {
    // Validate first
    const validation = validateStep2(token, slug);

    if (!validation.valid) {
        return { success: false, error: "Session expired or invalid" };
    }

    try {
        // Decrypt URL
        const url = decryptUrl(slug);

        // Mark token as used (one-time)
        useSession(token);

        return { success: true, url };
    } catch {
        return { success: false, error: "Invalid link" };
    }
}
