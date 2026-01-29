"use client";

import { useState, useEffect } from "react";
import { config } from "@/lib/config";

export function Tips() {
    const [currentTip, setCurrentTip] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Rotate tips every 5 seconds
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % config.tips.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!isClient) {
        return (
            <div className="tips-container">
                <div className="tip-card">
                    <span className="tip-icon">{config.tips[0].icon}</span>
                    <span className="tip-text">{config.tips[0].text}</span>
                </div>
            </div>
        );
    }

    const tip = config.tips[currentTip];

    return (
        <div className="tips-container">
            <h3 className="tips-title">💡 Helpful Tips</h3>
            <div className="tip-card" key={currentTip}>
                <span className="tip-icon">{tip.icon}</span>
                <span className="tip-text">{tip.text}</span>
            </div>
            {/* Tip indicators */}
            <div className="tip-indicators">
                {config.tips.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentTip(index)}
                        className={`tip-dot ${index === currentTip ? "active" : ""}`}
                        aria-label={`Show tip ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
