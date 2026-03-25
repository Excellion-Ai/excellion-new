import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Headphones, Mail, MessageSquare, BookOpen, ExternalLink, Loader2 } from "lucide-react";

const SupportSettings = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    toast.success("Support request submitted! We'll get back to you within 24 hours.");
    setSubject("");
    setCategory("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Expert Support</h2>
        <p className="text-sm text-muted-foreground">Get help from the Excellion team.</p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: BookOpen, title: "Documentation", desc: "Browse guides and tutorials", href: "/faq" },
          { icon: MessageSquare, title: "Community", desc: "Ask the community", href: "#" },
          { icon: Mail, title: "Email", desc: "support@excellioncourses.com", href: "mailto:support@excellioncourses.com" },
        ].map((item) => (
          <Card key={item.title} className="border-border bg-card hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-start gap-3">
              <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Submit a Request</CardTitle>
          </div>
          <CardDescription>Describe your issue and we'll respond within 24 hours.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">Billing & Payments</SelectItem>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="course">Course Builder</SelectItem>
                <SelectItem value="domain">Custom Domain</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-message">Message *</Label>
            <Textarea
              id="support-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={5}
              className="bg-background resize-none"
            />
          </div>
          <Button onClick={handleSubmit} disabled={sending} className="w-full">
            {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSettings;
