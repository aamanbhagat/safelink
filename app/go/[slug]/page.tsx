import { validateSlug } from "@/lib/redirect-action";
import { WaitingPageStep1 } from "@/components/waiting-page-step1";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page1({ params }: PageProps) {
    const { slug } = await params;

    // Validate slug server-side
    const isValid = await validateSlug(slug);

    if (!isValid) {
        return (
            <div className="error-page">
                <div className="error-container">
                    <h1 className="error-title">❌ Invalid Link</h1>
                    <p className="error-message">
                        This link appears to be invalid or has expired.
                    </p>
                    <a href="/" className="error-link">
                        ← Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    // Session will be created by client component on mount
    return <WaitingPageStep1 slug={slug} />;
}
