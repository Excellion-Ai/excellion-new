import { useState } from "react";
import { Mail, Twitter, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EMAIL = "excellionai@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const infoCards = [
  {
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: Twitter,
    label: "Twitter/X",
    value: "@excellionai",
    href: "https://twitter.com/excellionai",
  },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!name.trim()) { toast.error("Please enter your name."); return; }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) { toast.error("Please enter a valid email."); return; }
    if (!message.trim()) { toast.error("Please enter a message."); return; }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: { name: name.trim(), email: email.trim(), message: message.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Contact | Excellion"
        description="Get in touch with the Excellion team. Email us or reach out on X. We usually reply within one business day."
        path="/contact"
      />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-center text-muted-foreground font-body mb-10">
            Have a question or need help? Reach out and we'll get back to you.
          </p>

          {/* Contact Form */}
          {submitted ? (
            <div className="rounded-xl p-8 text-center mb-12" style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(43 52% 54% / 0.15)" }}>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">Message sent</h2>
              <p className="text-muted-foreground font-body text-sm">
                Thanks, we'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl p-6 sm:p-8 mb-12 space-y-5" style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(43 52% 54% / 0.15)" }}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl btn-primary text-sm font-body font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          )}

          {/* Info Cards */}
          <p className="text-center text-muted-foreground font-body text-sm mb-4">
            Or reach us directly
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {infoCards.map(({ icon: Icon, label, value, href }) => {
              const Wrapper = href ? "a" : "div";
              const linkProps = href
                ? {
                    href,
                    target: href.startsWith("http") ? "_blank" : undefined,
                    rel: href.startsWith("http") ? "noopener noreferrer" : undefined,
                  }
                : {};
              return (
                <Wrapper
                  key={label}
                  {...linkProps}
                  className={`flex flex-col items-center text-center rounded-xl p-5 transition-colors ${
                    href ? "cursor-pointer hover:border-primary/40" : ""
                  }`}
                  style={{
                    background: "hsl(0 0% 9%)",
                    border: "1px solid hsl(43 52% 54% / 0.15)",
                  }}
                >
                  <Icon className="text-gold mb-2" size={22} />
                  <span className="text-foreground font-heading text-sm font-semibold mb-1">{label}</span>
                  <span className="text-muted-foreground font-body text-xs">{value}</span>
                </Wrapper>
              );
            })}
          </div>

          <p className="text-center text-muted-foreground text-sm font-body">
            We typically respond within 24 hours
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
