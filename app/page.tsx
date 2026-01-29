import { LinkGenerator } from "@/components/link-generator";

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-icon">🔗</div>
          <h1 className="hero-title">SafeLink Generator</h1>
          <p className="hero-subtitle">
            Create monetized short links in seconds. Simple, fast, and secure.
          </p>
        </div>
      </header>

      {/* Link Generator */}
      <main className="home-main">
        <LinkGenerator />

        {/* Features */}
        <section className="features">
          <h2 className="features-title">Why Use SafeLink?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Secure Links</h3>
              <p>All links are encrypted and protected</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💰</span>
              <h3>Monetize</h3>
              <p>Earn from every click on your links</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Fast & Simple</h3>
              <p>Generate links instantly, no signup required</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3>Mobile Ready</h3>
              <p>Works perfectly on all devices</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Paste Your Link</h3>
              <p>Enter any URL you want to shorten and monetize</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Get SafeLink</h3>
              <p>Copy your generated safelink instantly</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Share & Earn</h3>
              <p>Share your link and earn from every visitor</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2024 SafeLink. All rights reserved.</p>
        <p className="footer-note">
          Powered by Monetag for secure monetization
        </p>
      </footer>
    </div>
  );
}
