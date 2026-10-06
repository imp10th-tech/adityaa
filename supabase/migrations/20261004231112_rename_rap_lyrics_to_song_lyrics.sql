/*
# Rename rap_lyrics table to song_lyrics

1. Changes
- Renames the `rap_lyrics` table to `song_lyrics` using ALTER TABLE RENAME.
- All existing data (8 rows) is preserved.
- RLS policies are preserved (they automatically follow the renamed table).
- The `line` column and `sort_order` column remain unchanged.

2. Security
- RLS remains enabled on the renamed table.
- All existing policies continue to apply under the new table name.

3. Important Notes
- No data is lost — this is a pure rename.
- The frontend code will be updated to query `song_lyrics` instead of `rap_lyrics`.
- The admin panel will be updated to manage `song_lyrics` under a "Song Lyrics" tab.
*/

ALTER TABLE rap_lyrics RENAME TO song_lyrics;
