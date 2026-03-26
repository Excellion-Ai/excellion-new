

## Wire Up Waitlist-Aware Stripe Checkout — Implementation Plan

### Overview
Create the full checkout flow: edge function that checks waitlist status and creates the right Stripe session, update frontend CTAs, build real checkout success page, and wire up billing page with live subscription data.

### Step 1: Create `create-checkout` Edge Function
**File:** `supabase/functions/create-checkout/index.ts`

- Authenticate user via JWT (`getUser`)
- Accept `plan` param (`monthly` or `annual`)
- Use service-role client to query `waitlist` table for user's email
- Select price + coupon:
  - Waitlist monthly: `price_1TF4uLPCTHzXvqDgXzsHLUoV` ($49/mo) + coupon `VsiCmzhh` ($30 off) = $19 first month
  - Public monthly: `price_1T1YnuPCTHzXvqDgZwElpsRS` ($79/mo) + coupon `YqRziFUU` ($50 off) = $29 first month
  - Annual: `price_1T1YjxPCTHzXvqDg3Plq3gtT` ($790/yr) — no coupon
- Create Stripe checkout session with `client_reference_id` = user ID, `mode: "subscription"`
- Return `{ url }`

### Step 2: Create `check-subscription` Edge Function
**File:** `supabase/functions/check-subscription/index.ts`

- Authenticate user, look up Stripe customer by email
- Check for active subscriptions
- Return `{ subscribed, product_id, subscription_end }`
- Following the pattern from the Stripe implementation guide

### Step 3: Update `useSubscription` Hook
**File:** `src/hooks/useSubscription.ts`

- Replace local `subscriptions` table query with call to `check-subscription` edge function
- Auto-refresh on auth changes and every 60 seconds
- Keep `openPortal` method (update to use `customer-portal` pattern if needed)

### Step 4: Update `PricingSection.tsx`
- Replace `<Link to="/auth">` with a button that:
  - If not logged in → redirect to `/auth?redirect=/pricing`
  - If logged in → call `create-checkout` and redirect to Stripe
- Pass `plan: "annual"` when yearly toggle is active
- Show loading spinner during checkout creation

### Step 5: Update `Navigation.tsx`
- "Start Building" for non-founder, logged-in users → call `create-checkout` (monthly)
- Keep existing waitlist modal for non-logged-in users

### Step 6: Update `CheckoutSuccess.tsx`
- Replace placeholder with real success page
- Call `useSubscription().refresh()` to sync state
- Show confirmation, auto-redirect to `/secret-builder-hub` after 3s

### Step 7: Update `Billing.tsx`
- Wire up `useSubscription()` hook for real data
- Show actual plan status, price, renewal date
- Wire "Manage Subscription" to `openPortal()`
- "Upgrade" button triggers `create-checkout`

### Step 8: Add to `supabase/config.toml`
- Add `[functions.create-checkout]` and `[functions.check-subscription]` with `verify_jwt = false`

### Files Summary
| Action | File |
|--------|------|
| Create | `supabase/functions/create-checkout/index.ts` |
| Create | `supabase/functions/check-subscription/index.ts` |
| Modify | `src/hooks/useSubscription.ts` |
| Modify | `src/components/PricingSection.tsx` |
| Modify | `src/components/Navigation.tsx` |
| Modify | `src/pages/CheckoutSuccess.tsx` |
| Modify | `src/pages/Billing.tsx` |
| Modify | `supabase/config.toml` |

### Testing
- Add your email to the `waitlist` table in Supabase dashboard
- Test waitlist flow: should see $19 first month
- Remove from waitlist, test public flow: should see $29 first month
- Use Stripe test card `4242 4242 4242 4242`
- Verify billing page shows real subscription data after checkout

