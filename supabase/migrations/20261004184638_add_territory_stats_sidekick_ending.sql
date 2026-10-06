-- ============================================================
-- 1. territory_landmarks — playful map landmarks for KPHB
-- ============================================================
CREATE TABLE IF NOT EXISTS territory_landmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  x_position int NOT NULL DEFAULT 50,
  y_position int NOT NULL DEFAULT 50,
  icon_key text NOT NULL DEFAULT 'MapPin',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE territory_landmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_landmarks" ON territory_landmarks;
CREATE POLICY "anon_select_landmarks" ON territory_landmarks FOR SELECT
TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_landmarks" ON territory_landmarks;
CREATE POLICY "auth_insert_landmarks" ON territory_landmarks FOR INSERT
TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_landmarks" ON territory_landmarks;
CREATE POLICY "auth_update_landmarks" ON territory_landmarks FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_landmarks" ON territory_landmarks;
CREATE POLICY "auth_delete_landmarks" ON territory_landmarks FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 2. character_stats — RPG-style video game character stats
-- ============================================================
CREATE TABLE IF NOT EXISTS character_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_name text NOT NULL,
  stat_value int NOT NULL DEFAULT 50,
  stat_max int NOT NULL DEFAULT 100,
  icon_key text NOT NULL DEFAULT 'Zap',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_charstats" ON character_stats;
CREATE POLICY "anon_select_charstats" ON character_stats FOR SELECT
TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_charstats" ON character_stats;
CREATE POLICY "auth_insert_charstats" ON character_stats FOR INSERT
TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_charstats" ON character_stats;
CREATE POLICY "auth_update_charstats" ON character_stats FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_charstats" ON character_stats;
CREATE POLICY "auth_delete_charstats" ON character_stats FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 3. sidekick_roles — selectable crew roles with membership card
-- ============================================================
CREATE TABLE IF NOT EXISTS sidekick_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text NOT NULL,
  role_title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon_key text NOT NULL DEFAULT 'Users',
  card_color text NOT NULL DEFAULT 'crimson',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sidekick_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sidekick" ON sidekick_roles;
CREATE POLICY "anon_select_sidekick" ON sidekick_roles FOR SELECT
TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_sidekick" ON sidekick_roles;
CREATE POLICY "auth_insert_sidekick" ON sidekick_roles FOR INSERT
TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_sidekick" ON sidekick_roles;
CREATE POLICY "auth_update_sidekick" ON sidekick_roles FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_sidekick" ON sidekick_roles;
CREATE POLICY "auth_delete_sidekick" ON sidekick_roles FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 4. darbar_member_stats — per-member RPG stats
-- ============================================================
CREATE TABLE IF NOT EXISTS darbar_member_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL,
  stat_name text NOT NULL,
  stat_value int NOT NULL DEFAULT 50,
  stat_max int NOT NULL DEFAULT 100,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE darbar_member_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_darbarstats" ON darbar_member_stats;
CREATE POLICY "anon_select_darbarstats" ON darbar_member_stats FOR SELECT
TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_darbarstats" ON darbar_member_stats;
CREATE POLICY "auth_insert_darbarstats" ON darbar_member_stats FOR INSERT
TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_darbarstats" ON darbar_member_stats;
CREATE POLICY "auth_update_darbarstats" ON darbar_member_stats FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_darbarstats" ON darbar_member_stats;
CREATE POLICY "auth_delete_darbarstats" ON darbar_member_stats FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 5. Add image_url column to darbar_members
-- ============================================================
ALTER TABLE darbar_members ADD COLUMN IF NOT EXISTS image_url text;

-- ============================================================
-- 6. Seed territory landmarks
-- ============================================================
INSERT INTO territory_landmarks (name, description, x_position, y_position, icon_key, sort_order) VALUES
('Katana HQ', 'The secret penthouse where all master plans are dreamed up over chai.', 50, 45, 'Crown', 1),
('Chai Point Alpha', 'The Irani cafe where every alliance is forged over one cup.', 25, 30, 'Coffee', 2),
('Biryani Junction', 'Strategic biryani supply point. Never runs dry, never surrenders.', 72, 55, 'Utensils', 3),
('Drama Chowk', 'Where every heartbreak status is composed and posted live.', 40, 65, 'Heart', 4),
('Silent Tower', 'Where Silent Bhai nods once and the entire KPHB falls in line.', 65, 25, 'Eye', 5),
('Gone Bhai Last Seen', 'The spot where Gone Bhai was last spotted. 2019. Still missing.', 80, 70, 'Shield', 6),
('Style Boulevard', 'The main strip where Katana does his dramatic slow-motion walks.', 20, 70, 'Sparkles', 7),
('Plan Bhai Bunker', 'Underground command center for plans that never happen.', 55, 80, 'ScrollText', 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. Seed character_stats (Katana's RPG stats)
-- ============================================================
INSERT INTO character_stats (stat_name, stat_value, stat_max, icon_key, sort_order) VALUES
('Attitude', 99, 100, 'Crown', 1),
('Drama Level', 95, 100, 'Drama', 2),
('Style', 92, 100, 'Sparkles', 3),
('Heartbreak Resistance', 30, 100, 'Heart', 4),
('Biryani Consumption', 88, 100, 'Utensils', 5),
('Chai Stamina', 85, 100, 'Coffee', 6),
('Dialogue Delivery', 97, 100, 'MessageSquare', 7),
('Overthinking Speed', 90, 100, 'Brain', 8),
('Loyalty', 100, 100, 'Shield', 9),
('Swag', 96, 100, 'Swords', 10)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. Seed sidekick roles
-- ============================================================
INSERT INTO sidekick_roles (role_name, role_title, description, icon_key, card_color, sort_order) VALUES
('Right-Hand Bawa', 'The Right Hand of Katana', 'Always one step behind the boss. Carries the shades, the attitude, and the spare chai.', 'Swords', 'crimson', 1),
('Dialogue Writer', 'Chief Wordsmith of KPHB', 'Crafts every mass dialogue and WhatsApp status. Words are weapons, miya.', 'PenTool', 'gold', 2),
('Personal Photographer', 'Cinematic Shot Director', 'Captures every dramatic slow-mo entry. Knows the best lighting in every alley.', 'Camera', 'crimson', 3),
('Second-in-Command', 'The Shadow Nawab', 'When Katana is busy overthinking, this person runs the show. No one knows who it is.', 'Shield', 'gold', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. Seed darbar member stats using explicit subquery aliases
-- ============================================================
INSERT INTO darbar_member_stats (member_id, stat_name, stat_value, stat_max, sort_order)
SELECT dm.id, s.stat_name, s.stat_value, s.stat_max, s.sort_order
FROM darbar_members dm
JOIN (
  SELECT 'Chai Bhai' AS nick, 'Chai Brewing' AS stat_name, 100 AS stat_value, 100 AS stat_max, 1 AS sort_order
  UNION ALL SELECT 'Chai Bhai', 'Negotiation', 85, 100, 2
  UNION ALL SELECT 'Chai Bhai', 'Stamina', 90, 100, 3
  UNION ALL SELECT 'Chai Bhai', 'Loyalty', 95, 100, 4
  UNION ALL SELECT 'Chai Bhai', 'Drama', 60, 100, 5
  UNION ALL SELECT 'Gone Bhai', 'Disappearance', 100, 100, 1
  UNION ALL SELECT 'Gone Bhai', 'Biryani Speed', 80, 100, 2
  UNION ALL SELECT 'Gone Bhai', 'Loyalty', 70, 100, 3
  UNION ALL SELECT 'Gone Bhai', 'Mystery', 95, 100, 4
  UNION ALL SELECT 'Gone Bhai', 'Attendance', 10, 100, 5
  UNION ALL SELECT 'Khabri Bhai', 'Intel Gathering', 100, 100, 1
  UNION ALL SELECT 'Khabri Bhai', 'Gossip Speed', 98, 100, 2
  UNION ALL SELECT 'Khabri Bhai', 'Network Size', 95, 100, 3
  UNION ALL SELECT 'Khabri Bhai', 'Stealth', 85, 100, 4
  UNION ALL SELECT 'Khabri Bhai', 'Drama', 50, 100, 5
  UNION ALL SELECT 'Plan Bhai', 'Planning', 95, 100, 1
  UNION ALL SELECT 'Plan Bhai', 'Execution', 15, 100, 2
  UNION ALL SELECT 'Plan Bhai', 'Creativity', 90, 100, 3
  UNION ALL SELECT 'Plan Bhai', 'Optimism', 85, 100, 4
  UNION ALL SELECT 'Plan Bhai', 'Loyalty', 88, 100, 5
  UNION ALL SELECT 'Silent Bhai', 'Silence', 100, 100, 1
  UNION ALL SELECT 'Silent Bhai', 'Observation', 100, 100, 2
  UNION ALL SELECT 'Silent Bhai', 'Intimidation', 92, 100, 3
  UNION ALL SELECT 'Silent Bhai', 'Loyalty', 100, 100, 4
  UNION ALL SELECT 'Silent Bhai', 'Word Count', 5, 100, 5
  UNION ALL SELECT 'Biryani Bhai', 'Biryani Procurement', 100, 100, 1
  UNION ALL SELECT 'Biryani Bhai', 'Speed', 88, 100, 2
  UNION ALL SELECT 'Biryani Bhai', 'Negotiation', 75, 100, 3
  UNION ALL SELECT 'Biryani Bhai', 'Loyalty', 90, 100, 4
  UNION ALL SELECT 'Biryani Bhai', 'Drama', 40, 100, 5
) s ON dm.nickname = s.nick
WHERE NOT EXISTS (SELECT 1 FROM darbar_member_stats dms WHERE dms.member_id = dm.id);

-- ============================================================
-- 10. Add new section headings to site_settings
-- ============================================================
INSERT INTO site_settings (key, value, category) VALUES
('territory_heading', 'KATANA KA TERRITORY', 'territory'),
('territory_subheading', 'Welcome to KPHB, miya', 'territory'),
('stats_heading', 'KATANA CHARACTER STATS', 'stats'),
('stats_subheading', 'Abilities of the Nawab of KPHB', 'stats'),
('sidekick_heading', 'BECOME KATANA SIDEKICK', 'sidekick'),
('sidekick_subheading', 'Choose your role in the crew', 'sidekick')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 11. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_landmarks_sort ON territory_landmarks (sort_order);
CREATE INDEX IF NOT EXISTS idx_charstats_sort ON character_stats (sort_order);
CREATE INDEX IF NOT EXISTS idx_sidekick_sort ON sidekick_roles (sort_order);
CREATE INDEX IF NOT EXISTS idx_darbarstats_member ON darbar_member_stats (member_id);
CREATE INDEX IF NOT EXISTS idx_darbarstats_sort ON darbar_member_stats (sort_order);
