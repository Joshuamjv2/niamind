// src/components/SEO.jsx
import { Helmet } from "react-helmet-async";

export default function SEO({ title, description }) {
    const siteName = "Niamind";
    const baseUrl = "https://niamind.com";
    const defaultImage = `${baseUrl}/og-image.png`;

    const fullTitle = `${title} — ${siteName}`;

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={defaultImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={defaultImage} />
        </Helmet>
    );
}
