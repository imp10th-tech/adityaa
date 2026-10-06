import { supabase } from '@/lib/supabase';
import {
  HERO_FALLBACK,
  LEGEND_FALLBACK,
  CHARACTER_FALLBACK,
  ORIGIN_FALLBACK,
  ORIGIN_FALLBACK_HEADING,
  DIALOGUES_FALLBACK,
  DIALOGUES_FALLBACK_HEADING,
  RAP_FALLBACK,
  ANTHEM_FALLBACK,
  FRIENDS_FALLBACK,
  DARBAR_FALLBACK_HEADING,
  MEMES_FALLBACK,
  GALLERY_FALLBACK_HEADINGS,
  HYDERABAD_FALLBACK,
  FOOTER_FALLBACK,
  CHAR_STATS_FALLBACK,
  STATS_FALLBACK,
  SIDEKICK_FALLBACK,
  SIDEKICK_SECTION_FALLBACK,
  type CharacterDetail,
  type TimelineChapter,
  type FriendCard,
  type MemeItem,
  type CharStat,
  type SidekickRole,
  type MemberStat,
} from '@/data/content';

// ---- Types ----

export interface SiteSettings {
  [key: string]: string;
}

export interface SettingRow {
  key: string;
  value: string;
  category: string;
}

// ---- Fetch all site settings as a map ----

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, category');
  if (error || !data) return {};
  const map: SiteSettings = {};
  data.forEach((r: SettingRow) => {
    map[r.key] = r.value;
  });
  return map;
}

// ---- Typed fetchers with fallback ----

export function getSetting(settings: SiteSettings, key: string, fallback: string): string {
  return settings[key] !== undefined && settings[key] !== '' ? settings[key] : fallback;
}

export async function fetchCharacterDetails(): Promise<CharacterDetail[]> {
  const { data, error } = await supabase
    .from('character_details')
    .select('label, value, icon_key, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) return CHARACTER_FALLBACK;
  return data.map((r) => ({
    label: r.label,
    value: r.value,
    icon: r.icon_key,
  }));
}

export async function fetchOriginStory(): Promise<TimelineChapter[]> {
  const { data, error } = await supabase
    .from('origin_chapters')
    .select('chapter, title, body, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) return ORIGIN_FALLBACK;
  return data.map((r) => ({
    chapter: r.chapter,
    title: r.title,
    text: r.body,
  }));
}

export async function fetchDialogues(): Promise<string[]> {
  const { data, error } = await supabase
    .from('dialogues')
    .select('text, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) return DIALOGUES_FALLBACK;
  return data.map((r) => r.text);
}

export async function fetchSongLyrics(): Promise<string[]> {
  const { data, error } = await supabase
    .from('song_lyrics')
    .select('line, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) return RAP_FALLBACK;
  return data.map((r) => r.line);
}

export async function fetchDarbar(): Promise<(FriendCard & { id: string; imageUrl: string | null })[]> {
  const { data, error } = await supabase
    .from('darbar_members')
    .select('id, nickname, title, description, icon_key, image_url, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) {
    return FRIENDS_FALLBACK.map((f, i) => ({ ...f, id: `fallback-${i}`, imageUrl: null }));
  }
  return data.map((r) => ({
    id: r.id,
    nickname: r.nickname,
    title: r.title,
    description: r.description,
    emoji: r.icon_key,
    imageUrl: r.image_url,
  }));
}

export async function fetchDarbarStats(memberId: string): Promise<MemberStat[]> {
  const { data, error } = await supabase
    .from('darbar_member_stats')
    .select('stat_name, stat_value, stat_max, sort_order')
    .eq('member_id', memberId)
    .order('sort_order');
  if (error || !data || data.length === 0) return [];
  return data.map((r) => ({
    statName: r.stat_name,
    statValue: r.stat_value,
    statMax: r.stat_max,
  }));
}

export async function fetchGallery(): Promise<MemeItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('image_url, caption, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) return MEMES_FALLBACK;
  return data.map((r) => ({
    url: r.image_url,
    caption: r.caption,
  }));
}

// ---- Character stats ----

export async function fetchCharStats(): Promise<CharStat[]> {
  const { data, error } = await supabase
    .from('character_stats')
    .select('stat_name, stat_value, stat_max, icon_key, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) return CHAR_STATS_FALLBACK;
  return data.map((r) => ({
    name: r.stat_name,
    value: r.stat_value,
    max: r.stat_max,
    icon: r.icon_key,
  }));
}

// ---- Sidekick roles ----

export async function fetchSidekickRoles(): Promise<SidekickRole[]> {
  const { data, error } = await supabase
    .from('sidekick_roles')
    .select('role_name, role_title, description, icon_key, card_color, sort_order')
    .order('sort_order');
  if (error || !data || data.length === 0) return SIDEKICK_FALLBACK;
  return data.map((r) => ({
    roleName: r.role_name,
    roleTitle: r.role_title,
    description: r.description,
    icon: r.icon_key,
    cardColor: r.card_color,
  }));
}

// ---- Export fallbacks for direct component use ----

export {
  HERO_FALLBACK,
  LEGEND_FALLBACK,
  CHARACTER_FALLBACK,
  ORIGIN_FALLBACK,
  ORIGIN_FALLBACK_HEADING,
  DIALOGUES_FALLBACK,
  DIALOGUES_FALLBACK_HEADING,
  RAP_FALLBACK,
  ANTHEM_FALLBACK,
  FRIENDS_FALLBACK,
  DARBAR_FALLBACK_HEADING,
  MEMES_FALLBACK,
  GALLERY_FALLBACK_HEADINGS,
  HYDERABAD_FALLBACK,
  FOOTER_FALLBACK,
  CHAR_STATS_FALLBACK,
  STATS_FALLBACK,
  SIDEKICK_FALLBACK,
  SIDEKICK_SECTION_FALLBACK,
};
