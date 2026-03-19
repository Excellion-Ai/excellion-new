import { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Download,
  Copy,
  Check,
  Rocket,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Types ───────────────────────────────────────────────────

type DeviceMode = "desktop" | "tablet" | "mobile";
type TabId = "preview" | "sections" | "styles" | "seo" | "export";

interface SectionItem {
  id: string;
  name: string;
  enabled: boolean;
}

interface BuilderPreviewPanelProps {
  generatedCode: string;
  isLoading: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: () => void;
  onBuildFromBrief?: () => void;
}

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "hero", name: "Hero", enabled: true },
  { id: "features", name: "Features", enabled: true },
  { id: "about", name: "About", enabled: true },
  { id: "testimonials", name: "Testimonials", enabled: true },
  { id: "pricing", name: "Pricing", enabled: true },
  { id: "faq", name: "FAQ", enabled: true },
  { id: "cta", name: "CTA", enabled: true },
  { id: "footer", name: "Footer", enabled: true },
];

// ── Component ───────────────────────────────────────────────

const BuilderPreviewPanel = ({
  generatedCode,
  isLoading,
  error,
  onRefresh,
  onExport,
  onBuildFromBrief,
}: BuilderPreviewPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("preview");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [copied, setCopied] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [sections, setSections] = useState<SectionItem[]>(DEFAULT_SECTIONS);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: "text/tsx" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page.tsx";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const toggleSection = (id: string) =>
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );

  const devices: { mode: DeviceMode; icon: typeof Monitor }[] = [
    { mode: "desktop", icon: Monitor },
    { mode: "tablet", icon: Tablet },
    { mode: "mobile", icon: Smartphone },
  ];

  if (!generatedCode && !isLoading && !error) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div className="space-y-4 max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Monitor className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No Preview Yet</h3>
          <p className="text-sm text-muted-foreground">
            Set up your project brief and generate your first build to see it here.
          </p>
          {onBuildFromBrief && (
            <Button onClick={onBuildFromBrief}>Build from Brief</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabId)}
        className="flex flex-col h-full"
      >
        <div className="border-b border-border px-3 flex items-center justify-between">
          <TabsList className="h-10 bg-transparent p-0 gap-0">
            {(
              ["preview", "sections", "styles", "seo", "export"] as TabId[]
            ).map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-3"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {activeTab === "preview" && (
            <div className="flex items-center gap-1">
              {devices.map((d) => (
                <Button
                  key={d.mode}
                  size="icon"
                  variant={deviceMode === d.mode ? "default" : "ghost"}
                  className="h-7 w-7"
                  onClick={() => setDeviceMode(d.mode)}
                >
                  <d.icon className="h-3.5 w-3.5" />
                </Button>
              ))}
              {onRefresh && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={onRefresh}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Preview */}
        <TabsContent value="preview" className="flex-1 m-0 p-3 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <Card className="border-destructive/50 max-w-sm">
                <CardContent className="pt-6 text-center text-sm text-destructive">
                  {error}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div
              className="mx-auto border border-border rounded-lg overflow-hidden bg-background transition-all"
              style={{ maxWidth: DEVICE_WIDTHS[deviceMode] }}
            >
              <iframe
                srcDoc={generatedCode}
                sandbox="allow-scripts"
                className="w-full border-none"
                style={{ minHeight: 400 }}
                title="Preview"
              />
            </div>
          )}
        </TabsContent>

        {/* Sections */}
        <TabsContent value="sections" className="flex-1 m-0 p-3 overflow-auto">
          <div className="space-y-2">
            {sections.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
                <span className="text-sm flex-1">{s.name}</span>
                <Switch
                  checked={s.enabled}
                  onCheckedChange={() => toggleSection(s.id)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Styles */}
        <TabsContent value="styles" className="flex-1 m-0 p-3 overflow-auto space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Colors</h4>
            <div className="grid grid-cols-3 gap-2">
              {["Primary", "Secondary", "Accent", "Background", "Text", "Muted"].map(
                (c) => (
                  <div key={c} className="space-y-1">
                    <div className="h-8 rounded bg-muted border border-border" />
                    <p className="text-xs text-muted-foreground text-center">
                      {c}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Typography</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Heading</p>
                <p className="text-lg font-bold">Inter Bold</p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Body</p>
                <p className="text-sm">Inter Regular</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="flex-1 m-0 p-3 overflow-auto space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Page Title
            </label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="My Awesome Website"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {seoTitle.length}/60 characters
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Meta Description
            </label>
            <Textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="A brief description of your page…"
              className="text-sm resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {seoDescription.length}/160 characters
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Keywords
            </label>
            <Input
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="web design, landing page, business"
              className="text-sm"
            />
          </div>
        </TabsContent>

        {/* Export */}
        <TabsContent value="export" className="flex-1 m-0 p-3 overflow-auto space-y-3">
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download .tsx
          </Button>
          <Button
            className="w-full justify-start gap-2"
            onClick={onExport}
          >
            <Rocket className="h-4 w-4" />
            Publish Site
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuilderPreviewPanel;
