-- Seed products (run AFTER schema.sql)
-- All prices in USD cents, international naming

INSERT INTO packages (name, slug, category, description, price_usd, links_count, dr_range, badge, sort_order, features) VALUES

-- PBN Links
('Starter PBN Pack', 'pbn-starter', 'pbn',
 '30 high-authority PBN backlinks for new websites looking to build initial domain authority.',
 2900, '30 Links', 'DA 30+', null, 10,
 '["30 PBN Backlinks","DA 30+ Domains","Dofollow Links","Unique IP Addresses","100% Google Indexed","Report via Excel","Max 20x Posting"]'),

('Growth PBN Pack', 'pbn-growth', 'pbn',
 '80 PBN backlinks with higher authority domains. Ideal for sites needing a meaningful authority boost.',
 4900, '80 Links', 'DA 40+', 'popular', 11,
 '["80 PBN Backlinks","DA 40+ Domains","Dofollow Links","Unique IP Addresses","Max 80x Posting","Unlimited Keywords","100% Google Indexed","Report via Excel"]'),

('Authority PBN Pack', 'pbn-authority', 'pbn',
 '250 premium PBN backlinks. Full posting access to our exclusive network of aged domains.',
 8900, '250 Links', 'DA 50+', null, 12,
 '["250 PBN Domains","Full Posting Access","Unlimited Posts","Dofollow Links","Unique IP per Domain","Unlimited Keywords","100% Google Indexed","Lifetime Access"]'),

('PBN Sultan Pack', 'pbn-sultan', 'pbn',
 '250 PBN backlinks with maximum posting. Best for aggressive authority building campaigns.',
 6900, '250 Links', 'DA 45+', 'best_value', 13,
 '["250 PBN Backlinks","Max 250x Posting","Self-Posting Access","Unlimited Keywords","Dofollow Links","Unique IP Addresses","DA 45+ Domains","Permanent Access"]'),

-- Contextual Links
('Contextual Starter', 'contextual-starter', 'contextual',
 '200 contextual backlinks from diverse, niche-relevant websites. Perfect for establishing baseline authority.',
 1900, '200 Links', 'Mixed DA', null, 20,
 '["200 Contextual Backlinks","Niche Relevant Sites","Dofollow Mixed","Unique Domains","Fast Turnaround","Excel Report"]'),

('Contextual Growth', 'contextual-growth', 'contextual',
 '2,500 contextual backlinks from high-DA domains. Proven to move rankings within 30–60 days.',
 3900, '2,500 Links', 'DA 30+', 'popular', 21,
 '["2,500 Contextual Backlinks","DA 30+ Domains","Dofollow Links","Unique IP Addresses","Aged Domains","100% Indexed","Report via Excel"]'),

('Contextual Authority', 'contextual-authority', 'contextual',
 '10,000 contextual backlinks across high-traffic, niche-relevant publications.',
 6900, '10,000 Links', 'DA 40+', null, 22,
 '["10,000 Contextual Backlinks","DA 40+ Domains","Dofollow Links","IP Diversity","Niche Targeted","Full Report"]'),

('Contextual Premium 25k', 'contextual-premium', 'contextual',
 '25,000 contextual PBN backlinks. Maximum volume for aggressive SEO campaigns.',
 8900, '25,000 Links', 'DA 50+', 'best_value', 23,
 '["25,000 PBN Backlinks","DA 50+ Domains","Dofollow Links","IP Diversity","Free Delivery","Excel Report"]'),

-- EDU Backlinks
('EDU Starter Pack', 'edu-starter', 'edu',
 '30 high-authority .EDU backlinks from US universities and government domains.',
 3900, '30 Links', 'DA 60+', null, 30,
 '["30 EDU Backlinks","US University Domains","DA 60+ Average","Dofollow Links","100% Indexed","Excel Report","3–5 Day Delivery"]'),

('EDU Authority Pack', 'edu-authority', 'edu',
 '5,000 EDU and GOV backlinks. Extremely powerful for Domain Rating improvement.',
 12900, '5,000 Links', 'DA 70+', 'popular', 31,
 '["5,000 EDU/GOV Backlinks","DA 70+ Domains","Dofollow Mix","Unique Domains","US Gov & Edu Sites","Full Excel Report","7 Day Delivery"]'),

-- SEO Packages (Mixed)
('SEO Starter Package', 'seo-starter', 'seo-package',
 'A curated mix of Web 2.0, EDU, forum, and profile backlinks. Expert-designed for page 1 ranking.',
 10900, '3,000+ Links', 'DA/PA 50–90', null, 40,
 '["3,000 Web 2.0 Backlinks","2,000 EDU/GOV Backlinks","250 Forum Profile Links","40 GOV/AC Backlinks","Dofollow Mix","Unique IP Addresses","Aged Domains","DA/PA 50–90+","30-Day Delivery","Excel Report"]'),

('SEO Growth Package', 'seo-growth', 'seo-package',
 'Our most popular SEO bundle. 7,000+ links across 5 link types for sustained ranking growth.',
 21900, '7,000+ Links', 'DA/PA 50–90', 'popular', 41,
 '["7,000 Web 2.0 Backlinks","2,000 EDU/GOV Backlinks","2,500 Forum Profile Links","200 GOV/AC Backlinks","Dofollow Links","IP Diversity","Aged Domains","DA/PA 50–90+","30-Day Delivery","Excel Report"]'),

('SEO Authority Package', 'seo-authority', 'seo-package',
 'Maximum power SEO package. 14,000+ diverse backlinks for highly competitive niches.',
 24900, '14,000+ Links', 'DA/PA 50–90', 'best_value', 42,
 '["14,000 Web 2.0 Backlinks","10,000 Forum Profile Links","3,000 EDU/GOV Backlinks","800 GOV/AC Backlinks","Dofollow Links","IP Diversity","Aged Domains","DA/PA 50–90+","30-Day Delivery","Full Report"]'),

-- Domain Rating Boost
('DA/PA Boost', 'boost-da-pa', 'boost',
 'Increase your Domain Authority and Page Authority score within 30 days. Guaranteed improvement.',
 4900, 'Custom', 'Target DA 30+', null, 50,
 '["Increase DA & PA Score","30-Day Delivery","10+ Keyword Targeting","Aged Domain Strategy","Dofollow Mix","Spam Score Reduction","Progress Report"]'),

('DR Boost 40–50', 'boost-dr', 'boost',
 'Boost your Ahrefs Domain Rating to 40–50 range. Measured and reported with screenshots.',
 6900, 'Custom', 'Target DR 40–50', 'popular', 51,
 '["Increase Ahrefs DR to 40–50","30-Day Delivery","High-Authority Placements","Dofollow Strategy","Before/After Screenshots","Full Report"]'),

('Trust Flow Boost', 'boost-tf', 'boost',
 'Improve Majestic Trust Flow and Citation Flow metrics. Signals quality to Google.',
 7900, 'Custom', 'TF 50–60', null, 52,
 '["Boost Trust Flow 50–60","Improve Citation Flow","Quality Link Signals","30-Day Delivery","Majestic Report","Safe & Natural Profile"]');

-- Set yourself as admin after registering:
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-UUID';
