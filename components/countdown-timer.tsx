"use client";

import { useEffect, useState, useCallback } from "react";

interface CountdownTimerProps {
    duration: number; // in seconds
    onComplete: () => void;
    step: 1 | 2;
    showButton?: boolean; // Show button instead of auto-redirect
    buttonText?: string;
    onButtonClick?: () => void;
}

export function CountdownTimer({
    duration,
    onComplete,
    step,
    showButton = false,
    buttonText = "Continue",
    onButtonClick
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isClient, setIsClient] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        if (timeLeft <= 0) {
            setIsComplete(true);
            if (!showButton) {
                onComplete();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete, isClient, showButton]);

    const progress = ((duration - timeLeft) / duration) * 100;

    const handleButtonClick = useCallback(() => {
        if (onButtonClick) {
            onButtonClick();
        }
        onComplete();
    }, [onButtonClick, onComplete]);

    if (!isClient) {
        return (
            <div className="text-center">
                <div className="timer-circle">
                    <span className="timer-number">{duration}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center space-y-6">
            {/* Circular Timer or Button */}
            {!isComplete ? (
                <>
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="timer-svg" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                                className="text-gray-700"
                                strokeWidth="6"
                                stroke="currentColor"
                                fill="transparent"
                                r="44"
                                cx="50"
                                cy="50"
                            />
                            {/* Progress circle */}
                            <circle
                                className="text-indigo-500 transition-all duration-1000 ease-linear"
                                strokeWidth="6"
                                strokeDasharray={276.46}
                                strokeDashoffset={276.46 * (1 - progress / 100)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="44"
                                cx="50"
                                cy="50"
                                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                            />
                        </svg>
                        <span className="absolute text-5xl font-bold text-white">{timeLeft}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="progress-section">
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="progress-info">
                            <span className="progress-step">Step {step} of 2</span>
                            <span className="progress-time"> ({timeLeft} seconds remaining)</span>
                        </div>
                    </div>
                </>
            ) : (
                /* Show button when timer completes */
                <div className="button-container">
                    <button
                        onClick={handleButtonClick}
                        className="get-link-btn"
                    >
                        {buttonText}
                    </button>
                    <p className="button-hint">Click the button above to continue</p>
                </div>
            )}
        </div>
    );
}
