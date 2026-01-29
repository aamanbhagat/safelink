import { redirect } from "next/navigation";
import { validateSlug } from "@/lib/redirect-action";
import { validateStep2Action } from "@/lib/session-actions";
import { WaitingPageStep2 } from "@/components/waiting-page-step2";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ t?: string }>;
}

export default async function Page2({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { t: token } = await searchParams;

    // Validate slug
    const isValidSlug = await validateSlug(slug);
    if (!isValidSlug) {
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

    // Validate session token
    const sessionValidation = await validateStep2Action(token || null, slug);

    if (!sessionValidation.valid) {
        // No valid token - redirect to step 1
        redirect(`/go/${slug}`);
    }

    return <WaitingPageStep2 slug={slug} token={token!} />;
}
