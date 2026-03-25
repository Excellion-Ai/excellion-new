import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Building2, Link2, Loader2 } from "lucide-react";

const WorkspaceSettings = () => {
  const [saving, setSaving] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [brandUrl, setBrandUrl] = useState("");

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Workspace settings saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Workspace</h2>
        <p className="text-sm text-muted-foreground">Configure your workspace and brand settings.</p>
      </div>
      <Separator />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Workspace Details</CardTitle>
          <CardDescription>Your workspace name and branding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ws-name">Workspace Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="ws-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Workspace"
                className="pl-9 bg-background"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-url">Brand Website</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="brand-url"
                value={brandUrl}
                onChange={(e) => setBrandUrl(e.target.value)}
                placeholder="https://yourbrand.com"
                className="pl-9 bg-background"
              />
            </div>
            <p className="text-xs text-muted-foreground">Your brand website shown on course pages.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" disabled>
            Delete Workspace
          </Button>
          <p className="text-xs text-muted-foreground mt-2">This will permanently delete all courses and data. This action cannot be undone.</p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
