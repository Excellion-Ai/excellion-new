# Custom Domains — Implementation Roadmap

## Current State (Data Layer Ready)

### Database
- `courses.custom_domain` — stores the creator's domain (e.g. `courses.coachsarah.com`)
- `courses.domain_verified` — boolean, set to true when DNS is confirmed
- `courses.domain_verification_token` — token for TXT record verification (format: `excellion-{courseId[:8]}`)

### UI
- Creators can add/remove custom domains in Publish Settings → Domain tab
- DNS instructions shown: CNAME → `excellioncourses.com`, TXT → verification token
- Verify button calls `verify-domain-dns` edge function (checks DNS via Cloudflare DoH)
- Verification status badge (Pending / Verified)

### URL Priority
When generating the published course URL:
1. If `custom_domain` is set AND `domain_verified` is true → `https://{custom_domain}`
2. Otherwise → `https://excellioncourses.com/c/{slug}`

### Edge Function
`verify-domain-dns` — deployed and active:
- Authenticates the user
- Verifies they own the course
- Checks CNAME record points to `excellioncourses.com` (or A record to server IP)
- Checks TXT record `_verify.{domain}` contains the verification token
- Sets `domain_verified = true` on success

---

## What's Needed for Full Implementation (Post-Launch)

### 1. Reverse Proxy / CDN Setup

**Option A: Cloudflare (Recommended)**
- Add excellioncourses.com to Cloudflare
- Use Cloudflare for SaaS (Custom Hostnames API) to handle customer domains
- Cloudflare automatically provisions SSL for each custom hostname
- Route: custom domain → Cloudflare → your origin server
- Cost: ~$2/month for the SaaS add-on

**Option B: Caddy Server**
- Self-hosted reverse proxy with automatic HTTPS (Let's Encrypt)
- Configure Caddy to look up custom domains from the database
- Route: custom domain → Caddy → your app
- Requires a VPS/server (e.g. Railway, Fly.io, DigitalOcean)

**Option C: Vercel / Netlify**
- Both support custom domains via their API
- You'd need to move hosting off Lovable to one of these platforms
- They handle SSL automatically

### 2. DNS Verification Flow (Enhanced)
Current: Basic CNAME + TXT check via Cloudflare DoH
Needed:
- Periodic re-verification (cron job every 24h to check domains still point correctly)
- Handle edge cases: domain transferred, DNS changed, certificate expiry
- Email notifications when domain verification fails

### 3. SSL Certificate Provisioning
- **Cloudflare for SaaS**: Automatic — no action needed
- **Caddy**: Automatic via Let's Encrypt ACME
- **Manual**: Use certbot with DNS-01 challenge (not recommended)

### 4. Request Routing
When a request comes in on a custom domain:
1. Look up `custom_domain` in the courses table
2. If found and verified → serve the course page
3. If not found → 404 or redirect to excellioncourses.com
4. The app needs a catch-all route or middleware to handle this

### 5. Database Queries for Routing
```sql
-- Look up course by custom domain (for the reverse proxy / middleware)
SELECT id, slug, user_id FROM courses
WHERE custom_domain = $1 AND domain_verified = true AND deleted_at IS NULL;
```

### 6. Migration Path
1. **Phase 1 (Now)**: Data layer ready, UI in place, DNS verification works
2. **Phase 2**: Set up Cloudflare for SaaS or Caddy reverse proxy
3. **Phase 3**: Add periodic domain health checks
4. **Phase 4**: Add wildcard subdomains (e.g. `*.excellioncourses.com` for creator subdomains)

---

## Creator Subdomain System (Future)

Instead of (or in addition to) custom domains, offer creator subdomains:
- `coachsarah.excellioncourses.com` → shows all of Sarah's courses
- Requires wildcard DNS (`*.excellioncourses.com`) and wildcard SSL
- The `profiles` table already has fields for this

### Implementation
1. Add `subdomain` field to `profiles` table (e.g. `coachsarah`)
2. Wildcard DNS: `*.excellioncourses.com` → your server
3. Route: extract subdomain from Host header → look up creator → show their courses
4. Much simpler than full custom domains — no per-domain SSL needed
