// Session management using URL tokens
// Simple and reliable - token passed through URL

import crypto from "crypto";

const SESSION_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface SessionData {
    slug: string;
    step1Completed: boolean;
    createdAt: number;
    used: boolean;
}

// In-memory storage
const sessions = new Map<string, SessionData>();

// Cleanup expired sessions
function cleanupSessions() {
    const now = Date.now();
    for (const [token, session] of sessions.entries()) {
        if (now - session.createdAt > SESSION_EXPIRY) {
            sessions.delete(token);
        }
    }
}

/**
 * Create a new session and return token
 */
export function createSession(slug: string): string {
    cleanupSessions();

    const token = crypto.randomBytes(16).toString("hex");

    sessions.set(token, {
        slug,
        step1Completed: false,
        createdAt: Date.now(),
        used: false,
    });

    return token;
}

/**
 * Mark step 1 as completed
 */
export function completeStep1(token: string, slug: string): boolean {
    const session = sessions.get(token);

    if (!session) return false;
    if (session.slug !== slug) return false;
    if (Date.now() - session.createdAt > SESSION_EXPIRY) {
        sessions.delete(token);
        return false;
    }

    session.step1Completed = true;
    return true;
}

/**
 * Validate step 2 access
 */
export function validateStep2(token: string | null, slug: string): { valid: boolean; reason?: string } {
    if (!token) {
        return { valid: false, reason: "no_token" };
    }

    const session = sessions.get(token);

    if (!session) {
        return { valid: false, reason: "invalid_token" };
    }

    if (session.slug !== slug) {
        return { valid: false, reason: "wrong_link" };
    }

    if (!session.step1Completed) {
        return { valid: false, reason: "step1_not_completed" };
    }

    if (session.used) {
        return { valid: false, reason: "already_used" };
    }

    if (Date.now() - session.createdAt > SESSION_EXPIRY) {
        sessions.delete(token);
        return { valid: false, reason: "expired" };
    }

    return { valid: true };
}

/**
 * Mark session as used and delete it
 */
export function useSession(token: string, slug: string): boolean {
    const session = sessions.get(token);

    if (!session || session.slug !== slug) return false;

    sessions.delete(token);
    return true;
}
