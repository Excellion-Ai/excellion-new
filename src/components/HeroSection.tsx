import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, X, FileText, Lock, Mail, Loader2 } from "lucide-react";
const heroImg = "/hero-bg.jpg";
import AttachmentMenu from "@/components/secret-builder/attachments/AttachmentMenu";
import type { AttachmentMenuHandle } from "@/components/secret-builder/attachments/AttachmentMenu";
import type { AttachmentItem } from "@/components/secret-builder/attachments/types";
import { motion } from "framer-motion";
import { GuidedPromptBuilder } from "@/components/builder/GuidedPromptBuilder";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { analytics, trackEvent } from "@/lib/analytics";

const suggestions = [
  "6-week fat loss course",
  "Beginner strength course",
  "Home workout fundamentals course",
];

const TYPING_PHRASES = [
  "Help busy moms lose 10 lbs in 8 weeks",
  "Build a 6-week strength program for beginners",
  "Create a 30-day mobility challenge",
  "Launch a nutrition coaching course for athletes",
];

const TYPING_SPEED = 35;
const DELETING_SPEED = 20;
const PAUSE_AFTER_TYPE = 1200;
const PAUSE_AFTER_DELETE = 300;

const ALLOWED_EMAIL = "excellionai@gmail.com";

function useTypingAnimation(phrases: string[], active: boolean) {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const phrase = phrases[phraseIdx];

    if (!isDeleting && charIdx < phrase.length) {
      const t = setTimeout(() => {
        setDisplay(phrase.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(t);
    }

    if (!isDeleting && charIdx === phrase.length) {
      const t = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIdx > 0) {
      const t = setTimeout(() => {
        setDisplay(phrase.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, DELETING_SPEED);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIdx === 0) {
      const t = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIdx((phraseIdx + 1) % phrases.length);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(t);
    }
  }, [active, charIdx, isDeleting, phraseIdx, phrases]);

  return display;
}

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribed } = useSubscription();

  const [prompt, setPrompt] = useState("");
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [pendingBrandStyle, setPendingBrandStyle] = useState<any>(undefined);
  const attachMenuRef = useRef<AttachmentMenuHandle>(null);

  const handleAddAttachment = (item: AttachmentItem) => {
    setAttachments((prev) => [...prev, item]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const animatedText = useTypingAnimation(TYPING_PHRASES, !userHasTyped && !prompt);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (!userHasTyped && e.target.value) setUserHasTyped(true);
    if (userHasTyped && !e.target.value) setUserHasTyped(false);
  };

  /** Persist guided-prompt answers so they survive auth + paywall + checkout. */
  const persistDraft = (promptOverride?: string) => {
    const effective = (promptOverride || prompt).trim();
    if (!effective) return;
    const draft = buildDraft();
    if (promptOverride) draft.prompt = effective;
    const serialized = JSON.stringify(draft);
    // localStorage for durability across tabs; sessionStorage mirrors it so
    // the "save answers to sessionStorage" contract is explicit even when
    // the user returns via Stripe's redirect.
    localStorage.setItem("builder-draft", serialized);
    localStorage.setItem("builder-initial-idea", effective);
    try {
      sessionStorage.setItem("builder-draft", serialized);
      sessionStorage.setItem("builder-initial-idea", effective);
    } catch { /* sessionStorage quota is best-effort */ }
  };

  // Anonymous preview state
  const [anonOutline, setAnonOutline] = useState<any>(null);
  const [emailCapture, setEmailCapture] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  /** Store structured draft and navigate to builder */
  const handleStartBuilding = async (overridePrompt?: string) => {
    if (isStarting) return;
    const effectivePrompt = overridePrompt || prompt;

    if (!effectivePrompt.trim()) {
      toast.error("Enter a course idea first.");
      return;
    }

    trackEvent("niche_selected", { niche: effectivePrompt.slice(0, 80) });

    // Logged-in flow: create project and navigate to studio
    if (user) {
      setIsStarting(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Session expired. Please sign in again.");
          navigate("/auth?mode=signin");
          return;
        }

        const draft = buildDraft();
        if (overridePrompt) draft.prompt = overridePrompt.trim();
        localStorage.setItem("builder-draft", JSON.stringify(draft));
        localStorage.setItem("builder-initial-idea", effectivePrompt);

        const { data: proj, error } = await supabase
          .from("builder_projects")
          .insert({ name: effectivePrompt.slice(0, 80), user_id: session.user.id })
          .select("id")
          .single();
        if (error || !proj) throw error;

        const pdfAttachment = attachments.find((a) =>
          a.base64Data && (
            a.mimeType === "application/pdf" ||
            a.name?.toLowerCase().endsWith(".pdf")
          )
        );

        localStorage.setItem("last-project-id", proj.id);

        if (pdfAttachment?.base64Data) {
          try {
            sessionStorage.setItem("builder-pdf-base64", pdfAttachment.base64Data);
            sessionStorage.setItem("builder-pdf-name", pdfAttachment.name);
          } catch (e) {
            console.warn("Failed to store PDF in sessionStorage:", e);
          }
        }

        navigate(`/studio/${proj.id}`, {
          state: {
            initialIdea: effectivePrompt,
            pdfName: pdfAttachment?.name,
          },
        });
      } catch (err: any) {
        console.error("handleStartBuilding error:", err);
        toast.error("Failed to create project. Please try again.");
      } finally {
        setIsStarting(false);
      }
      return;
    }

    // Anonymous flow: generate course outline without login, show locked preview
    setIsStarting(true);
    try {
      const draft = buildDraft();
      if (overridePrompt) draft.prompt = overridePrompt.trim();

      const { data, error } = await supabase.functions.invoke("generate-course", {
        body: {
          prompt: effectivePrompt,
          options: {
            difficulty: "beginner",
            duration_weeks: 6,
            template: "creator",
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      trackEvent("outline_generated", {
        title: data.title,
        module_count: data.modules?.length,
        anonymous: true,
      });

      // Store in sessionStorage so it survives the auth redirect
      const outlinePayload = { ...data, _prompt: effectivePrompt, _draft: draft };
      try {
        sessionStorage.setItem("anon-course-outline", JSON.stringify(outlinePayload));
      } catch { /* quota */ }

      setAnonOutline(outlinePayload);
    } catch (err: any) {
      console.error("Anonymous generation error:", err);
      toast.error(err?.message || "Generation failed. Try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleClaimAccount = () => {
    trackEvent("claim_account_clicked");
    persistDraft();
    navigate("/auth?mode=signup&redirect=/dashboard");
  };

  const handleEmailOutline = async () => {
    if (!emailCapture.trim() || !anonOutline || emailSending) return;
    setEmailSending(true);
    trackEvent("email_fallback_submitted", { email: emailCapture });

    try {
      const { error } = await (supabase as any)
        .from("leads")
        .insert({
          email: emailCapture.trim().toLowerCase(),
          source: "builder_preview",
          niche: anonOutline._prompt?.slice(0, 200) || null,
          outline: anonOutline,
        });

      if (error) throw error;
      toast.success("Outline sent to your inbox.");
      setEmailCapture("");
    } catch (err: any) {
      toast.error(err?.message || "Could not send. Try again.");
    } finally {
      setEmailSending(false);
    }
  };

  /** Build a structured draft object from current state */
  const buildDraft = () => ({
    prompt: prompt.trim(),
    guided: {
      attachmentText: attachments
        .filter((a) => a.content)
        .map((a) => `--- ${a.name} ---\n${a.content}`)
        .join("\n\n") || undefined,
      brandStyle: pendingBrandStyle || undefined,
    },
  });

  const handleHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-32 sm:pt-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.5) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-body font-semibold tracking-wide">Full Course in 1 Weekend</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-foreground leading-tight mb-3">
            Launch your fitness course in{" "}
            <em className="not-italic text-gradient-gold">1 weekend.</em>
          </h1>

          <p className="text-sm text-primary/80 font-body font-medium mb-3">Built for coaches who are done waiting to launch</p>

          <p
            className="max-w-2xl mx-auto mb-6 font-body font-light text-base text-white/90"
          >
            Excellion generates your course outline, lesson plan, sales page copy, and student portal from 1 prompt. Spend the weekend polishing, filming, and publishing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="premium-card p-4 space-y-3"
        >
          <div className="rounded-xl border border-primary/20 bg-black/40 backdrop-blur-sm p-4">
            <GuidedPromptBuilder
              onPromptChange={(p) => {
                setPrompt(p);
                if (p && !userHasTyped) setUserHasTyped(true);
                if (!p) setUserHasTyped(false);
              }}
              onGenerate={(p, brandStyle) => {
                setPrompt(p);
                setPendingBrandStyle(brandStyle);
                setUserHasTyped(true);
                handleStartBuilding(p);
              }}
              isGenerating={isStarting}
              hasAttachment={attachments.length > 0}
              onUploadClick={() => attachMenuRef.current?.openFilePicker()}
            />
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {attachments.map((a) => (
                  <span key={a.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/20 text-xs text-primary">
                    <FileText className="w-3 h-3" />
                    {a.name}
                    <button onClick={() => handleRemoveAttachment(a.id)} className="hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <AttachmentMenu ref={attachMenuRef} onAdd={handleAddAttachment} />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {["Generated in 60 seconds", "Published on your domain", "Keep 100% of revenue"].map((stat) => (
              <span
                key={stat}
                className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary/90 font-body font-medium"
              >
                {stat}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleHowItWorks}
              className="flex-1 px-6 py-3 rounded-[10px] bg-secondary text-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors font-body"
            >
              <Sparkles className="w-4 h-4" />
              See how it works
            </button>
            <button
              onClick={() => handleStartBuilding()}
              disabled={isStarting}
              className="flex-1 px-6 py-3 rounded-[10px] btn-primary text-sm flex items-center justify-center gap-2 font-body disabled:opacity-50"
            >
              {isStarting ? "Creating…" : "Start Building"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setPrompt(s); setUserHasTyped(true); }}
                className="px-3 py-1.5 rounded-full glass-card-light text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Anonymous locked preview */}
      {anonOutline && !user && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 pb-20 -mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border bg-card/95 backdrop-blur-md overflow-hidden"
          >
            {/* Course header */}
            <div className="p-6 sm:p-8 border-b border-border">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
                {anonOutline.title}
              </h2>
              <p className="text-sm text-muted-foreground font-body">
                {anonOutline.description}
              </p>
              {(() => { trackEvent("preview_locked_viewed", { title: anonOutline.title }); return null; })()}
            </div>

            {/* Module list: fully visible structure */}
            <div className="divide-y divide-border">
              {(anonOutline.modules || []).map((mod: any, mi: number) => (
                <div key={mod.id || mi} className="px-6 sm:px-8 py-5">
                  <h3 className="text-sm font-semibold text-foreground font-body mb-3">
                    {mod.title}
                  </h3>
                  <div className="space-y-2">
                    {(mod.lessons || []).map((les: any, li: number) => {
                      const isFirstLesson = mi === 0 && li === 0;
                      return (
                        <div key={les.id || li}>
                          <div className="flex items-center gap-2 text-sm font-body">
                            {isFirstLesson ? (
                              <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                            )}
                            <span className={isFirstLesson ? "text-foreground" : "text-muted-foreground"}>
                              {les.title}
                            </span>
                            {!isFirstLesson && (
                              <span className="ml-auto text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                                Locked
                              </span>
                            )}
                          </div>
                          {/* First lesson: show full content */}
                          {isFirstLesson && les.description && (
                            <p className="mt-2 ml-6 text-xs text-muted-foreground font-body leading-relaxed">
                              {les.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Claim CTA */}
            <div className="p-6 sm:p-8 bg-gradient-to-t from-primary/5 to-transparent border-t border-border">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground font-body">
                  This outline was generated just for you. Create a free account to keep it.
                </p>
                <button
                  onClick={handleClaimAccount}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl btn-primary text-sm font-body font-semibold inline-flex items-center justify-center gap-2 touch-manipulation"
                >
                  Create a free account to keep your course
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-muted-foreground font-body">
                  Your draft saves to your account on signup. It will be lost if you leave.
                </p>

                {/* Email fallback */}
                <div className="flex items-center gap-2 max-w-sm mx-auto pt-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={emailCapture}
                      onChange={(e) => setEmailCapture(e.target.value)}
                      placeholder="or email this outline to me"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleEmailOutline}
                    disabled={emailSending || !emailCapture.trim()}
                    className="px-4 py-2.5 rounded-lg border border-border text-xs font-body font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50 shrink-0"
                  >
                    {emailSending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
