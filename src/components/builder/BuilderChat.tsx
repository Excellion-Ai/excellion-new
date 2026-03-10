import { useState } from "react";
import {
  Send,
  ChevronDown,
  Zap,
  Globe,
  Palette,
  Type,
  Target,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type BuilderState = "idle" | "loading" | "success" | "error";

export interface SmartDefaults {
  businessType: string;
  goal: "leads" | "bookings" | "ecommerce" | "info";
  style: "modern" | "luxury" | "playful" | "minimal" | "bold";
  ctaText: string;
  referenceUrl: string;
}

interface BuilderChatProps {
  messages: Message[];
  state: BuilderState;
  isLoading: boolean;
  inputs: SmartDefaults;
  onInputsChange: (inputs: SmartDefaults) => void;
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
}

const BUSINESS_TYPES = [
  "Restaurant",
  "Portfolio",
  "Agency",
  "SaaS",
  "E-commerce",
  "Coach / Consultant",
  "Real Estate",
  "Healthcare",
  "Fitness",
  "Education",
  "Other",
];

const GOALS: { value: SmartDefaults["goal"]; label: string; icon: typeof Target }[] = [
  { value: "leads", label: "Generate Leads", icon: Target },
  { value: "bookings", label: "Get Bookings", icon: Globe },
  { value: "ecommerce", label: "Sell Products", icon: Zap },
  { value: "info", label: "Share Info", icon: Type },
];

const STYLES: { value: SmartDefaults["style"]; label: string }[] = [
  { value: "modern", label: "Modern" },
  { value: "luxury", label: "Luxury" },
  { value: "playful", label: "Playful" },
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
];

const QUICK_ACTIONS = [
  "Add testimonials section",
  "Add pricing table",
  "Change hero layout",
  "Add contact form",
  "Improve mobile layout",
  "Add FAQ section",
];

// ── Component ───────────────────────────────────────────────

const BuilderChat = ({
  messages,
  state,
  isLoading,
  inputs,
  onInputsChange,
  onSendMessage,
  onQuickAction,
}: BuilderChatProps) => {
  const [draft, setDraft] = useState("");
  const hasBuilt = messages.some((m) => m.role === "assistant");

  const updateField = <K extends keyof SmartDefaults>(
    key: K,
    value: SmartDefaults[K]
  ) => onInputsChange({ ...inputs, [key]: value });

  const handleSend = () => {
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft("");
  };

  const formatContent = (content: string) =>
    content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**"))
        return (
          <p key={i} className="font-semibold mt-2">
            {line.slice(2, -2)}
          </p>
        );
      if (line.startsWith("- "))
        return (
          <li key={i} className="ml-4 list-disc text-muted-foreground text-sm">
            {line.slice(2)}
          </li>
        );
      return (
        <p key={i} className="text-sm text-muted-foreground">
          {line}
        </p>
      );
    });

  return (
    <div className="flex flex-col h-full">
      {/* Build Brief */}
      {inputs.businessType && (
        <Card className="m-3 mb-0 border-primary/20">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-primary" />
              Build Brief
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {inputs.businessType}
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">
                {inputs.goal}
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">
                {inputs.style}
              </Badge>
              {inputs.ctaText && (
                <Badge variant="outline" className="text-xs">
                  CTA: {inputs.ctaText}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Accordion (pre-build) */}
      {!hasBuilt && (
        <div className="p-3">
          <Accordion type="single" collapsible defaultValue="setup">
            <AccordionItem value="setup" className="border-none">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                Project Setup
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                {/* Business Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Business Type
                  </label>
                  <Select
                    value={inputs.businessType}
                    onValueChange={(v) => updateField("businessType", v)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select type…" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Goal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Primary Goal
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {GOALS.map((g) => (
                      <Button
                        key={g.value}
                        size="sm"
                        variant={inputs.goal === g.value ? "default" : "outline"}
                        className="h-8 text-xs justify-start gap-1.5"
                        onClick={() => updateField("goal", g.value)}
                      >
                        <g.icon className="h-3 w-3" />
                        {g.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Design Style
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLES.map((s) => (
                      <Button
                        key={s.value}
                        size="sm"
                        variant={inputs.style === s.value ? "default" : "outline"}
                        className="h-7 text-xs px-3"
                        onClick={() => updateField("style", s.value)}
                      >
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    CTA Text
                  </label>
                  <Input
                    value={inputs.ctaText}
                    onChange={(e) => updateField("ctaText", e.target.value)}
                    placeholder="e.g. Book a Call"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Reference URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Link2 className="h-3 w-3" /> Reference URL
                  </label>
                  <Input
                    value={inputs.referenceUrl}
                    onChange={(e) => updateField("referenceUrl", e.target.value)}
                    placeholder="https://example.com"
                    className="h-8 text-sm"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-lg px-3 py-2",
              m.role === "user"
                ? "bg-primary/10 ml-6"
                : "bg-muted mr-6"
            )}
          >
            {formatContent(m.content)}
          </div>
        ))}

        {isLoading && (
          <div className="bg-muted rounded-lg px-3 py-2 mr-6">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.15s]" />
              <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {hasBuilt && onQuickAction && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((a) => (
            <Button
              key={a}
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onQuickAction(a)}
            >
              {a}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Describe what you want to build…"
            className="min-h-[40px] max-h-32 text-sm resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!draft.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderChat;
