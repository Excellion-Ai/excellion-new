import { Helmet } from "react-helmet-async";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description = "This page is under construction." }: PlaceholderPageProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <Helmet>
      <title>{`${title} | Excellion`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={typeof window !== "undefined" ? window.location.pathname : "/"} />
      <meta property="og:title" content={`${title} | Excellion`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : "/"} />
    </Helmet>
    <Navigation />
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
      </div>
    </main>
    <Footer />
  </div>
);

export default PlaceholderPage;
