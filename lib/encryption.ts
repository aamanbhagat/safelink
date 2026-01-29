// Server-side URL encryption/decryption
// The destination URL is never exposed to the client

import crypto from "crypto";

// Secret key for encryption - in production, use environment variable
const SECRET_KEY = process.env.SAFELINK_SECRET || "your-super-secret-key-32ch"; // Must be 32 characters
const ALGORITHM = "aes-256-gcm";

/**
 * Encrypt a URL - makes it impossible to decode without the secret key
 */
export function encryptUrl(url: string): string {
    // Generate random IV
    const iv = crypto.randomBytes(16);

    // Ensure key is exactly 32 bytes
    const key = crypto.scryptSync(SECRET_KEY, "salt", 32);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt
    let encrypted = cipher.update(url, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get auth tag
    const authTag = cipher.getAuthTag();

    // Combine IV + authTag + encrypted data
    const combined = iv.toString("hex") + authTag.toString("hex") + encrypted;

    // Make URL-safe
    return Buffer.from(combined, "hex").toString("base64url");
}

/**
 * Decrypt a URL - only works with the secret key
 */
export function decryptUrl(encryptedSlug: string): string {
    try {
        // Decode from base64url
        const combined = Buffer.from(encryptedSlug, "base64url").toString("hex");

        // Extract IV (32 hex = 16 bytes)
        const iv = Buffer.from(combined.slice(0, 32), "hex");

        // Extract auth tag (32 hex = 16 bytes)
        const authTag = Buffer.from(combined.slice(32, 64), "hex");

        // Extract encrypted data
        const encrypted = combined.slice(64);

        // Derive key
        const key = crypto.scryptSync(SECRET_KEY, "salt", 32);

        // Create decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        // Decrypt
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");

        // Validate it's a URL
        new URL(decrypted);

        return decrypted;
    } catch {
        throw new Error("Invalid or tampered link");
    }
}

/**
 * Validate if encrypted slug is valid (without revealing the URL)
 */
export function isValidEncryptedSlug(slug: string): boolean {
    try {
        decryptUrl(slug);
        return true;
    } catch {
        return false;
    }
}
