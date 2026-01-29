// Monetag Safelink Configuration
export const config = {
  // Timer settings (in seconds)
  page1Timer: 30,
  page2Timer: 30,

  // Monetag configuration - REPLACE WITH YOUR ACTUAL IDS
  monetag: {
    publisherId: "YOUR_PUBLISHER_ID", // Replace with your Monetag publisher ID
    bannerZoneId: "YOUR_BANNER_ZONE_ID", // 728x90 banner
    squareZoneId: "YOUR_SQUARE_ZONE_ID", // 300x250 square
    nativeZoneId: "YOUR_NATIVE_ZONE_ID", // Native ads (optional)
  },

  // Site settings
  site: {
    name: "SafeLink",
    tagline: "Secure Link Redirection Service",
    primaryColor: "#6366f1", // Indigo
  },

  // Tips to show on waiting pages (rotate randomly)
  tips: [
    {
      icon: "✓",
      text: "This link has been verified and is 100% safe to access",
    },
    {
      icon: "💡",
      text: "Tip: Bookmark this site for quick access to your downloads",
    },
    {
      icon: "⚡",
      text: "Please disable AdBlock to support our free service",
    },
    {
      icon: "🔒",
      text: "All links are scanned for malware and viruses",
    },
    {
      icon: "🙏",
      text: "Thanks for your patience! Your file will be ready shortly",
    },
    {
      icon: "📢",
      text: "Share this site with friends if you find it useful!",
    },
    {
      icon: "🛡️",
      text: "We never store your data - your privacy is our priority",
    },
  ],
};
