import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, X, FileText } from "lucide-react";

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

  // Anonymous preview state removed: we now redirect to auth immediately
  // after generating. The inline locked teaser is no longer shown.

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

    // Anonymous flow: generate the course, stash the result, redirect to signup.
    // The generated outline is saved to localStorage (survives OAuth redirects).
    // After auth, Auth.tsx and AuthCallback.tsx detect the stash, save the course
    // to the new user's account, and land them in /studio/:id with their preview.
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

      // Stash the generated course + inputs for post-auth claim.
      // Use localStorage (not sessionStorage) because Google OAuth is a
      // full-page redirect that can clear sessionStorage in some browsers.
      const outlinePayload = { ...data, _prompt: effectivePrompt, _draft: draft };
      try {
        localStorage.setItem("anon-course-outline", JSON.stringify(outlinePayload));
      } catch { /* quota */ }

      // Go straight to signup. No inline preview.
      trackEvent("claim_account_clicked");
      navigate("/auth?mode=signup&redirect=/dashboard");
    } catch (err: any) {
      console.error("Anonymous generation error:", err);
      toast.error(err?.message || "Generation failed. Try again.");
    } finally {
      setIsStarting(false);
    }
  };

  // handleClaimAccount and handleEmailOutline removed.
  // Anonymous users are now redirected to auth immediately after generation.
  // The email fallback (leads capture) can be re-added as a separate feature.

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
    <section id="hero" className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-20 sm:pt-20">
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'hsl(38 10% 6%)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-4 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-body font-semibold tracking-wide">Full Course in 1 Weekend</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-foreground leading-tight mb-2">
            Build your online course in{" "}
            <em className="not-italic text-gradient-gold">1 weekend.</em>
          </h1>

          <p className="text-sm text-primary/80 font-body font-medium mb-2">The online course platform built for fitness coaches</p>

          <p className="max-w-2xl mx-auto mb-4 font-body font-light text-sm sm:text-base text-white/90 hidden sm:block">
            Excellion generates your curriculum, lesson plan, sales page, and student portal from one prompt — so you can spend the weekend filming and publishing instead of wiring up a course platform.
          </p>
          <p className="max-w-2xl mx-auto mb-4 font-body font-light text-sm text-white/90 sm:hidden">
            Generate your curriculum, sales page, and student portal from one prompt.
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
                    <button onClick={() => handleRemoveAttachment(a.id)} className="hover:text-foreground" aria-label="Remove attachment">
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

          <button
            onClick={handleHowItWorks}
            className="w-full px-6 py-2.5 rounded-[10px] bg-secondary/60 text-muted-foreground hover:text-foreground font-medium text-xs flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors font-body"
          >
            <Sparkles className="w-3.5 h-3.5" />
            See how it works
          </button>

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

    </section>
  );
};

export default HeroSection;
