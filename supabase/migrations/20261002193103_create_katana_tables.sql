/*
# Create KPHB Katana Database Schema

## Overview
Creates the database tables for the KPHB Katana cinematic parody website.
This is a single-tenant app with no sign-in, so all data is publicly readable
and writable via the anon key. All tables use `TO anon, authenticated` policies.

## New Tables

1. `dialogues` — Mass dialogue quotes displayed in the Dialogues section.
   - id (uuid, PK)
   - text (text, not null) — the dialogue line
   - sort_order (int, default 0) — display ordering
   - created_at (timestamptz)

2. `darbar_members` — Fictional friend cards for the Darbar section.
   - id (uuid, PK)
   - nickname (text, not null)
   - title (text, not null) — e.g. "The Right Hand"
   - description (text, not null)
   - icon_key (text, default 'shield') — maps to a lucide icon
   - sort_order (int, default 0)
   - created_at (timestamptz)

3. `gallery_items` — Meme gallery images with captions.
   - id (uuid, PK)
   - image_url (text, not null)
   - caption (text, not null)
   - sort_order (int, default 0)
   - created_at (timestamptz)

4. `heartbreak_quotes` — Heartbreak archive quotes.
   - id (uuid, PK)
   - text (text, not null)
   - sort_order (int, default 0)
   - created_at (timestamptz)

5. `ex_files` — "Ex Files" modal breakup quotes.
   - id (uuid, PK)
   - text (text, not null)
   - sort_order (int, default 0)
   - created_at (timestamptz)

6. `origin_chapters` — Origin story timeline chapters.
   - id (uuid, PK)
   - chapter (text, not null) — e.g. "Chapter 01"
   - title (text, not null)
   - body (text, not null)
   - sort_order (int, default 0)
   - created_at (timestamptz)

7. `site_stats` — Single-row table for the "Dramatic Entries" counter.
   - id (int, PK, always 1)
   - dramatic_entries (bigint, default 1247)
   - updated_at (timestamptz)

## Security
- RLS enabled on all tables.
- All policies use `TO anon, authenticated` (no auth screen in this app).
- Full CRUD allowed for all visitors — the data is intentionally public and editable.
- `USING (true)` / `WITH CHECK (true)` is intentional: this is a single-tenant
  public parody site with no private user data.

## Seed Data
- All tables are seeded with the default content from the website's content file
  so the app works identically before and after the database is connected.
*/

-- ============================================================
-- 1. dialogues
-- ============================================================
CREATE TABLE IF NOT EXISTS dialogues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dialogues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dialogues" ON dialogues;
CREATE POLICY "anon_select_dialogues" ON dialogues FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dialogues" ON dialogues;
CREATE POLICY "anon_insert_dialogues" ON dialogues FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_dialogues" ON dialogues;
CREATE POLICY "anon_update_dialogues" ON dialogues FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_dialogues" ON dialogues;
CREATE POLICY "anon_delete_dialogues" ON dialogues FOR DELETE
TO anon, authenticated USING (true);

-- ============================================================
-- 2. darbar_members
-- ============================================================
CREATE TABLE IF NOT EXISTS darbar_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon_key text NOT NULL DEFAULT 'shield',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE darbar_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_darbar" ON darbar_members;
CREATE POLICY "anon_select_darbar" ON darbar_members FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_darbar" ON darbar_members;
CREATE POLICY "anon_insert_darbar" ON darbar_members FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_darbar" ON darbar_members;
CREATE POLICY "anon_update_darbar" ON darbar_members FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_darbar" ON darbar_members;
CREATE POLICY "anon_delete_darbar" ON darbar_members FOR DELETE
TO anon, authenticated USING (true);

-- ============================================================
-- 3. gallery_items
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery" ON gallery_items;
CREATE POLICY "anon_select_gallery" ON gallery_items FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery_items;
CREATE POLICY "anon_insert_gallery" ON gallery_items FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gallery" ON gallery_items;
CREATE POLICY "anon_update_gallery" ON gallery_items FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery_items;
CREATE POLICY "anon_delete_gallery" ON gallery_items FOR DELETE
TO anon, authenticated USING (true);

-- ============================================================
-- 4. heartbreak_quotes
-- ============================================================
CREATE TABLE IF NOT EXISTS heartbreak_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE heartbreak_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_heartbreak" ON heartbreak_quotes;
CREATE POLICY "anon_select_heartbreak" ON heartbreak_quotes FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_heartbreak" ON heartbreak_quotes;
CREATE POLICY "anon_insert_heartbreak" ON heartbreak_quotes FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_heartbreak" ON heartbreak_quotes;
CREATE POLICY "anon_update_heartbreak" ON heartbreak_quotes FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_heartbreak" ON heartbreak_quotes;
CREATE POLICY "anon_delete_heartbreak" ON heartbreak_quotes FOR DELETE
TO anon, authenticated USING (true);

-- ============================================================
-- 5. ex_files
-- ============================================================
CREATE TABLE IF NOT EXISTS ex_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ex_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_exfiles" ON ex_files;
CREATE POLICY "anon_select_exfiles" ON ex_files FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_exfiles" ON ex_files;
CREATE POLICY "anon_insert_exfiles" ON ex_files FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_exfiles" ON ex_files;
CREATE POLICY "anon_update_exfiles" ON ex_files FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_exfiles" ON ex_files;
CREATE POLICY "anon_delete_exfiles" ON ex_files FOR DELETE
TO anon, authenticated USING (true);

-- ============================================================
-- 6. origin_chapters
-- ============================================================
CREATE TABLE IF NOT EXISTS origin_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE origin_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chapters" ON origin_chapters;
CREATE POLICY "anon_select_chapters" ON origin_chapters FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chapters" ON origin_chapters;
CREATE POLICY "anon_insert_chapters" ON origin_chapters FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chapters" ON origin_chapters;
CREATE POLICY "anon_update_chapters" ON origin_chapters FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chapters" ON origin_chapters;
CREATE POLICY "anon_delete_chapters" ON origin_chapters FOR DELETE
TO anon, authenticated USING (true);

-- ============================================================
-- 7. site_stats (single-row counter)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_stats (
  id int PRIMARY KEY DEFAULT 1,
  dramatic_entries bigint NOT NULL DEFAULT 1247,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_stats" ON site_stats;
CREATE POLICY "anon_select_stats" ON site_stats FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_stats" ON site_stats;
CREATE POLICY "anon_insert_stats" ON site_stats FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_stats" ON site_stats;
CREATE POLICY "anon_update_stats" ON site_stats FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_stats" ON site_stats;
CREATE POLICY "anon_delete_stats" ON site_stats FOR DELETE
TO anon, authenticated USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Dialogues
INSERT INTO dialogues (text, sort_order) VALUES
('Arey miya, apun ka naam sunaich hoga!', 1),
('Kya bolte public, hau na?', 2),
('Kaiku tension lete miya, apun abhi zinda hai!', 3),
('Dil toh toota, lekin style nai toota!', 4),
('KPHB se Hyderabad tak, apna ich alag scene hai!', 5),
('Prema lo poet... breakup lo villain!', 6),
('Bawa, light le... Katana miya aare!', 7)
ON CONFLICT DO NOTHING;

-- Darbar members
INSERT INTO darbar_members (nickname, title, description, icon_key, sort_order) VALUES
('Chai Bhai', 'The Right Hand', 'Chief of Chai Operations. Knows every Irani cafe from KPHB to Old City. Can negotiate peace over one cup.', 'tea', 1),
('Gone Bhai', 'The Bodyguard', 'Always missing during emergencies. Legend says he went to get biryani in 2019 and is still on the way.', 'shield', 2),
('Khabri Bhai', 'The Informer', 'Knows all the gossip before it even happens. Human WhatsApp status feed of the entire KPHB.', 'ear', 3),
('Plan Bhai', 'The Minister', 'Handles all the group plans. 90% of plans never happen, but the 10% that do are cinematic.', 'scroll', 4),
('Silent Bhai', 'The Mystic', 'Speaks only in nods. One nod = full agreement. Two nods = you are in danger, miya.', 'eye', 5),
('Biryani Bhai', 'The Supplier', 'Can procure biryani at any hour, any location. The real power behind the Darbar.', 'utensils', 6)
ON CONFLICT DO NOTHING;

-- Gallery items
INSERT INTO gallery_items (image_url, caption, sort_order) VALUES
('https://images.pexels.com/photos/8937078/pexels-photo-8937078.jpeg?auto=compress&cs=tinysrgb&w=600', 'When someone says "light le" but you are already the light, miya.', 1),
('https://images.pexels.com/photos/18136205/pexels-photo-18136205.jpeg?auto=compress&cs=tinysrgb&w=600', 'Profile picture before heartbreak vs. after. Guess which is which.', 2),
('https://images.pexels.com/photos/1707640/pexels-photo-1707640.jpeg?auto=compress&cs=tinysrgb&w=600', 'The Darbar meeting. Yes, we discuss biryani and world domination.', 3),
('https://images.pexels.com/photos/29957560/pexels-photo-29957560.jpeg?auto=compress&cs=tinysrgb&w=600', 'Dramatic entry #847. The public was not ready, miya.', 4),
('https://images.pexels.com/photos/6188/street-graffiti-bricks-wall.jpg?auto=compress&cs=tinysrgb&w=600', 'KPHB ki deewar pe apun ka tagline. Art is not dead, it just has attitude.', 5),
('https://images.pexels.com/photos/6892527/pexels-photo-6892527.jpeg?auto=compress&cs=tinysrgb&w=600', 'Official portrait. No, you cannot have a copy. It is classified.', 6),
('https://images.pexels.com/photos/1366851/pexels-photo-1366851.jpeg?auto=compress&cs=tinysrgb&w=600', 'The alley where Katana was born. Okay, maybe just where he got chai once.', 7),
('https://images.pexels.com/photos/14754790/pexels-photo-14754790.jpeg?auto=compress&cs=tinysrgb&w=600', 'Fans painted the whole town. We asked them to stop. They did not.', 8)
ON CONFLICT DO NOTHING;

-- Heartbreak quotes
INSERT INTO heartbreak_quotes (text, sort_order) VALUES
('Dil ka mamla tha miya... abhi khallas!', 1),
('Seen pe chhod diya, toh apun ne zindagi pe chhod diya.', 2),
('Prema lo padithe poet... breakup aithe mass hero.', 3),
('No more tears, only biryani and peace.', 4)
ON CONFLICT DO NOTHING;

-- Ex files
INSERT INTO ex_files (text, sort_order) VALUES
('Usne choda... apun ne Hyderabad choda nahi. KPHB toh apun ka rehta miya!', 1),
('Breakup ke baad apun 3 din roya... phir 3 plate biryani kha gaya. Balance restored.', 2),
('Wo ja sakti hai, lekin apun ka style nahi. Style is permanent, miya.', 3),
('Apun ka dil toota, lekin usme se seena naya nikla. Mass origin story!', 4),
('Ishq tha ya illusion? Abhi toh sirf Hyderabadi biryani pe vishwas hai.', 5),
('Seen ke phatte se sunsaan... lekin KPHB ki galliyan abhi bhi apun ka naam goonjti hain.', 6)
ON CONFLICT DO NOTHING;

-- Origin chapters
INSERT INTO origin_chapters (chapter, title, body, sort_order) VALUES
('Chapter 01', 'The Entry', 'Ek aam ladka... lekin sapne nawabi. KPHB ki galliyon mein shuru hui Katana ki kahani.', 1),
('Chapter 02', 'The Ishq', 'Dil se mohabbat kiya miya... lekin kismat ne alag hi game khela.', 2),
('Chapter 03', 'The Breakup', 'Prema poyindi... pogaru migilindi. Abhi toh apun ka asli cinematic arc shuru hua.', 3),
('Chapter 04', 'The Katana Era', 'Ab apun apni hi duniya ka hero hai. Friends ke saath full hungama, aur har din ek naya drama.', 4)
ON CONFLICT DO NOTHING;

-- Site stats (single row)
INSERT INTO site_stats (id, dramatic_entries) VALUES (1, 1247)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_dialogues_sort ON dialogues (sort_order);
CREATE INDEX IF NOT EXISTS idx_darbar_sort ON darbar_members (sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_sort ON gallery_items (sort_order);
CREATE INDEX IF NOT EXISTS idx_heartbreak_sort ON heartbreak_quotes (sort_order);
CREATE INDEX IF NOT EXISTS idx_exfiles_sort ON ex_files (sort_order);
CREATE INDEX IF NOT EXISTS idx_chapters_sort ON origin_chapters (sort_order);
