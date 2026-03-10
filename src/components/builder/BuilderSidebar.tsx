import { useState } from "react";
import {
  Plus,
  LayoutTemplate,
  Paintbrush,
  Pencil,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { BuilderState } from "./BuilderChat";

// ── Types ───────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  name: string;
  updatedAt: string;
}

interface BuilderSidebarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  state: BuilderState;
  onNewProject: () => void;
  history: HistoryItem[];
  onSelectHistory: (id: string) => void;
}

const TEMPLATES = [
  { id: "restaurant", name: "Restaurant", desc: "Menu, reservations & location" },
  { id: "portfolio", name: "Portfolio", desc: "Showcase projects & skills" },
  { id: "agency", name: "Agency", desc: "Services, team & case studies" },
  { id: "saas", name: "SaaS", desc: "Features, pricing & signup" },
  { id: "ecommerce", name: "E-commerce", desc: "Products, cart & checkout" },
  { id: "coach", name: "Coach", desc: "Programs, testimonials & booking" },
];

const COLOR_PRESETS = [
  { name: "Ocean", colors: ["210 100% 50%", "200 90% 40%", "190 80% 60%"] },
  { name: "Forest", colors: ["140 60% 40%", "120 50% 30%", "80 40% 50%"] },
  { name: "Sunset", colors: ["20 90% 55%", "10 80% 50%", "40 95% 55%"] },
  { name: "Royal", colors: ["260 70% 50%", "280 60% 40%", "240 80% 60%"] },
  { name: "Midnight", colors: ["220 30% 15%", "210 40% 25%", "200 50% 45%"] },
  { name: "Rose", colors: ["340 80% 55%", "350 70% 45%", "330 60% 65%"] },
];

const FONT_PRESETS = [
  { name: "Modern", heading: "Inter", body: "Inter" },
  { name: "Editorial", heading: "Playfair Display", body: "Source Sans 3" },
  { name: "Technical", heading: "JetBrains Mono", body: "Inter" },
  { name: "Elegant", heading: "Cormorant", body: "Lato" },
];

const STATE_CONFIG: Record<BuilderState, { icon: typeof Clock; label: string; className: string }> = {
  idle: { icon: Clock, label: "Idle", className: "bg-muted text-muted-foreground" },
  loading: { icon: Loader2, label: "Building…", className: "bg-primary/10 text-primary" },
  success: { icon: CheckCircle2, label: "Ready", className: "bg-green-500/10 text-green-500" },
  error: { icon: AlertCircle, label: "Error", className: "bg-destructive/10 text-destructive" },
};

// ── Component ───────────────────────────────────────────────

const BuilderSidebar = ({
  projectName,
  onProjectNameChange,
  state,
  onNewProject,
  history,
  onSelectHistory,
}: BuilderSidebarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(projectName);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(false);

  const stateInfo = STATE_CONFIG[state];
  const StateIcon = stateInfo.icon;

  const startEdit = () => {
    setEditName(projectName);
    setIsEditing(true);
  };

  const confirmEdit = () => {
    if (editName.trim()) onProjectNameChange(editName.trim());
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  return (
    <div className="flex flex-col h-full w-64 border-r border-border bg-card">
      {/* Project Name + Status */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-7 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
              />
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={confirmEdit}>
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={cancelEdit}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <>
              <span className="text-sm font-semibold truncate flex-1">
                {projectName}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 shrink-0"
                onClick={startEdit}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
        <Badge className={cn("text-xs gap-1", stateInfo.className)}>
          <StateIcon
            className={cn("h-3 w-3", state === "loading" && "animate-spin")}
          />
          {stateInfo.label}
        </Badge>
      </div>

      {/* Actions */}
      <div className="p-3 space-y-1.5">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 h-8 text-xs"
          onClick={onNewProject}
        >
          <Plus className="h-3.5 w-3.5" />
          New Project
        </Button>

        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-8 text-xs"
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              Templates
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Choose a Template</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {TEMPLATES.map((t) => (
                <Card
                  key={t.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setShowTemplates(false)}
                >
                  <CardContent className="p-3">
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showBrandKit} onOpenChange={setShowBrandKit}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-8 text-xs"
            >
              <Paintbrush className="h-3.5 w-3.5" />
              Brand Kit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Brand Kit</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              <div>
                <h4 className="text-sm font-medium mb-3">Color Presets</h4>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      className="p-2 rounded-lg border border-border hover:border-primary/50 transition-colors text-center"
                      onClick={() => setShowBrandKit(false)}
                    >
                      <div className="flex gap-1 justify-center mb-1.5">
                        {p.colors.map((c, i) => (
                          <div
                            key={i}
                            className="h-5 w-5 rounded-full"
                            style={{ backgroundColor: `hsl(${c})` }}
                          />
                        ))}
                      </div>
                      <p className="text-xs">{p.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Font Styles</h4>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_PRESETS.map((f) => (
                    <button
                      key={f.name}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                      onClick={() => setShowBrandKit(false)}
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {f.name}
                      </p>
                      <p className="text-sm font-semibold">{f.heading}</p>
                      <p className="text-xs text-muted-foreground">{f.body}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recent Projects */}
      <div className="flex-1 flex flex-col min-h-0">
        <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Recent Projects
        </p>
        <ScrollArea className="flex-1">
          <div className="px-3 pb-3 space-y-1">
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground px-1 py-3">
                No projects yet
              </p>
            ) : (
              history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => onSelectHistory(h.id)}
                  className="w-full text-left px-2.5 py-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm truncate">{h.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BuilderSidebar;
