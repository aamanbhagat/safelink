"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";

interface MontagAdProps {
    type: "banner" | "square" | "native";
    className?: string;
}

export function MonetagAd({ type, className = "" }: MontagAdProps) {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined" || !adRef.current) return;

        // Clear any existing content
        adRef.current.innerHTML = "";

        // Get the appropriate zone ID
        let zoneId = "";
        switch (type) {
            case "banner":
                zoneId = config.monetag.bannerZoneId;
                break;
            case "square":
                zoneId = config.monetag.squareZoneId;
                break;
            case "native":
                zoneId = config.monetag.nativeZoneId;
                break;
        }

        // Create Monetag ad script
        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");

        // Monetag banner/display ad code structure
        // Replace this with actual Monetag code when you have zone IDs
        script.innerHTML = `
      (function(d,z,s){
        s.src='//gizokraede.net/'+z+'.js';
        try{
          (document.body||document.documentElement).appendChild(s);
        }catch(e){}
      })(document,'${zoneId}',document.createElement('script'));
    `;

        adRef.current.appendChild(script);

        return () => {
            if (adRef.current) {
                adRef.current.innerHTML = "";
            }
        };
    }, [type]);

    // Get dimensions based on ad type
    const getDimensions = () => {
        switch (type) {
            case "banner":
                return "min-h-[90px] w-full max-w-[728px]";
            case "square":
                return "min-h-[250px] w-full max-w-[300px]";
            case "native":
                return "min-h-[100px] w-full";
            default:
                return "";
        }
    };

    return (
        <div
            ref={adRef}
            className={`ad-container ${getDimensions()} ${className}`}
            data-ad-type={type}
        >
            {/* Placeholder shown until ad loads */}
            <div className="ad-placeholder">
                <span className="text-xs text-gray-500">Advertisement</span>
            </div>
        </div>
    );
}

// Dedicated banner component
export function BannerAd({ className = "" }: { className?: string }) {
    return <MonetagAd type="banner" className={className} />;
}

// Dedicated square component
export function SquareAd({ className = "" }: { className?: string }) {
    return <MonetagAd type="square" className={className} />;
}
