import { Helmet } from "react-helmet-async";

const BASE_URL = "https://excellioncourses.com";

interface SEOProps {
  title: string;
  description: string;
  path: string; // e.g. "/privacy"
  /** Optional override for og:image */
  image?: string;
  /** Extra JSON-LD blocks (already-stringified or objects) */
  jsonLd?: Array<Record<string, unknown>>;
  /** Set true for private/auth pages that shouldn't be indexed */
  noindex?: boolean;
}

/**
 * Per-route SEO head tags. Sets title, description, canonical, and
 * og:title/description/url so each route self-references instead of
 * inheriting the homepage tags from index.html.
 */
const SEO = ({ title, description, path, image, jsonLd, noindex }: SEOProps) => {
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd?.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;