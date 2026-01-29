// Stateless session using signed tokens
// Works on serverless platforms like Vercel

import crypto from "crypto";

const SECRET_KEY = process.env.SESSION_SECRET || "your-session-secret-key-32ch";
const SESSION_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface TokenPayload {
    slug: string;
    step1Completed: boolean;
    createdAt: number;
    nonce: string;
}

// Used tokens (one-time use tracking) - with expiry cleanup
const usedTokens = new Set<string>();

// Cleanup old tokens periodically
function cleanupUsedTokens() {
    // Clear all if too many (memory protection for serverless)
    if (usedTokens.size > 10000) {
        usedTokens.clear();
    }
}

/**
 * Sign a payload to create a token
 */
function signPayload(payload: TokenPayload): string {
    const data = JSON.stringify(payload);
    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(data)
        .digest("hex");

    const combined = Buffer.from(data).toString("base64url") + "." + signature;
    return combined;
}

/**
 * Verify and decode a token
 */
function verifyToken(token: string): TokenPayload | null {
    try {
        const [dataB64, signature] = token.split(".");
        if (!dataB64 || !signature) return null;

        const data = Buffer.from(dataB64, "base64url").toString("utf8");
        const expectedSig = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(data)
            .digest("hex");

        if (signature !== expectedSig) return null;

        return JSON.parse(data) as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * Create initial session token for step 1
 */
export function createSession(slug: string): string {
    cleanupUsedTokens();

    const payload: TokenPayload = {
        slug,
        step1Completed: false,
        createdAt: Date.now(),
        nonce: crypto.randomBytes(8).toString("hex"),
    };

    return signPayload(payload);
}

/**
 * Complete step 1 - returns new token with step1Completed=true
 */
export function completeStep1(token: string, slug: string): string | null {
    const payload = verifyToken(token);

    if (!payload) return null;
    if (payload.slug !== slug) return null;
    if (Date.now() - payload.createdAt > SESSION_EXPIRY) return null;

    // Create new token with step1Completed
    const newPayload: TokenPayload = {
        ...payload,
        step1Completed: true,
        nonce: crypto.randomBytes(8).toString("hex"), // New nonce
    };

    return signPayload(newPayload);
}

/**
 * Validate step 2 access
 */
export function validateStep2(token: string | null, slug: string): { valid: boolean; reason?: string } {
    if (!token) {
        return { valid: false, reason: "no_token" };
    }

    const payload = verifyToken(token);

    if (!payload) {
        return { valid: false, reason: "invalid_token" };
    }

    if (payload.slug !== slug) {
        return { valid: false, reason: "wrong_link" };
    }

    if (!payload.step1Completed) {
        return { valid: false, reason: "step1_not_completed" };
    }

    if (Date.now() - payload.createdAt > SESSION_EXPIRY) {
        return { valid: false, reason: "expired" };
    }

    // Check if already used
    const tokenId = payload.nonce;
    if (usedTokens.has(tokenId)) {
        return { valid: false, reason: "already_used" };
    }

    return { valid: true };
}

/**
 * Mark token as used (one-time)
 */
export function useSession(token: string): boolean {
    const payload = verifyToken(token);
    if (!payload) return false;

    usedTokens.add(payload.nonce);
    return true;
}
