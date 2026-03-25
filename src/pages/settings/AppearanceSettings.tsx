import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Moon, Sun, Monitor, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AppearanceSettings = () => {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accentColor, setAccentColor] = useState("gold");
  const [saving, setSaving] = useState(false);

  const themes = [
    { value: "dark" as const, label: "Dark", icon: Moon, desc: "Dark background with light text" },
    { value: "light" as const, label: "Light", icon: Sun, desc: "Light background with dark text" },
    { value: "system" as const, label: "System", icon: Monitor, desc: "Follow your system preference" },
  ];

  const accents = [
    { value: "gold", label: "Gold", color: "hsl(43 52% 54%)" },
    { value: "blue", label: "Blue", color: "hsl(217 91% 60%)" },
    { value: "emerald", label: "Emerald", color: "hsl(160 84% 39%)" },
    { value: "rose", label: "Rose", color: "hsl(350 89% 60%)" },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Appearance settings saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground">Customize the look and feel of your dashboard.</p>
      </div>
      <Separator />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>Select your preferred color mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors text-center",
                  theme === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-[10px] text-muted-foreground">{desc}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Accent Color</CardTitle>
          <CardDescription>Choose your dashboard accent color.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {accents.map((a) => (
              <button
                key={a.value}
                onClick={() => setAccentColor(a.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors",
                  accentColor === a.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-xs">{a.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
