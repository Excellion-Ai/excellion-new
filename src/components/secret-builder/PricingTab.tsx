import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PricingTabProps {
  courseId: string | undefined;
  priceCents: number | null;
  currency: string | null;
  onUpdate: (updates: { price_cents: number | null }) => void;
}

const PricingTab = ({ courseId, priceCents, currency, onUpdate }: PricingTabProps) => {
  const [isFree, setIsFree] = useState(!priceCents || priceCents === 0);
  const [price, setPrice] = useState((priceCents ?? 0) / 100);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cents = priceCents ?? 0;
    setIsFree(cents === 0);
    setPrice(cents / 100);
  }, [priceCents]);

  const effectivePrice = isFree ? 0 : price;
  const stripeFee = effectivePrice > 0 ? effectivePrice * 0.029 + 0.3 : 0;
  const excellionFee = effectivePrice * 0.02;
  const youReceive = Math.max(effectivePrice - stripeFee - excellionFee, 0);
  const creatorPercent = effectivePrice > 0 ? Math.round((youReceive / effectivePrice) * 100) : 0;

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  const handleSave = async () => {
    if (!courseId) return;
    setIsSaving(true);
    const newCents = isFree ? 0 : Math.round(price * 100);

    const { error } = await supabase
      .from("courses")
      .update({ price_cents: newCents, is_free: isFree, updated_at: new Date().toISOString() } as any)
      .eq("id", courseId);

    setIsSaving(false);
    if (error) {
      toast.error("Failed to save pricing");
    } else {
      toast.success("Pricing updated");
      onUpdate({ price_cents: newCents });
    }
  };

  return (
    <div className="space-y-6">
      {/* Free toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="free-toggle" className="text-foreground">Offer for free</Label>
        <Switch
          id="free-toggle"
          checked={isFree}
          onCheckedChange={(checked) => {
            setIsFree(checked);
            if (checked) setPrice(0);
          }}
        />
      </div>

      {/* Price input */}
      <div className="space-y-2">
        <Label className="text-foreground">Price (USD)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            min={0}
            step={0.01}
            value={isFree ? 0 : price}
            onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
            disabled={isFree}
            className="pl-9"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Breakdown */}
      {effectivePrice > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground">Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Student pays</span>
              <span className="text-foreground">{fmt(effectivePrice)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Stripe fee (~2.9% + $0.30)</span>
              <span>-{fmt(stripeFee)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Excellion fee (2%)</span>
              <span>-{fmt(excellionFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium text-foreground">
              <span>You receive</span>
              <span className="flex items-center gap-2">
                {fmt(youReceive)}
                <Badge variant="secondary" className="text-xs text-emerald-400">
                  {creatorPercent}%
                </Badge>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save */}
      <Button onClick={handleSave} disabled={isSaving || !courseId} className="w-full">
        <Save className="h-4 w-4 mr-1" />
        {isSaving ? "Saving…" : "Save Pricing"}
      </Button>
    </div>
  );
};

export default PricingTab;
