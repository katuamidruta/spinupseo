-- Seed packages (run AFTER schema.sql)

INSERT INTO packages (name, slug, price_usd, links_min, links_max, dr_min, features) VALUES
(
  'Starter', 'starter', 4900, 5, 8, 30,
  '["5–8 editorial placements","DR 30+ domains only","Niche-relevant sites","Monthly report","Email support"]'
),
(
  'Growth', 'growth', 14900, 15, 20, 40,
  '["15–20 editorial placements","DR 40+ domains only","Traffic-vetted sites (10k+/mo)","Anchor text strategy","Monthly report + metrics","Priority support"]'
),
(
  'Authority', 'authority', 34900, 35, 50, 50,
  '["35–50 editorial placements","DR 50+ domains only","High-traffic publications","Full anchor strategy","Competitor gap analysis","Detailed monthly report","Dedicated support"]'
),
(
  'Enterprise', 'enterprise', 59900, 60, 100, 60,
  '["60–100 editorial placements","DR 60+ premium domains","Custom link strategy","Quarterly SEO audit","Weekly status updates","Dedicated account manager"]'
);

-- Make yourself admin (replace UUID with your user ID from auth.users table)
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-UUID-HERE';
