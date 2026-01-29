"use client";

import { useState } from "react";
import { isValidUrl } from "@/lib/link-encoder";
import { generateSafelink } from "@/lib/actions";

export function LinkGenerator() {
    const [url, setUrl] = useState("");
    const [safelink, setSafelink] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setError("");
        setSafelink("");
        setCopied(false);

        if (!url.trim()) {
            setError("Please enter a URL");
            return;
        }

        // Add https:// if not present
        let processedUrl = url.trim();
        if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
            processedUrl = "https://" + processedUrl;
        }

        if (!isValidUrl(processedUrl)) {
            setError("Please enter a valid URL");
            return;
        }

        setLoading(true);

        try {
            // Call server action to encrypt the URL
            const result = await generateSafelink(processedUrl);

            if (result.success && result.safelink) {
                const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
                setSafelink(`${baseUrl}${result.safelink}`);
            } else {
                setError(result.error || "Failed to generate safelink");
            }
        } catch {
            setError("Failed to generate safelink");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!safelink) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(safelink)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }
    };

    const fallbackCopy = () => {
        try {
            const textarea = document.createElement("textarea");
            textarea.value = safelink;
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError("Failed to copy. Please copy manually.");
        }
    };

    return (
        <div className="generator-container">
            <h2 className="generator-title">🔗 Generate SafeLink</h2>
            <p className="generator-subtitle">
                Paste any URL below to create a secure, monetized safelink
            </p>

            <div className="generator-form">
                <div className="input-group">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/your-link"
                        className="generator-input"
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        disabled={loading}
                    />
                    <button
                        onClick={handleGenerate}
                        className="generate-btn"
                        type="button"
                        disabled={loading}
                    >
                        {loading ? "Encrypting..." : "Generate"}
                    </button>
                </div>

                {error && <p className="error-msg">{error}</p>}

                {safelink && (
                    <div className="result-container">
                        <label className="result-label">🔒 Your Encrypted SafeLink:</label>
                        <div className="result-box">
                            <input
                                type="text"
                                value={safelink}
                                readOnly
                                className="result-input"
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button onClick={handleCopy} className="copy-btn" type="button">
                                {copied ? "✓ Copied!" : "Copy"}
                            </button>
                        </div>
                        <p className="security-note">🛡️ URL is encrypted - cannot be decoded by users</p>
                    </div>
                )}
            </div>
        </div>
    );
}
