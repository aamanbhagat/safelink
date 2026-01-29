"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CountdownTimer } from "@/components/countdown-timer";
import { BannerAd, SquareAd } from "@/components/monetag-ads";
import { Tips } from "@/components/tips";
import { getRedirectUrl } from "@/lib/redirect-action";
import { config } from "@/lib/config";

interface WaitingPageProps {
    slug: string;
    step: 1 | 2;
}

export function WaitingPage({ slug, step }: WaitingPageProps) {
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    const handleComplete = useCallback(async () => {
        if (step === 1) {
            // Navigate to step 2
            router.push(`/go/${slug}/step2`);
        } else {
            // Step 2: Get URL from server and redirect
            setRedirecting(true);
            const result = await getRedirectUrl(slug);
            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                alert("Failed to get redirect URL");
                setRedirecting(false);
            }
        }
    }, [router, slug, step]);

    const handleAdClick = useCallback(() => {
        // Monetag direct link trigger point
        console.log("Ad triggered on button click");
    }, []);

    const timerDuration = step === 1 ? config.page1Timer : config.page2Timer;
    const headerIcon = step === 1 ? "🔒" : "✨";
    const headerTitle = step === 1 ? "Generating Your Secure Link" : "Almost There!";
    const headerSubtitle = step === 1
        ? "Please wait while we verify your link"
        : "Your link is ready in just a few seconds";
    const buttonText = step === 1 ? "🔓 Continue to Step 2" : "🎯 Get Your Link";
    const noticeText = step === 1 ? "Link verified & protected" : "Link verified & ready to access";

    if (redirecting) {
        return (
            <div className="waiting-page">
                <div className="waiting-main">
                    <div className="text-center">
                        <span className="header-icon">🚀</span>
                        <h1 className="header-title">Redirecting...</h1>
                        <p className="header-subtitle">Please wait while we take you to your destination</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`waiting-page ${step === 2 ? "step2" : ""}`}>
            {/* Header */}
            <header className="waiting-header">
                <div className="header-content">
                    <span className="header-icon">{headerIcon}</span>
                    <h1 className="header-title">{headerTitle}</h1>
                    <p className="header-subtitle">{headerSubtitle}</p>
                </div>
            </header>

            {/* Top Banner Ad */}
            <div className="ad-wrapper banner">
                <BannerAd />
            </div>

            {/* Main Content */}
            <main className="waiting-main">
                {/* Countdown Timer with Button */}
                <CountdownTimer
                    duration={timerDuration}
                    onComplete={handleComplete}
                    step={step}
                    showButton={true}
                    buttonText={buttonText}
                    onButtonClick={handleAdClick}
                />

                {/* Middle section with ads and tips */}
                <div className="content-grid">
                    {/* Left Ad */}
                    <div className="ad-wrapper square">
                        <SquareAd />
                    </div>

                    {/* Tips in the middle */}
                    <div className="tips-wrapper">
                        <Tips />
                    </div>

                    {/* Right Ad */}
                    <div className="ad-wrapper square">
                        <SquareAd />
                    </div>
                </div>

                {/* Security notice - NO URL exposed */}
                <div className={`security-notice ${step === 2 ? "final" : ""}`}>
                    <span className="notice-icon">{step === 2 ? "✅" : "🛡️"}</span>
                    <span className="notice-text">{noticeText}</span>
                </div>
            </main>

            {/* Bottom Banner Ad */}
            <div className="ad-wrapper banner">
                <BannerAd />
            </div>

            {/* Footer notice */}
            <footer className="waiting-footer">
                <p>⏳ Please wait for the timer to complete...</p>
            </footer>
        </div>
    );
}
