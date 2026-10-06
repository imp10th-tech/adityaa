// Fallback content used when database is unreachable.
// The live site loads everything from Supabase; these are just safety defaults.

export const HERO_FALLBACK = {
  title: 'KPHB KATANA',
  subtitle: 'ADITYA URF KATANA',
  tagline: 'Peru vinte vibration... Katana miya aare!',
  bgImage: 'https://images.pexels.com/photos/333850/pexels-photo-333850.jpeg?auto=compress&cs=tinysrgb&w=1920',
  silhouette: 'https://images.pexels.com/photos/27689992/pexels-photo-27689992.jpeg?auto=compress&cs=tinysrgb&w=1080',
};

export const LEGEND_FALLBACK = {
  headingTop: 'EK HI NAAM...',
  headingMain: 'KATANA MIYA!',
  quote: 'Apun ka style ich alag hai miya... kya bolte public?',
  portrait: 'https://images.pexels.com/photos/27689992/pexels-photo-27689992.jpeg?auto=compress&cs=tinysrgb&w=1080',
};

export interface CharacterDetail {
  label: string;
  value: string;
  icon: string;
}

export const CHARACTER_FALLBACK: CharacterDetail[] = [
  { label: 'Name', value: 'Aditya', icon: 'User' },
  { label: 'Alias', value: 'KPHB Katana', icon: 'Swords' },
  { label: 'Location', value: 'KPHB, Hyderabad', icon: 'MapPin' },
  { label: 'Identity', value: 'Nawab of KPHB', icon: 'Crown' },
  { label: 'Special Abilities', value: 'Overthinking, dramatic entries, heartbreak statuses, unlimited attitude', icon: 'Zap' },
  { label: 'Current Status', value: 'Ishq mein khallas, style mein jhakaas', icon: 'Heart' },
];

export interface TimelineChapter {
  chapter: string;
  title: string;
  text: string;
}

export const ORIGIN_FALLBACK: TimelineChapter[] = [
  { chapter: 'Chapter 01', title: 'The Entry', text: 'Ek aam ladka... lekin sapne nawabi. KPHB ki galliyon mein shuru hui Katana ki kahani.' },
  { chapter: 'Chapter 02', title: 'The Ishq', text: 'Dil se mohabbat kiya miya... lekin kismat ne alag hi game khela.' },
  { chapter: 'Chapter 03', title: 'The Breakup', text: 'Prema poyindi... pogaru migilindi. Abhi toh apun ka asli cinematic arc shuru hua.' },
  { chapter: 'Chapter 04', title: 'The Katana Era', text: 'Ab apun apni hi duniya ka hero hai. Friends ke saath full hungama, aur har din ek naya drama.' },
];

export const DIALOGUES_FALLBACK: string[] = [
  'Arey miya, apun ka naam sunaich hoga!',
  'Kya bolte public, hau na?',
  'Kaiku tension lete miya, apun abhi zinda hai!',
  'Dil toh toota, lekin style nai toota!',
  'KPHB se Hyderabad tak, apna ich alag scene hai!',
  'Prema lo poet... breakup lo villain!',
  'Bawa, light le... Katana miya aare!',
];

export const RAP_FALLBACK: string[] = [
  "Step aside, the Katana's in town,",
  'Black shades on, never backing down.',
  'Heartbreak scars but the fit stays clean,',
  'Living that life like a movie scene.',
  'KPHB streets where the legend was born,',
  'Style so sharp it could cut through a storm.',
  'From chai stalls to Charminar lights,',
  'Katana miya ruling the nights.',
];

export const ANTHEM_FALLBACK = {
  title: 'KATANA MIYA',
  subtitle: 'Hau miya... volume badhao!',
  songTitle: 'KPHB Katana Miya',
  artist: 'The KPHB Sound Syndicate',
  audioUrl: '',
  albumArt: '',
};

export const RAP_FALLBACK_IMAGE = 'https://images.pexels.com/photos/1366851/pexels-photo-1366851.jpeg?auto=compress&cs=tinysrgb&w=1920';

export interface FriendCard {
  nickname: string;
  title: string;
  description: string;
  emoji: string;
  imageUrl?: string | null;
}

export const FRIENDS_FALLBACK: FriendCard[] = [
  { nickname: 'Chai Bhai', title: 'The Right Hand', description: 'Chief of Chai Operations. Knows every Irani cafe from KPHB to Old City. Can negotiate peace over one cup.', emoji: 'Coffee' },
  { nickname: 'Gone Bhai', title: 'The Bodyguard', description: 'Always missing during emergencies. Legend says he went to get biryani in 2019 and is still on the way.', emoji: 'Shield' },
  { nickname: 'Khabri Bhai', title: 'The Informer', description: 'Knows all the gossip before it even happens. Human WhatsApp status feed of the entire KPHB.', emoji: 'Ear' },
  { nickname: 'Plan Bhai', title: 'The Minister', description: 'Handles all the group plans. 90% of plans never happen, but the 10% that do are cinematic.', emoji: 'ScrollText' },
  { nickname: 'Silent Bhai', title: 'The Mystic', description: 'Speaks only in nods. One nod = full agreement. Two nods = you are in danger, miya.', emoji: 'Eye' },
  { nickname: 'Biryani Bhai', title: 'The Supplier', description: 'Can procure biryani at any hour, any location. The real power behind the Darbar.', emoji: 'Utensils' },
];

export interface MemeItem {
  url: string;
  caption: string;
}

export const MEMES_FALLBACK: MemeItem[] = [
  { url: 'https://images.pexels.com/photos/8937078/pexels-photo-8937078.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'When someone says "light le" but you are already the light, miya.' },
  { url: 'https://images.pexels.com/photos/18136205/pexels-photo-18136205.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Profile picture before heartbreak vs. after. Guess which is which.' },
  { url: 'https://images.pexels.com/photos/1707640/pexels-photo-1707640.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'The Darbar meeting. Yes, we discuss biryani and world domination.' },
  { url: 'https://images.pexels.com/photos/29957560/pexels-photo-29957560.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Dramatic entry #847. The public was not ready, miya.' },
  { url: 'https://images.pexels.com/photos/6188/street-graffiti-bricks-wall.jpg?auto=compress&cs=tinysrgb&w=600', caption: 'KPHB ki deewar pe apun ka tagline. Art is not dead, it just has attitude.' },
  { url: 'https://images.pexels.com/photos/6892527/pexels-photo-6892527.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Official portrait. No, you cannot have a copy. It is classified.' },
  { url: 'https://images.pexels.com/photos/1366851/pexels-photo-1366851.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'The alley where Katana was born. Okay, maybe just where he got chai once.' },
  { url: 'https://images.pexels.com/photos/14754790/pexels-photo-14754790.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Fans painted the whole town. We asked them to stop. They did not.' },
];

export const HYDERABAD_FALLBACK = {
  headingTop: 'APNA HYDERABAD...',
  headingMain: 'APNA KPHB',
  tagline: 'Old City ka andaaz... KPHB ka raub!',
  bgImage: 'https://images.pexels.com/photos/36097666/pexels-photo-36097666.jpeg?auto=compress&cs=tinysrgb&w=1920',
};

export const DIALOGUES_FALLBACK_HEADING = 'KATANA BOLE...';
export const GALLERY_FALLBACK_HEADINGS = { top: 'KATANA KI KAHANI...', main: 'PUBLIC KI ZUBAANI' };
export const DARBAR_FALLBACK_HEADING = 'KATANA KA DARBAR';
export const ORIGIN_FALLBACK_HEADING = 'KATANA KI KAHANI';

export const FOOTER_FALLBACK = {
  quote: 'Apun ka style ich alag hai, miya!',
  text: 'Made with dosti, drama, and full-on Hyderabadi vibes.',
  copyright: '© 2026 KPHB Katana. All rights reserved.',
};

// ---- Character Stats ----
export interface CharStat {
  name: string;
  value: number;
  max: number;
  icon: string;
}

export const CHAR_STATS_FALLBACK: CharStat[] = [
  { name: 'Attitude', value: 99, max: 100, icon: 'Crown' },
  { name: 'Drama Level', value: 95, max: 100, icon: 'Drama' },
  { name: 'Style', value: 92, max: 100, icon: 'Sparkles' },
  { name: 'Heartbreak Resistance', value: 30, max: 100, icon: 'Heart' },
  { name: 'Biryani Consumption', value: 88, max: 100, icon: 'Utensils' },
  { name: 'Chai Stamina', value: 85, max: 100, icon: 'Coffee' },
  { name: 'Dialogue Delivery', value: 97, max: 100, icon: 'MessageSquare' },
  { name: 'Overthinking Speed', value: 90, max: 100, icon: 'Brain' },
  { name: 'Loyalty', value: 100, max: 100, icon: 'Shield' },
  { name: 'Swag', value: 96, max: 100, icon: 'Swords' },
];

export const STATS_FALLBACK = {
  heading: 'KATANA CHARACTER STATS',
  subheading: 'Abilities of the Nawab of KPHB',
};

// ---- Sidekick Roles ----
export interface SidekickRole {
  roleName: string;
  roleTitle: string;
  description: string;
  icon: string;
  cardColor: string;
}

export const SIDEKICK_FALLBACK: SidekickRole[] = [
  { roleName: 'Right-Hand Bawa', roleTitle: 'The Right Hand of Katana', description: 'Always one step behind the boss. Carries the shades, the attitude, and the spare chai.', icon: 'Swords', cardColor: 'crimson' },
  { roleName: 'Dialogue Writer', roleTitle: 'Chief Wordsmith of KPHB', description: 'Crafts every mass dialogue and WhatsApp status. Words are weapons, miya.', icon: 'PenTool', cardColor: 'gold' },
  { roleName: 'Personal Photographer', roleTitle: 'Cinematic Shot Director', description: 'Captures every dramatic slow-mo entry. Knows the best lighting in every alley.', icon: 'Camera', cardColor: 'crimson' },
  { roleName: 'Second-in-Command', roleTitle: 'The Shadow Nawab', description: 'When Katana is busy overthinking, this person runs the show. No one knows who it is.', icon: 'Shield', cardColor: 'gold' },
];

export const SIDEKICK_SECTION_FALLBACK = {
  heading: 'JOIN THE KATANA GANG',
  subheading: 'Choose your role in the gang',
};

// ---- Darbar Member Stats ----
export interface MemberStat {
  statName: string;
  statValue: number;
  statMax: number;
}

export const NAV_ITEMS = [
  { label: 'Hero', id: 'hero' },
  { label: 'The Legend', id: 'legend' },
  { label: 'Stats', id: 'stats' },
  { label: 'Origin', id: 'origin' },
  { label: 'Anthem', id: 'anthem' },
  { label: 'Dialogues', id: 'dialogues' },
  { label: 'Darbar', id: 'darbar' },
  { label: 'Gang', id: 'sidekick' },
  { label: 'Hyderabad', id: 'hyderabad' },
  { label: 'Gallery', id: 'gallery' },
];
