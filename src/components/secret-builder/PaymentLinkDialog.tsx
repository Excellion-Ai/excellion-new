import { useEffect, useState } from "react";
import { ExternalLink, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const STRIPE_LINK_PREFIX = "https://buy.stripe.com/";

type Screen = "choice" | "paste" | "guide";

interface PaymentLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUrl: string | null;
  onSave: (url: string | null) => Promise<void> | void;
  courseTitle?: string;
}

const PaymentLinkDialog = ({ open, onOpenChange, currentUrl, onSave, courseTitle }: PaymentLinkDialogProps) => {
  const [screen, setScreen] = useState<Screen>("choice");
  const [value, setValue] = useState(currentUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reset state each time the dialog opens.
  // If a URL is already set, skip choice → go straight to paste (prefilled).
  useEffect(() => {
    if (open) {
      setValue(currentUrl ?? "");
      setError(null);
      setScreen(currentUrl ? "paste" : "choice");
    }
  }, [open, currentUrl]);

  const handleSave = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      setSaving(true);
      try {
        await onSave(null);
        onOpenChange(false);
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!trimmed.startsWith(STRIPE_LINK_PREFIX)) {
      setError("Must be a valid Stripe Payment Link (starts with buy.stripe.com)");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSave(trimmed);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const BackLink = ({ to }: { to: Screen }) => (
    <button
      type="button"
      onClick={() => { setScreen(to); setError(null); }}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="h-3 w-3" />
      Back
    </button>
  );

  const UrlInput = () => (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="stripe-payment-url" className="text-sm">
          Paste your Stripe Payment Link
        </Label>
        <Input
          id="stripe-payment-url"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://buy.stripe.com/..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <a
        href="https://stripe.com/docs/payment-links"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        What's a Payment Link? <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );

  // ── Screen: Choice ──────────────────────────────────
  if (screen === "choice") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Stripe Payment Link</DialogTitle>
            <DialogDescription>How your students will pay you</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
            <button
              type="button"
              onClick={() => setScreen("paste")}
              className="group text-left p-4 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                I already have a Payment Link
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste your existing buy.stripe.com URL
              </p>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary mt-2 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => setScreen("guide")}
              className="group text-left p-4 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                I need to create one
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We'll walk you through it — takes 2 minutes
              </p>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary mt-2 transition-colors" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Screen: Paste (existing UI + back link) ─────────
  if (screen === "paste") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          {!currentUrl && <BackLink to="choice" />}
          <DialogHeader>
            <DialogTitle>Paste your Stripe Payment Link</DialogTitle>
          </DialogHeader>
          <UrlInput />
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Screen: 4-Step Guide ────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] p-0">
        <ScrollArea className="max-h-[85vh] px-6 py-6">
          <BackLink to="choice" />
          <DialogHeader className="mb-5">
            <DialogTitle>Create a Stripe Payment Link in 4 steps</DialogTitle>
            <DialogDescription>
              We'll walk you through it. Takes about 2 minutes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                1
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Open your Stripe dashboard</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                  You'll need a free Stripe account. Sign up if you don't have one yet.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() =>
                    window.open("https://dashboard.stripe.com/payment-links/create", "_blank", "noopener")
                  }
                >
                  Open Stripe dashboard <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                2
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Create your product</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click <span className="font-medium text-foreground">+ New</span> at the top of the
                  Payment Links page. Name your product the same as your course so students recognize it.
                </p>
                {courseTitle && (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs">
                    <span className="text-muted-foreground">Suggested product name: </span>
                    <span className="font-medium text-foreground">{courseTitle}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                3
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Set your price</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter your course price and click <span className="font-medium text-foreground">Create link</span>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                4
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Copy the URL and paste it below</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                  Stripe will give you a URL starting with <span className="font-mono text-foreground">buy.stripe.com</span>.
                  Copy it, come back here, and paste below.
                </p>
                <UrlInput />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pb-1">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Save
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentLinkDialog;
