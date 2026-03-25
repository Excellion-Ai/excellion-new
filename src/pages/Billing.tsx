import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Zap, ArrowRight, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

const Billing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/secret-builder-hub")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Billing</h1>
            <p className="text-sm text-muted-foreground">Manage your subscription and payments.</p>
          </div>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Current Plan</CardTitle>
                <Badge variant="outline" className="text-primary border-primary/30">Free</Badge>
              </div>
              <CardDescription>You're currently on the free tier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Courses", value: "1 course included" },
                { label: "Students", value: "Unlimited" },
                { label: "AI generations", value: "5 per month" },
                { label: "Custom domain", value: "Not available" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
              <Button onClick={() => navigate("/pricing")} className="w-full gap-2 mt-2">
                <Zap className="h-4 w-4" /> Upgrade to Pro <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 space-y-2">
                <CreditCard className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">No payment method on file.</p>
                <p className="text-xs text-muted-foreground">A payment method will be added when you upgrade.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No invoices yet.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Billing;
