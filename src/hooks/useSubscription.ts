import { useState } from "react";

// TODO: Re-enable when subscription system is built
// import { supabase } from "@/integrations/supabase/client";

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

export function useSubscription() {
  // TODO: Re-enable when subscription system is built
  const [state] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    loading: false,
  });

  const refresh = async () => {
    // TODO: Re-enable when subscription system is built
    // const { data, error } = await supabase.functions.invoke("check-subscription");
  };

  return { ...state, refresh };
}
