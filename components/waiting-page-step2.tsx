"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CountdownTimer } from "@/components/countdown-timer";
import { BannerAd, SquareAd } from "@/components/monetag-ads";
import { Tips } from "@/components/tips";
import { completeStep2Action } from "@/lib/session-actions";
import { config } from "@/lib/config";

interface WaitingPageStep2Props {
    slug: string;
    token: string;
}

export function WaitingPageStep2({ slug, token }: WaitingPageStep2Props) {
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleComplete = useCallback(async () => {
        setRedirecting(true);
        setError(null);

        const result = await completeStep2Action(token, slug);

        if (result.success && result.url) {
            // Final redirect - session is now invalidated (one-time use)
            window.location.href = result.url;
        } else {
            // Session expired or already used - redirect to step 1
            router.push(`/go/${slug}`);
        }
    }, [slug, token, router]);

    const handleAdClick = useCallback(() => {
        console.log("Ad triggered on button click - Step 2 (Final)");
    }, []);

    if (redirecting) {
        return (
            <div className="waiting-page step2">
                <div className="waiting-main">
                    <div className="text-center">
                        <span className="header-icon">🚀</span>
                        <h1 className="header-title">Redirecting...</h1>
                        <p className="header-subtitle">Taking you to your destination</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-page">
                <div className="error-container">
                    <h1 className="error-title">❌ Error</h1>
                    <p className="error-message">{error}</p>
                    <a href={`/go/${slug}`} className="error-link">
                        ← Try Again
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="waiting-page step2">
            <header className="waiting-header">
                <div className="header-content">
                    <span className="header-icon">✨</span>
                    <h1 className="header-title">Almost There!</h1>
                    <p className="header-subtitle">Your link is ready in just a few seconds</p>
                </div>
            </header>

            <div className="ad-wrapper banner">
                <BannerAd />
            </div>

            <main className="waiting-main">
                <CountdownTimer
                    duration={config.page2Timer}
                    onComplete={handleComplete}
                    step={2}
                    showButton={true}
                    buttonText="🎯 Get Your Link"
                    onButtonClick={handleAdClick}
                />

                <div className="content-grid">
                    <div className="ad-wrapper square">
                        <SquareAd />
                    </div>
                    <div className="tips-wrapper">
                        <Tips />
                    </div>
                    <div className="ad-wrapper square">
                        <SquareAd />
                    </div>
                </div>

                <div className="security-notice final">
                    <span className="notice-icon">✅</span>
                    <span className="notice-text">Link verified & ready to access</span>
                </div>
            </main>

            <div className="ad-wrapper banner">
                <BannerAd />
            </div>

            <footer className="waiting-footer">
                <p>⏳ Please wait for the timer to complete...</p>
            </footer>
        </div>
    );
}
