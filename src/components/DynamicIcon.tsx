import {
  User, Swords, MapPin, Crown, Zap, Heart, Coffee, Shield,
  Ear, ScrollText, Eye, Utensils, Drama, Sparkles, MessageSquare,
  Brain, PenTool, Camera, HelpCircle,
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  User, Swords, MapPin, Crown, Zap, Heart, Coffee, Shield,
  Ear, ScrollText, Eye, Utensils, Drama, Sparkles, MessageSquare,
  Brain, PenTool, Camera,
};

const FALLBACK_ICON = HelpCircle;

export function getLucideIcon(name: string): LucideIcon {
  if (!name) return FALLBACK_ICON;
  const key = name.trim().replace(/[^a-zA-Z0-9]/g, '');
  if (!key) return FALLBACK_ICON;
  const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
  return ICON_MAP[pascalKey] ?? FALLBACK_ICON;
}

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const IconComponent = getLucideIcon(name);
  return <IconComponent {...props} />;
}
