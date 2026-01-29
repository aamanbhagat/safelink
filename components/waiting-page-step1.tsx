"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CountdownTimer } from "@/components/countdown-timer";
import { BannerAd, SquareAd } from "@/components/monetag-ads";
import { Tips } from "@/components/tips";
import { initSessionAction, completeStep1Action } from "@/lib/session-actions";
import { config } from "@/lib/config";

interface WaitingPageStep1Props {
    slug: string;
}

export function WaitingPageStep1({ slug }: WaitingPageStep1Props) {
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Create session on mount
    useEffect(() => {
        initSessionAction(slug).then((result) => {
            setToken(result.token);
        });
    }, [slug]);

    const handleComplete = useCallback(async () => {
        if (!token) {
            alert("Session not ready. Please refresh the page.");
            return;
        }

        setProcessing(true);

        const result = await completeStep1Action(token, slug);

        if (result.success && result.step2Url) {
            // Navigate to step 2 with token in URL
            router.push(result.step2Url);
        } else {
            alert("Session expired. Please refresh the page.");
            window.location.reload();
        }
    }, [router, slug, token]);

    const handleAdClick = useCallback(() => {
        console.log("Ad triggered on button click - Step 1");
    }, []);

    if (!token || processing) {
        return (
            <div className="waiting-page">
                <div className="waiting-main">
                    <div className="text-center">
                        <span className="header-icon">⏳</span>
                        <h1 className="header-title">{processing ? "Processing..." : "Loading..."}</h1>
                        <p className="header-subtitle">Please wait...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="waiting-page">
            <header className="waiting-header">
                <div className="header-content">
                    <span className="header-icon">🔒</span>
                    <h1 className="header-title">Generating Your Secure Link</h1>
                    <p className="header-subtitle">Please wait while we verify your link</p>
                </div>
            </header>

            <div className="ad-wrapper banner">
                <BannerAd />
            </div>

            <main className="waiting-main">
                <CountdownTimer
                    duration={config.page1Timer}
                    onComplete={handleComplete}
                    step={1}
                    showButton={true}
                    buttonText="🔓 Continue to Step 2"
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

                <div className="security-notice">
                    <span className="notice-icon">🛡️</span>
                    <span className="notice-text">Link verified & protected</span>
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
