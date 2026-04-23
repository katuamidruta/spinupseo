-- Run this in Supabase SQL Editor

-- Profiles (auto-created on signup via trigger)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  company     TEXT,
  website     TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Packages (seeded separately)
CREATE TABLE packages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  price_usd   INTEGER NOT NULL,
  links_min   INTEGER,
  links_max   INTEGER,
  dr_min      INTEGER,
  features    JSONB,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  package_id         UUID REFERENCES packages(id),
  status             TEXT DEFAULT 'pending' CHECK (status IN (
                       'pending_verification', 'pending', 'processing', 'completed', 'cancelled'
                     )),
  payment_method     TEXT CHECK (payment_method IN ('paypal', 'usdt')),
  payment_reference  TEXT,          -- PayPal capture ID or USDT tx hash
  payment_network    TEXT,          -- 'TRC20' | 'ERC20' (USDT only)
  amount_paid_cents  INTEGER,
  target_url         TEXT,
  target_keywords    TEXT,
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  summary      TEXT,
  delivered_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Individual backlinks
CREATE TABLE report_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id      UUID REFERENCES reports(id) ON DELETE CASCADE,
  domain         TEXT NOT NULL,
  page_url       TEXT NOT NULL,
  dr             INTEGER,
  anchor_text    TEXT,
  target_url     TEXT,
  do_follow      BOOLEAN DEFAULT TRUE,
  date_live      DATE,
  screenshot_url TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages     ENABLE ROW LEVEL SECURITY;

-- Packages: public read
CREATE POLICY "packages_public_read" ON packages FOR SELECT USING (true);

-- Profiles: own only
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- Orders: own + admin
CREATE POLICY "orders_own_read" ON orders FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "orders_own_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_admin_update" ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Reports: own + admin read; admin write
CREATE POLICY "reports_read" ON reports FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = reports.order_id
    AND (orders.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

CREATE POLICY "reports_admin_write" ON reports FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Report items
CREATE POLICY "report_items_read" ON report_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM reports
    JOIN orders ON orders.id = reports.order_id
    WHERE reports.id = report_items.report_id
    AND (orders.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

CREATE POLICY "report_items_admin_write" ON report_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
