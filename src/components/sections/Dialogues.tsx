import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { CopyButton } from '@/components/CopyButton';
import { DIALOGUES_FALLBACK, DIALOGUES_FALLBACK_HEADING } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchDialogues } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

export function Dialogues() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [quotes, setQuotes] = useState<string[]>(DIALOGUES_FALLBACK);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchDialogues().then(setQuotes).catch(() => {});
  }, []);

  const heading = getSetting(settings, 'dialogues_heading', DIALOGUES_FALLBACK_HEADING);

  useEffect(() => {
    if (quotes.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [quotes.length]);

  const goTo = (i: number) => {
    setActiveIndex(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
  };

  return (
    <section
      id="dialogues"
      className="relative py-24 px-4 bg-gradient-to-b from-katana-black via-katana-coal to-katana-black overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-center font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            Mass Dialogues
          </p>
          <h2 className="text-center font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-6xl tracking-[0.05em] text-glow-crimson">
            {heading}
          </h2>
        </ScrollReveal>

        <SectionDivider label="Public Sunie" />

        <div className="relative min-h-[280px] flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl"
            >
              <Quote className="w-12 h-12 text-katana-crimson/30 mx-auto mb-4" />
              <p className="font-display font-500 text-katana-bone text-xl sm:text-2xl md:text-4xl leading-tight tracking-wide text-glow-crimson">
                {quotes[activeIndex]}
              </p>
              <div className="mt-6 flex justify-center">
                <CopyButton text={quotes[activeIndex]} label="Copy Dialogue" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap max-w-md mx-auto">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? 'bg-katana-crimson w-6' : 'bg-katana-silver/20 hover:bg-katana-silver/40 w-2'
              }`}
              aria-label={`Dialogue ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
