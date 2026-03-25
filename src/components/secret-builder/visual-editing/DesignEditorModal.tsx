import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Layout, Layers, GripVertical, Upload, ImageIcon, X } from "lucide-react";
import { DesignConfig, CourseLayoutStyle, LandingSectionType, HeroLayout } from "@/types/course-pages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DesignEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designConfig: DesignConfig;
  layoutTemplate: CourseLayoutStyle;
  sectionOrder: LandingSectionType[];
  courseId?: string;
  onSave: (config: {
    designConfig: DesignConfig;
    layoutTemplate: CourseLayoutStyle;
    sectionOrder: LandingSectionType[];
  }) => void;
}

const COLOR_FIELDS: Array<{ key: string; label: string }> = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "cardBackground", label: "Card BG" },
  { key: "text", label: "Text" },
  { key: "textMuted", label: "Muted Text" },
];

const FONT_OPTIONS = [
  "Inter", "Playfair Display", "Montserrat", "Lato", "Roboto",
  "Poppins", "Open Sans", "Raleway", "Merriweather", "Source Code Pro",
  "DM Sans", "Space Grotesk", "Instrument Serif", "Bricolage Grotesque",
];

const SPACING_OPTIONS = ["compact", "normal", "spacious"] as const;
const RADIUS_OPTIONS = ["none", "small", "medium", "large"] as const;
const HERO_STYLES = ["gradient", "centered", "split", "minimal", "video", "image"];

const HERO_LAYOUTS: Array<{ value: HeroLayout; label: string; description: string }> = [
  { value: "left", label: "Left-aligned", description: "Text on the left, classic layout" },
  { value: "centered", label: "Centered", description: "Text centered, image below" },
  { value: "split", label: "Split", description: "Text left, image right (50/50)" },
  { value: "image_background", label: "Image Background", description: "Full-bleed image with text overlay" },
];

const LAYOUT_TEMPLATES: Array<{ value: CourseLayoutStyle; label: string; description: string }> = [
  { value: "creator", label: "Creator", description: "Personal brand, warm tones" },
  { value: "technical", label: "Technical", description: "Developer-focused, compact" },
  { value: "academic", label: "Academic", description: "Formal, structured" },
  { value: "visual", label: "Visual", description: "Portfolio-style, vibrant" },
];

const ALL_SECTIONS: LandingSectionType[] = [
  "hero", "outcomes", "curriculum", "instructor", "testimonials",
  "faq", "pricing", "guarantee", "bonuses", "who_is_for",
  "course_includes", "community", "certificate",
];

const DesignEditorModal = ({
  open,
  onOpenChange,
  designConfig,
  layoutTemplate,
  sectionOrder,
  courseId,
  onSave,
}: DesignEditorModalProps) => {
  const [config, setConfig] = useState<DesignConfig>({ ...designConfig });
  const [template, setTemplate] = useState<CourseLayoutStyle>(layoutTemplate);
  const [sections, setSections] = useState<LandingSectionType[]>([...sectionOrder]);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const updateColor = (key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const updateFont = (field: "heading" | "body", value: string) => {
    setConfig((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [field]: value },
    }));
  };

  const updateBackground = (key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      backgrounds: { ...prev.backgrounds, [key]: value },
    }));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const newSections = [...sections];
    const target = index + direction;
    if (target < 0 || target >= newSections.length) return;
    [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
    setSections(newSections);
  };

  const toggleSection = (section: LandingSectionType) => {
    if (sections.includes(section)) {
      setSections(sections.filter((s) => s !== section));
    } else {
      setSections([...sections, section]);
    }
  };

  const handleHeroImageUpload = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Not authenticated"); return; }

    const ext = file.name.split(".").pop() ?? "png";
    const path = `${user.id}/${courseId ?? "draft"}/hero.${ext}`;

    setIsUploadingHero(true);
    const { error } = await supabase.storage
      .from("course-thumbnails")
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error("Failed to upload hero image");
      setIsUploadingHero(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("course-thumbnails")
      .getPublicUrl(path);

    setConfig((prev) => ({ ...prev, heroImage: urlData.publicUrl }));
    setIsUploadingHero(false);
    toast.success("Hero image uploaded");
  };

  const handleSave = () => {
    onSave({ designConfig: config, layoutTemplate: template, sectionOrder: sections });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Design Editor</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="colors" className="gap-1 text-xs">
              <Palette className="w-3.5 h-3.5" /> Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-1 text-xs">
              <Type className="w-3.5 h-3.5" /> Fonts
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-1 text-xs">
              <Layout className="w-3.5 h-3.5" /> Layout
            </TabsTrigger>
            <TabsTrigger value="sections" className="gap-1 text-xs">
              <Layers className="w-3.5 h-3.5" /> Sections
            </TabsTrigger>
          </TabsList>

          {/* Colors */}
          <TabsContent value="colors" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              {COLOR_FIELDS.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={(config.colors as any)?.[key] || "#000000"}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                    />
                    <Input
                      value={(config.colors as any)?.[key] || ""}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Spacing</Label>
                <Select
                  value={config.spacing || "normal"}
                  onValueChange={(v) =>
                    setConfig((p) => ({ ...p, spacing: v as any }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPACING_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Border Radius</Label>
                <Select
                  value={config.borderRadius || "medium"}
                  onValueChange={(v) =>
                    setConfig((p) => ({ ...p, borderRadius: v as any }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs capitalize">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hero section config */}
            <div className="space-y-3 pt-3 border-t border-border">
              <Label className="text-xs font-medium">Hero Section</Label>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Style</Label>
                  <Select
                    value={config.heroStyle || "gradient"}
                    onValueChange={(v) => setConfig((p) => ({ ...p, heroStyle: v }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HERO_STYLES.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Layout</Label>
                  <Select
                    value={config.heroLayout || "left"}
                    onValueChange={(v) => setConfig((p) => ({ ...p, heroLayout: v as HeroLayout }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HERO_LAYOUTS.map((h) => (
                        <SelectItem key={h.value} value={h.value} className="text-xs">
                          {h.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hero image upload */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Hero Image</Label>
                {config.heroImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={config.heroImage}
                      alt="Hero background"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => setConfig((p) => ({ ...p, heroImage: undefined }))}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/80 hover:bg-destructive/80 text-foreground hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-card/50">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroImageUpload(file);
                      }}
                    />
                    {isUploadingHero ? (
                      <span className="text-xs text-muted-foreground">Uploading...</span>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
                        <span className="text-xs text-muted-foreground">Click to upload</span>
                        <span className="text-[10px] text-muted-foreground/60 mt-0.5">or paste a URL below</span>
                      </>
                    )}
                  </label>
                )}
                <Input
                  value={config.heroImage || ""}
                  onChange={(e) => setConfig((p) => ({ ...p, heroImage: e.target.value || undefined }))}
                  placeholder="Or paste image URL..."
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="space-y-4 mt-4">
            {(["heading", "body"] as const).map((field) => (
              <div key={field} className="space-y-2">
                <Label className="capitalize">{field} Font</Label>
                <Select
                  value={config.fonts?.[field] || "Inter"}
                  onValueChange={(v) => updateFont(field, v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((f) => (
                      <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div
                  className="p-3 rounded-md border border-border text-sm"
                  style={{ fontFamily: config.fonts?.[field] || "Inter" }}
                >
                  {field === "heading"
                    ? "The Quick Brown Fox Jumps"
                    : "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Layout Template */}
          <TabsContent value="layout" className="space-y-3 mt-4">
            {LAYOUT_TEMPLATES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTemplate(t.value)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all",
                  template === t.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="font-medium text-sm">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.description}</div>
              </button>
            ))}
          </TabsContent>

          {/* Section Order */}
          <TabsContent value="sections" className="space-y-2 mt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Reorder or toggle sections for the landing page.
            </p>
            {sections.map((section, i) => (
              <div
                key={section}
                className="flex items-center gap-2 p-2 rounded border border-border bg-card"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 capitalize">
                  {section.replace(/_/g, " ")}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-xs"
                    onClick={() => moveSection(i, -1)}
                    disabled={i === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-xs"
                    onClick={() => moveSection(i, 1)}
                    disabled={i === sections.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-xs text-destructive"
                    onClick={() => toggleSection(section)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}

            {/* Add missing sections */}
            {ALL_SECTIONS.filter((s) => !sections.includes(s)).length > 0 && (
              <div className="pt-3 border-t border-border">
                <Label className="text-xs text-muted-foreground">
                  Available sections
                </Label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ALL_SECTIONS.filter((s) => !sections.includes(s)).map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 capitalize"
                      onClick={() => toggleSection(s)}
                    >
                      + {s.replace(/_/g, " ")}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Apply Design</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DesignEditorModal;
