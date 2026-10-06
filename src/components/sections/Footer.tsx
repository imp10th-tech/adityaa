import { useState, useEffect } from 'react';
import { Swords, Instagram } from 'lucide-react';
import { Particles } from '@/components/Particles';
import { FOOTER_FALLBACK } from '@/data/content';
import { fetchSiteSettings, getSetting } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const quote = getSetting(settings, 'footer_quote', FOOTER_FALLBACK.quote);
  const text = getSetting(settings, 'footer_text', FOOTER_FALLBACK.text);
  const copyright = getSetting(settings, 'footer_copyright', FOOTER_FALLBACK.copyright);
  const instagramHandle = getSetting(settings, 'footer_instagram', '@kphb.katana');
  const cleanHandle = instagramHandle.replace('@', '');

  const scrollToTop = () => {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative py-16 px-4 bg-katana-black overflow-hidden border-t border-katana-crimson/15">
      <Particles count={15} color="rgba(200,16,46,0.3)" />
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <button onClick={scrollToTop} className="inline-flex items-center gap-3 mb-4 group">
          <Swords className="w-8 h-8 text-katana-crimson group-hover:rotate-12 transition-transform" />
          <span className="font-display font-700 text-katana-bone text-2xl tracking-[0.15em] text-glow-crimson">
            KPHB KATANA
          </span>
        </button>

        <p className="font-cinematic italic text-katana-silver/70 text-base md:text-lg mb-2">
          "{quote}"
        </p>

        <p className="font-body text-katana-silver/40 text-sm mb-6">{text}</p>

        {/* Instagram link */}
        <a
          href={`https://instagram.com/${cleanHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-6 text-katana-silver/50 hover:text-katana-crimson transition-colors group"
        >
          <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-display text-sm tracking-wider">{instagramHandle}</span>
        </a>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-katana-crimson/30" />
          <div className="w-1.5 h-1.5 bg-katana-crimson/40 rotate-45" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-katana-crimson/30" />
        </div>

        <p className="font-body text-katana-silver/20 text-xs tracking-wider">{copyright}</p>
      </div>
    </footer>
  );
}
