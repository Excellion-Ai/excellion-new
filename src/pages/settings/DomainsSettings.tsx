import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Globe, Plus, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

const DomainsSettings = () => {
  const [customDomain, setCustomDomain] = useState("");

  const handleAddDomain = () => {
    if (!customDomain.trim()) return;
    toast.info("Custom domains require a Pro plan. Upgrade to connect your domain.");
    setCustomDomain("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Domains</h2>
        <p className="text-sm text-muted-foreground">Manage custom domains for your course sites.</p>
      </div>
      <Separator />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Default Domain</CardTitle>
          <CardDescription>Your courses are available at this address.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/50">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono">yourname.excellioncourses.com</span>
            <Badge variant="outline" className="ml-auto text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Custom Domain</CardTitle>
          <CardDescription>Connect your own domain to your course site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-domain">Domain Name</Label>
            <div className="flex gap-2">
              <Input
                id="custom-domain"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="courses.yourdomain.com"
                className="bg-background"
              />
              <Button onClick={handleAddDomain} size="sm" className="gap-1 shrink-0">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">How to connect a custom domain:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Add your domain above</li>
                  <li>Create a CNAME record pointing to <span className="font-mono text-primary">cname.excellioncourses.com</span></li>
                  <li>Wait for DNS propagation (up to 48 hours)</li>
                  <li>SSL certificate will be auto-provisioned</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No custom domains connected yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainsSettings;
