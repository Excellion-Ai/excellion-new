import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillingSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Billing</h2>
        <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>
      <Separator />

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Current Plan</CardTitle>
              <CardDescription>Your active subscription details.</CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30">Free</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm">Courses created</span>
            </div>
            <span className="text-sm font-medium">0 / 1</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm">Monthly price</span>
            </div>
            <span className="text-sm font-medium">$0.00</span>
          </div>
          <Button onClick={() => navigate("/pricing")} className="w-full gap-2">
            Upgrade Plan <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
          <CardDescription>Add or update your payment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <div className="space-y-2">
              <CreditCard className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No payment method on file.</p>
              <p className="text-xs text-muted-foreground">A payment method will be added when you subscribe to a plan.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Billing History</CardTitle>
          <CardDescription>View past invoices and transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No billing history yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
