import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, Mail, MessageSquare, ShoppingCart, Loader2 } from "lucide-react";

const NotificationsSettings = () => {
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNewStudent: true,
    emailPurchase: true,
    emailCourseComplete: false,
    emailMarketing: false,
    pushNewStudent: true,
    pushPurchase: true,
    pushMessages: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Notification preferences saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="text-sm text-muted-foreground">Choose how you want to be notified about activity.</p>
      </div>
      <Separator />

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Email Notifications</CardTitle>
          </div>
          <CardDescription>Notifications sent to your email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "emailNewStudent" as const, label: "New student enrollment", desc: "When someone enrolls in your course" },
            { key: "emailPurchase" as const, label: "New purchase", desc: "When a student purchases your course" },
            { key: "emailCourseComplete" as const, label: "Course completion", desc: "When a student completes your course" },
            { key: "emailMarketing" as const, label: "Product updates", desc: "News, tips, and feature announcements" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label className="text-sm">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Push Notifications</CardTitle>
          </div>
          <CardDescription>In-app notifications and alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "pushNewStudent" as const, label: "New enrollments", desc: "Real-time enrollment alerts" },
            { key: "pushPurchase" as const, label: "Sales alerts", desc: "Instant purchase notifications" },
            { key: "pushMessages" as const, label: "Student messages", desc: "When students send you questions" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label className="text-sm">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
            </div>
          ))}
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

export default NotificationsSettings;
