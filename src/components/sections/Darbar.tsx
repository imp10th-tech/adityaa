import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { SmokeLayer } from '@/components/SmokeLayer';
import { DynamicIcon } from '@/components/DynamicIcon';
import { FRIENDS_FALLBACK, DARBAR_FALLBACK_HEADING, type FriendCard, type MemberStat } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchDarbar, fetchDarbarStats } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

interface DarbarMember extends FriendCard {
  id: string;
  imageUrl: string | null;
}

export function Darbar() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [members, setMembers] = useState<DarbarMember[]>([]);
  const [selected, setSelected] = useState<DarbarMember | null>(null);
  const [stats, setStats] = useState<MemberStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchDarbar().then((data) => {
      setMembers(data as DarbarMember[]);
    }).catch(() => {
      setMembers(FRIENDS_FALLBACK.map((f, i) => ({ ...f, id: `fallback-${i}`, imageUrl: null })));
    });
  }, []);

  const heading = getSetting(settings, 'darbar_heading', DARBAR_FALLBACK_HEADING);

  const openMember = async (member: DarbarMember) => {
    setSelected(member);
    if (!member.id.startsWith('fallback-')) {
      setLoadingStats(true);
      setStats([]);
      const s = await fetchDarbarStats(member.id);
      setStats(s);
      setLoadingStats(false);
    } else {
      setStats([]);
    }
  };

  return (
    <section
      id="darbar"
      className="relative py-24 px-4 bg-gradient-to-b from-katana-black via-katana-coal to-katana-black overflow-hidden"
    >
      <SmokeLayer />
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-center font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            The Inner Circle
          </p>
          <h2 className="text-center font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-6xl tracking-[0.05em] text-glow-crimson">
            {heading}
          </h2>
        </ScrollReveal>

        <SectionDivider label="The Court" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((friend, i) => {
            return (
              <ScrollReveal key={friend.nickname + i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => openMember(friend)}
                  className="katana-border katana-border-glow rounded-sm p-6 bg-katana-coal/50 backdrop-blur-sm h-full group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute -inset-x-full -top-1/2 h-full bg-gradient-to-r from-transparent via-katana-crimson/5 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-sm bg-katana-crimson/10 border border-katana-crimson/30 flex items-center justify-center group-hover:bg-katana-crimson/20 transition-colors overflow-hidden">
                      {friend.imageUrl ? (
                        <img src={friend.imageUrl} alt={friend.nickname} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <DynamicIcon name={friend.emoji} className="w-6 h-6 text-katana-crimson" />
                      )}
                    </div>
                    <div>
                      <p className="font-display font-600 text-katana-gold text-sm uppercase tracking-[0.15em]">
                        {friend.title}
                      </p>
                      <p className="font-display text-katana-bone text-xl">{friend.nickname}</p>
                    </div>
                  </div>
                  <p className="font-body text-katana-silver/60 text-sm leading-relaxed">
                    {friend.description}
                  </p>
                  <p className="mt-4 font-body text-katana-crimson/40 text-xs uppercase tracking-wider group-hover:text-katana-crimson transition-colors">
                    Click to view stats →
                  </p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Member detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[500] bg-katana-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="katana-border katana-border-glow rounded-sm bg-katana-coal max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-katana-silver/40 hover:text-katana-crimson z-10">
                <X className="w-6 h-6" />
              </button>

              {/* Header with image */}
              <div className="relative h-48 bg-gradient-to-b from-katana-crimson/20 to-katana-coal overflow-hidden">
                {selected.imageUrl ? (
                  <img src={selected.imageUrl} alt={selected.nickname} className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <DynamicIcon name={selected.emoji} className="w-20 h-20 text-katana-crimson/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-katana-coal via-transparent to-transparent" />
              </div>

              <div className="p-6">
                <p className="font-display font-600 text-katana-gold text-xs uppercase tracking-[0.2em] mb-1">
                  {selected.title}
                </p>
                <h3 className="font-display font-700 text-katana-bone text-3xl mb-3">{selected.nickname}</h3>
                <p className="font-cinematic italic text-katana-silver/70 text-sm mb-6">{selected.description}</p>

                {/* Stats */}
                <div className="pt-4 border-t border-katana-crimson/20">
                  <p className="font-display text-katana-crimson text-sm uppercase tracking-wider mb-4">Character Stats</p>
                  {loadingStats && (
                    <p className="text-katana-silver/40 text-sm text-center py-4">Loading stats...</p>
                  )}
                  {!loadingStats && stats.length === 0 && (
                    <p className="text-katana-silver/40 text-sm text-center py-4">No stats configured yet.</p>
                  )}
                  {stats.length > 0 && (
                    <div className="space-y-3">
                      {stats.map((stat, i) => {
                        const pct = (stat.statValue / stat.statMax) * 100;
                        const isMaxed = stat.statValue >= stat.statMax;
                        return (
                          <motion.div
                            key={stat.statName + i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-body text-katana-silver/70 text-xs uppercase tracking-wide">{stat.statName}</span>
                              <span className={`font-display text-xs tabular-nums ${isMaxed ? 'text-katana-gold' : 'text-katana-silver/60'}`}>
                                {stat.statValue}/{stat.statMax}
                              </span>
                            </div>
                            <div className="h-2 bg-katana-ash/60 rounded-sm overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: i * 0.1 + 0.2, duration: 0.8 }}
                                className={`h-full ${isMaxed ? 'bg-gradient-to-r from-katana-gold to-katana-crimson' : 'bg-gradient-to-r from-katana-blood to-katana-crimson'}`}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
