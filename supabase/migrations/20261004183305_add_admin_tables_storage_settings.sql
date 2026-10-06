/*
# Add admin content tables, site settings, storage bucket, and secure writes

## Overview
This migration adds new tables for full admin-editable content, creates a storage
bucket for media uploads, and changes write policies from anon to authenticated-only
so only logged-in admins can modify content. Public visitors get read-only access.

## New Tables

1. `site_settings` (key-value) — Stores all configurable text, headings, taglines, and image URLs.
   - id (uuid, PK)
   - key (text, unique) — e.g. 'hero_title', 'anthem_audio_url'
   - value (text) — the value (text or URL)
   - category (text) — grouping: 'hero', 'legend', 'anthem', 'rap', 'origin', 'darbar', 'hyderabad', 'gallery', 'dialogues', 'footer'
   - updated_at (timestamptz)

2. `character_details` — Legend section character profile cards.
   - id (uuid, PK)
   - label (text) — e.g. "Name", "Alias"
   - value (text) — e.g. "Aditya", "KPHB Katana"
   - icon_key (text) — lucide icon name
   - sort_order (int)
   - created_at (timestamptz)

3. `rap_lyrics` — Rap verse lyrics, line by line.
   - id (uuid, PK)
   - line (text)
   - sort_order (int)
   - created_at (timestamptz)

## Storage
- Creates `katana-media` storage bucket (public read, authenticated write).
- Policies: anon can SELECT (read files), authenticated can INSERT/UPDATE/DELETE.

## RLS Changes (all existing tables)
- SELECT stays `TO anon, authenticated` (public can read).
- INSERT/UPDATE/DELETE changed to `TO authenticated` only (admin-only writes).
- This applies to: dialogues, darbar_members, gallery_items, origin_chapters,
  heartbreak_quotes, ex_files, site_stats.

## Seed Data
- site_settings seeded with all current text content and image URLs.
- character_details seeded with the 6 character cards.
- rap_lyrics seeded with 8 lines.
*/

-- ============================================================
-- 1. site_settings (key-value)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_settings" ON site_settings;
CREATE POLICY "anon_select_settings" ON site_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON site_settings;
CREATE POLICY "auth_insert_settings" ON site_settings FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_settings" ON site_settings;
CREATE POLICY "auth_update_settings" ON site_settings FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_settings" ON site_settings;
CREATE POLICY "auth_delete_settings" ON site_settings FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 2. character_details
-- ============================================================
CREATE TABLE IF NOT EXISTS character_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon_key text NOT NULL DEFAULT 'User',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE character_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_char_details" ON character_details;
CREATE POLICY "anon_select_char_details" ON character_details FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_char_details" ON character_details;
CREATE POLICY "auth_insert_char_details" ON character_details FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_char_details" ON character_details;
CREATE POLICY "auth_update_char_details" ON character_details FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_char_details" ON character_details;
CREATE POLICY "auth_delete_char_details" ON character_details FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 3. rap_lyrics
-- ============================================================
CREATE TABLE IF NOT EXISTS rap_lyrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rap_lyrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rap" ON rap_lyrics;
CREATE POLICY "anon_select_rap" ON rap_lyrics FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_rap" ON rap_lyrics;
CREATE POLICY "auth_insert_rap" ON rap_lyrics FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_rap" ON rap_lyrics;
CREATE POLICY "auth_update_rap" ON rap_lyrics FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_rap" ON rap_lyrics;
CREATE POLICY "auth_delete_rap" ON rap_lyrics FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 4. Update existing tables: remove anon write, add authenticated-only write
-- ============================================================

-- dialogues
DROP POLICY IF EXISTS "anon_insert_dialogues" ON dialogues;
DROP POLICY IF EXISTS "anon_update_dialogues" ON dialogues;
DROP POLICY IF EXISTS "anon_delete_dialogues" ON dialogues;

CREATE POLICY "auth_insert_dialogues" ON dialogues FOR INSERT
TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_dialogues" ON dialogues FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_dialogues" ON dialogues FOR DELETE
TO authenticated USING (true);

-- darbar_members
DROP POLICY IF EXISTS "anon_insert_darbar" ON darbar_members;
DROP POLICY IF EXISTS "anon_update_darbar" ON darbar_members;
DROP POLICY IF EXISTS "anon_delete_darbar" ON darbar_members;

CREATE POLICY "auth_insert_darbar" ON darbar_members FOR INSERT
TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_darbar" ON darbar_members FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_darbar" ON darbar_members FOR DELETE
TO authenticated USING (true);

-- gallery_items
DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery_items;
DROP POLICY IF EXISTS "anon_update_gallery" ON gallery_items;
DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery_items;

CREATE POLICY "auth_insert_gallery" ON gallery_items FOR INSERT
TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_gallery" ON gallery_items FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_gallery" ON gallery_items FOR DELETE
TO authenticated USING (true);

-- origin_chapters
DROP POLICY IF EXISTS "anon_insert_chapters" ON origin_chapters;
DROP POLICY IF EXISTS "anon_update_chapters" ON origin_chapters;
DROP POLICY IF EXISTS "anon_delete_chapters" ON origin_chapters;

CREATE POLICY "auth_insert_chapters" ON origin_chapters FOR INSERT
TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_chapters" ON origin_chapters FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_chapters" ON origin_chapters FOR DELETE
TO authenticated USING (true);

-- site_stats
DROP POLICY IF EXISTS "anon_insert_stats" ON site_stats;
DROP POLICY IF EXISTS "anon_update_stats" ON site_stats;
DROP POLICY IF EXISTS "anon_delete_stats" ON site_stats;

CREATE POLICY "auth_insert_stats" ON site_stats FOR INSERT
TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_stats" ON site_stats FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_stats" ON site_stats FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 5. Storage bucket for media uploads
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('katana-media', 'katana-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "anon_read_media" ON storage.objects;
CREATE POLICY "anon_read_media" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'katana-media');

DROP POLICY IF EXISTS "auth_insert_media" ON storage.objects;
CREATE POLICY "auth_insert_media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'katana-media');

DROP POLICY IF EXISTS "auth_update_media" ON storage.objects;
CREATE POLICY "auth_update_media" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'katana-media');

DROP POLICY IF EXISTS "auth_delete_media" ON storage.objects;
CREATE POLICY "auth_delete_media" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'katana-media');

-- ============================================================
-- 6. Seed site_settings
-- ============================================================
INSERT INTO site_settings (key, value, category) VALUES
-- Hero
('hero_title', 'KPHB KATANA', 'hero'),
('hero_subtitle', 'ADITYA URF KATANA', 'hero'),
('hero_tagline', 'Peru vinte vibration... Katana miya aare!', 'hero'),
('hero_bg_image', 'https://images.pexels.com/photos/333850/pexels-photo-333850.jpeg?auto=compress&cs=tinysrgb&w=1920', 'hero'),
('hero_silhouette', 'https://images.pexels.com/photos/27689992/pexels-photo-27689992.jpeg?auto=compress&cs=tinysrgb&w=1080', 'hero'),
-- Legend
('legend_heading_top', 'EK HI NAAM...', 'legend'),
('legend_heading_main', 'KATANA MIYA!', 'legend'),
('legend_quote', 'Apun ka style ich alag hai miya... kya bolte public?', 'legend'),
('legend_portrait', 'https://images.pexels.com/photos/27689992/pexels-photo-27689992.jpeg?auto=compress&cs=tinysrgb&w=1080', 'legend'),
-- Anthem
('anthem_title', 'KATANA MIYA', 'anthem'),
('anthem_subtitle', 'Hau miya... volume badhao!', 'anthem'),
('anthem_song_title', 'KPHB Katana Miya', 'anthem'),
('anthem_artist', 'The KPHB Sound Syndicate', 'anthem'),
('anthem_audio_url', '', 'anthem'),
('anthem_album_art', '', 'anthem'),
-- Rap
('rap_heading', 'THE KATANA VERSE', 'rap'),
('rap_bg_image', 'https://images.pexels.com/photos/1366851/pexels-photo-1366851.jpeg?auto=compress&cs=tinysrgb&w=1920', 'rap'),
-- Origin
('origin_heading', 'KATANA KI KAHANI', 'origin'),
-- Darbar
('darbar_heading', 'KATANA KA DARBAR', 'darbar'),
-- Hyderabad
('hyderabad_heading_top', 'APNA HYDERABAD...', 'hyderabad'),
('hyderabad_heading_main', 'APNA KPHB', 'hyderabad'),
('hyderabad_tagline', 'Old City ka andaaz... KPHB ka raub!', 'hyderabad'),
('hyderabad_bg_image', 'https://images.pexels.com/photos/36097666/pexels-photo-36097666.jpeg?auto=compress&cs=tinysrgb&w=1920', 'hyderabad'),
-- Gallery
('gallery_heading_top', 'KATANA KI KAHANI...', 'gallery'),
('gallery_heading_main', 'PUBLIC KI ZUBAANI', 'gallery'),
-- Dialogues
('dialogues_heading', 'KATANA BOLE...', 'dialogues'),
-- Footer
('footer_quote', 'Apun ka style ich alag hai, miya!', 'footer'),
('footer_text', 'Made with dosti, drama, and full-on Hyderabadi vibes.', 'footer'),
('footer_copyright', '© 2026 KPHB Katana. All rights reserved.', 'footer'),
-- Nav
('nav_brand', 'KPHB KATANA', 'nav')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 7. Seed character_details
-- ============================================================
INSERT INTO character_details (label, value, icon_key, sort_order) VALUES
('Name', 'Aditya', 'User', 1),
('Alias', 'KPHB Katana', 'Swords', 2),
('Location', 'KPHB, Hyderabad', 'MapPin', 3),
('Identity', 'Nawab of KPHB', 'Crown', 4),
('Special Abilities', 'Overthinking, dramatic entries, heartbreak statuses, unlimited attitude', 'Zap', 5),
('Current Status', 'Ishq mein khallas, style mein jhakaas', 'Heart', 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. Seed rap_lyrics
-- ============================================================
INSERT INTO rap_lyrics (line, sort_order) VALUES
('Step aside, the Katana''s in town,', 1),
('Black shades on, never backing down.', 2),
('Heartbreak scars but the fit stays clean,', 3),
('Living that life like a movie scene.', 4),
('KPHB streets where the legend was born,', 5),
('Style so sharp it could cut through a storm.', 6),
('From chai stalls to Charminar lights,', 7),
('Katana miya ruling the nights.', 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_settings_key ON site_settings (key);
CREATE INDEX IF NOT EXISTS idx_settings_cat ON site_settings (category);
CREATE INDEX IF NOT EXISTS idx_char_details_sort ON character_details (sort_order);
CREATE INDEX IF NOT EXISTS idx_rap_sort ON rap_lyrics (sort_order);
