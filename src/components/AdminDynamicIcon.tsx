import * as LucideIcons from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

const FALLBACK_ICON = LucideIcons.HelpCircle;

export function AdminDynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  if (!name) return <FALLBACK_ICON {...props} />;
  const key = name.trim().replace(/[^a-zA-Z0-9]/g, '');
  if (!key) return <FALLBACK_ICON {...props} />;
  const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
  const icon = (LucideIcons as Record<string, unknown>)[pascalKey] ?? (LucideIcons as Record<string, unknown>)[pascalKey + 'Icon'];
  const IconComponent = (icon && (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)))
    ? icon as LucideIcon
    : FALLBACK_ICON;
  return <IconComponent {...props} />;
}
