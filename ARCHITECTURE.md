# LinkForge — System Architecture & Flow

---

## 1. Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER SIDE                            │
│                                                             │
│  Browser → Next.js (Vercel) → Supabase DB                  │
│                    ↓                                        │
│             Stripe Checkout                                 │
│                    ↓                                        │
│          Stripe Webhook → /api/webhooks/stripe              │
│                    ↓                                        │
│            Order created in DB                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       ADMIN SIDE                            │
│                                                             │
│  You (Admin) → /admin panel → See new orders               │
│                    ↓                                        │
│        Place order on dataseo.co.id manually               │
│                    ↓                                        │
│        Update order status → "processing"                  │
│                    ↓                                        │
│        Receive report from dataseo                         │
│                    ↓                                        │
│        Paste backlink data → /admin/orders/[id]            │
│                    ↓                                        │
│        Status → "completed" → Email to user                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Full User Journey (Step by Step)

```
[1] User lands on homepage (/)
        ↓
[2] Reads value prop, clicks "Get Started" or "See Pricing"
        ↓
[3] Goes to /pricing — sees 4 tiers
        ↓
[4] Clicks "Start [Plan]" button
        ↓
[5] If not logged in → redirect to /login or /signup
    If logged in → continue to Stripe
        ↓
[6] Stripe Checkout page (hosted by Stripe)
    — user enters card, pays
        ↓
[7a] SUCCESS → redirect to /dashboard?order=success
[7b] CANCEL  → redirect to /pricing
        ↓
[8] Stripe fires webhook → POST /api/webhooks/stripe
    — verifies signature
    — creates order in DB (status: "pending")
    — sends confirmation email to user (via Resend)
    — sends alert email to admin
        ↓
[9] User sees dashboard: order status = "Pending"
        ↓
[10] Admin processes order (see Admin Flow below)
        ↓
[11] Status updates: pending → processing → completed
        ↓
[12] User gets email: "Your report is ready"
        ↓
[13] User views /dashboard/orders/[id]
     — sees full backlink list: URL, DR, anchor text, status
```

---

## 3. Admin Flow (Your Side)

```
[1] Receive email alert: "New order from user@email.com — Growth Plan"
        ↓
[2] Login to /admin
    — see order queue sorted by date
        ↓
[3] Click order → see: user info, plan, date, status
        ↓
[4] Click "Mark as Processing"
    — status updates to "processing"
    — user sees updated status on dashboard
        ↓
[5] Go to dataseo.co.id, place equivalent order
        ↓
[6] Receive backlink report from dataseo (CSV or list)
        ↓
[7] Go back to /admin/orders/[id]
    — paste or upload backlink data:
      [ { url, domain, dr, anchor_text, date_live } ]
        ↓
[8] Click "Mark as Completed"
    — report saved to DB
    — status → "completed"
    — email sent to user automatically
```

---

## 4. Database Schema (Supabase / PostgreSQL)

```sql
-- Managed by Supabase Auth (don't touch)
auth.users (id, email, created_at, ...)

-- Extended profile (created automatically on signup)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name   TEXT,
  company     TEXT,
  website     TEXT,
  role        TEXT DEFAULT 'customer',  -- 'customer' | 'admin'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Packages (seeded manually, not user-editable)
CREATE TABLE packages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,        -- 'Starter', 'Growth', etc.
  slug            TEXT UNIQUE NOT NULL, -- 'starter', 'growth', etc.
  price_usd       INTEGER NOT NULL,     -- in cents: 4900, 14900, etc.
  stripe_price_id TEXT NOT NULL,        -- from Stripe dashboard
  links_min       INTEGER,              -- min links delivered
  links_max       INTEGER,              -- max links delivered
  dr_min          INTEGER,              -- minimum DR of domains
  features        JSONB,               -- marketing bullet points
  is_active       BOOLEAN DEFAULT TRUE
);

-- Orders
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES profiles(id),
  package_id          UUID REFERENCES packages(id),
  status              TEXT DEFAULT 'pending',
  -- status: pending | processing | completed | cancelled
  stripe_session_id   TEXT UNIQUE,
  stripe_payment_id   TEXT,
  amount_paid_cents   INTEGER,
  target_url          TEXT,   -- user's website to build links to
  target_keywords     TEXT,   -- comma-separated keywords
  notes               TEXT,   -- user notes on ordering
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Reports (one per order)
CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID UNIQUE REFERENCES orders(id),
  summary     TEXT,        -- admin notes on delivery
  delivered_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Individual backlinks (many per report)
CREATE TABLE report_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id     UUID REFERENCES reports(id),
  page_url      TEXT NOT NULL,     -- the page with the backlink
  domain        TEXT NOT NULL,     -- root domain
  dr            INTEGER,           -- Domain Rating (Ahrefs)
  da            INTEGER,           -- Domain Authority (Moz)
  anchor_text   TEXT,
  target_url    TEXT,              -- where it points (client's URL)
  do_follow     BOOLEAN DEFAULT TRUE,
  date_live     DATE,
  screenshot_url TEXT,             -- optional proof screenshot
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**Row Level Security (RLS) Rules:**
```sql
-- Users can only see their own orders
-- Admin (role = 'admin') can see everything
-- Webhook service role bypasses RLS to write orders
```

---

## 5. Page & Route Map

```
PUBLIC (no auth required)
├── /                        → Landing page
├── /pricing                 → Pricing tiers + CTA
├── /login                   → Supabase email login
├── /signup                  → Register
└── /api/webhooks/stripe     → POST only, Stripe webhook

PROTECTED (auth required)
├── /dashboard               → Overview: active orders, quick stats
├── /dashboard/orders        → List of all orders + statuses
├── /dashboard/orders/[id]   → Order detail + backlink report table
└── /dashboard/account       → Profile settings

ADMIN (role = 'admin' required)
├── /admin                   → Order queue overview
├── /admin/orders            → All orders, filter by status
└── /admin/orders/[id]       → Update status + upload report data
```

---

## 6. API Routes (Next.js /api)

```
POST /api/webhooks/stripe
  ← Stripe calls this on payment success
  → Verifies signature
  → Creates order in DB
  → Sends emails

GET  /api/orders
  ← Auth: user
  → Returns user's orders

GET  /api/orders/[id]
  ← Auth: user (owns order) or admin
  → Returns order + report + report_items

PATCH /api/admin/orders/[id]
  ← Auth: admin only
  → Updates order status

POST /api/admin/orders/[id]/report
  ← Auth: admin only
  → Creates report + report_items
  → Marks order as completed
  → Sends email to user
```

---

## 7. Stripe Integration Flow

```
1. Create Products in Stripe Dashboard:
   — Starter ($49/mo)  → get price_id: price_xxx
   — Growth ($149/mo)  → get price_id: price_xxx
   — Authority ($349/mo) → get price_id: price_xxx
   — Enterprise ($599/mo) → get price_id: price_xxx

2. Save price_ids in packages table (or .env)

3. On "Buy" click:
   → Call Stripe API: stripe.checkout.sessions.create({
       mode: 'subscription',         ← monthly recurring
       line_items: [{ price: priceId, quantity: 1 }],
       success_url: '/dashboard?order=success',
       cancel_url: '/pricing',
       metadata: {
         user_id: user.id,
         package_id: package.id,
         target_url: formData.targetUrl,
         target_keywords: formData.keywords,
       }
     })
   → Redirect user to Stripe hosted page

4. Stripe fires webhook: checkout.session.completed
   → /api/webhooks/stripe reads metadata
   → Creates order in DB
   → Done
```

---

## 8. Email Notifications (Resend)

| Trigger | Recipient | Subject |
|---|---|---|
| Order created | User | "We received your order — LinkForge" |
| Order created | Admin (you) | "New order: [Plan] from [email]" |
| Status → processing | User | "Your links are being built" |
| Status → completed | User | "Your backlink report is ready" |

All emails are simple HTML, sent via Resend API from Next.js API routes.

---

## 9. Folder Structure (Next.js)

```
linkforge/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              ← landing
│   │   └── pricing/page.tsx      ← pricing
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            ← auth guard
│   │   ├── dashboard/page.tsx
│   │   ├── dashboard/orders/page.tsx
│   │   └── dashboard/orders/[id]/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx            ← admin role guard
│   │   ├── admin/page.tsx
│   │   └── admin/orders/[id]/page.tsx
│   └── api/
│       ├── webhooks/stripe/route.ts
│       ├── orders/route.ts
│       ├── orders/[id]/route.ts
│       └── admin/orders/[id]/
│           ├── route.ts          ← PATCH status
│           └── report/route.ts   ← POST report data
├── components/
│   ├── ui/                       ← shadcn/ui components
│   ├── landing/                  ← hero, features, pricing
│   ├── dashboard/                ← order card, status badge, report table
│   └── admin/                    ← order queue, report uploader
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← browser client
│   │   ├── server.ts             ← server client (RSC)
│   │   └── middleware.ts         ← session refresh
│   ├── stripe.ts                 ← stripe client + helpers
│   ├── resend.ts                 ← email helpers
│   └── utils.ts
├── middleware.ts                 ← route protection (auth check)
├── .env.local
└── package.json
```

---

## 10. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     ← for webhook (bypasses RLS)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=         ← from: stripe listen --forward-to

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://linkforge.io
ADMIN_EMAIL=you@yourdomain.com
```

---

## 11. Build Order (What to Build First)

```
Week 1
  Day 1  → Supabase project setup, schema, seed packages
  Day 2  → Next.js scaffold, Supabase auth working, middleware
  Day 3  → Landing page (static, just HTML/CSS, shadcn)
  Day 4  → Pricing page + Stripe Checkout integration
  Day 5  → Stripe webhook → order creation
  Day 6  → Dashboard: order list + status display
  Day 7  → Buffer / testing

Week 2
  Day 8  → Order detail page + report table component
  Day 9  → Admin: order queue + status updater
  Day 10 → Admin: report upload form (paste JSON or table input)
  Day 11 → Email notifications (Resend)
  Day 12 → Auth flow polish (redirects, error states)
  Day 13 → Full end-to-end test with real Stripe test card
  Day 14 → Deploy to Vercel, point domain, go live
```

---

*Everything above is buildable in 2 weeks by one developer.*  
*Manual admin operations are intentional — automate only when order volume justifies it.*
