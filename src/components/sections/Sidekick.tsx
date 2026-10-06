import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Share2, Check, Sparkles, BadgeCheck, Download } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Particles } from '@/components/Particles';
import { SIDEKICK_FALLBACK, SIDEKICK_SECTION_FALLBACK, type SidekickRole } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchSidekickRoles, LEGEND_FALLBACK, HERO_FALLBACK } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateMemberCode(name: string, roleSalt: string = ''): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const cleanName = name.trim().toLowerCase();
  const seed = cleanName + roleSalt.toLowerCase();
  const prefix = cleanName.slice(0, 3).toUpperCase().padEnd(3, 'X');
  const segments: string[] = [];
  let hash = hashString(seed);
  for (let s = 0; s < 4; s++) {
    let seg = '';
    for (let c = 0; c < 4; c++) {
      seg += chars[hash % chars.length];
      hash = Math.floor(hash / chars.length) + hashString(seed + s + c) * 31;
    }
    segments.push(seg);
  }
  return `KK-${prefix}-${segments.join('-')}`;
}

function formatDateTime(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = now.getFullYear();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} ${month} ${year} · ${time}`;
}

export function Sidekick() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [roles, setRoles] = useState<SidekickRole[]>(SIDEKICK_FALLBACK);
  const [selectedRole, setSelectedRole] = useState<SidekickRole | null>(null);
  const [userName, setUserName] = useState('');
  const [cardGenerated, setCardGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [memberCode, setMemberCode] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [revealStep, setRevealStep] = useState(0);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchSidekickRoles().then(setRoles).catch(() => {});
  }, []);

  const heading = getSetting(settings, 'sidekick_heading', 'JOIN THE KATANA GANG');
  const subheading = getSetting(settings, 'sidekick_subheading', 'Choose your role in the gang');
  const portrait = getSetting(settings, 'legend_portrait', LEGEND_FALLBACK.portrait);
  const heroBg = getSetting(settings, 'hero_bg_image', HERO_FALLBACK.bgImage);

  const isGold = selectedRole?.cardColor === 'gold';

  const handleGenerate = () => {
    if (!userName.trim() || !selectedRole) return;
    setMemberCode(generateMemberCode(userName, selectedRole.roleName));
    setDateTime(formatDateTime());
    setCardGenerated(true);
    setRevealStep(0);
    setTimeout(() => setRevealStep(1), 100);
    setTimeout(() => setRevealStep(2), 500);
    setTimeout(() => setRevealStep(3), 900);
    setTimeout(() => setRevealStep(4), 1300);
    setTimeout(() => setRevealStep(5), 1700);
  };

  const handleShare = () => {
    if (!selectedRole || !userName) return;
    const text = `${userName} is now an official member of KPHB Katana Gang as ${selectedRole.roleTitle}! Member Code: ${memberCode}. Join the gang, miya.`;
    if (navigator.share) {
      navigator.share({ title: 'KPHB Katana Gang', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownload = () => {
    const svgData = buildCertificateSVG();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0a0508';
      ctx.fillRect(0, 0, 1200, 850);
      ctx.drawImage(img, 0, 0, 1200, 850);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = `katana-certificate-${userName.replace(/\s+/g, '-').toLowerCase()}.png`;
        a.click();
        URL.revokeObjectURL(dlUrl);
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  function buildCertificateSVG(): string {
    if (!selectedRole) return '';
    const accent = isGold ? '#d4af37' : '#c8102e';
    const portraitImg = portrait || '';
    const bgImg = heroBg || '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
      <defs>
        <pattern id="bgImg" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
          <image href="${escapeXml(bgImg)}" x="0" y="0" width="1200" height="850" opacity="0.15" preserveAspectRatio="xMidYMidSlice"/>
        </pattern>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0508;stop-opacity:0.92"/>
          <stop offset="50%" style="stop-color:#0f0a0d;stop-opacity:0.95"/>
          <stop offset="100%" style="stop-color:#0a0508;stop-opacity:0.92"/>
        </linearGradient>
        <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent"/>
          <circle cx="1" cy="1" r="0.3" fill="${accent}" opacity="0.03"/>
        </pattern>
      </defs>
      <rect width="1200" height="850" fill="url(#bgImg)"/>
      <rect width="1200" height="850" fill="url(#bgGrad)"/>
      <rect width="1200" height="850" fill="url(#grain)"/>
      <rect x="20" y="20" width="1160" height="810" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>
      <rect x="35" y="35" width="1130" height="780" fill="none" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <text x="600" y="80" text-anchor="middle" font-family="serif" font-size="14" fill="${accent}" letter-spacing="8" opacity="0.7">KPHB KATANA GANG</text>
      <line x1="480" y1="95" x2="720" y2="95" stroke="${accent}" stroke-width="1" opacity="0.4"/>
      <text x="600" y="150" text-anchor="middle" font-family="serif" font-size="36" fill="#e8e2d5" font-weight="bold" letter-spacing="3">CERTIFICATE OF MEMBERSHIP</text>
      <text x="600" y="185" text-anchor="middle" font-family="serif" font-size="14" fill="#9b9588" letter-spacing="4" opacity="0.6">This is to certify that</text>
      <text x="600" y="255" text-anchor="middle" font-family="serif" font-size="48" fill="#e8e2d5" font-weight="bold">${escapeXml(userName)}</text>
      <line x1="350" y1="275" x2="850" y2="275" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <text x="600" y="300" text-anchor="middle" font-family="serif" font-size="18" fill="#9b9588" letter-spacing="2" opacity="0.5">is</text>
      <text x="600" y="350" text-anchor="middle" font-family="serif" font-size="16" fill="#9b9588" letter-spacing="3" opacity="0.6">an official member of</text>
      <text x="600" y="375" text-anchor="middle" font-family="serif" font-size="32" fill="${accent}" font-weight="bold">KPHB KATANA GANG</text>
      <text x="600" y="410" text-anchor="middle" font-family="serif" font-size="16" fill="#9b9588" letter-spacing="2" opacity="0.5">aka Aditya urf Katana</text>
      <text x="600" y="460" text-anchor="middle" font-family="serif" font-size="14" fill="#9b9588" font-style="italic" opacity="0.5">"${escapeXml(selectedRole.roleTitle)}"</text>
      <text x="600" y="540" text-anchor="middle" font-family="monospace" font-size="13" fill="#9b9588" letter-spacing="3" opacity="0.5">MEMBER CODE</text>
      <text x="600" y="575" text-anchor="middle" font-family="monospace" font-size="24" fill="#e8e2d5" font-weight="bold" letter-spacing="2">${memberCode}</text>
      <text x="200" y="700" text-anchor="start" font-family="serif" font-size="14" fill="#9b9588" opacity="0.5">Date of Issue</text>
      <line x1="200" y1="715" x2="380" y2="715" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <text x="200" y="740" text-anchor="start" font-family="serif" font-size="14" fill="#e8e2d5">${escapeXml(dateTime)}</text>
      <text x="1000" y="700" text-anchor="end" font-family="serif" font-size="14" fill="#9b9588" opacity="0.5">Authorized by</text>
      <line x1="820" y1="715" x2="1000" y2="715" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <text x="1000" y="740" text-anchor="end" font-family="serif" font-size="14" fill="#e8e2d5" font-style="italic">Aditya urf Katana</text>
      <text x="600" y="800" text-anchor="middle" font-family="serif" font-size="12" fill="#6b6560" font-style="italic" opacity="0.4">Mamalne evadra appedhi igaa, padhandi chusukundham</text>
      <circle cx="1060" cy="100" r="35" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>
      <clipPath id="stampClip"><circle cx="1060" cy="100" r="33"/></clipPath>
      ${portraitImg ? `<image href="${escapeXml(portraitImg)}" x="1027" y="67" width="66" height="66" clip-path="url(#stampClip)" opacity="0.7"/>` : `<circle cx="1060" cy="100" r="33" fill="${accent}" opacity="0.1"/>`}
      <text x="1060" y="155" text-anchor="middle" font-family="serif" font-size="8" fill="${accent}" letter-spacing="2" opacity="0.5">OFFICIAL</text>
    </svg>`;
  }

  return (
    <section
      id="sidekick"
      className="relative py-24 px-4 bg-gradient-to-b from-katana-black via-katana-coal to-katana-black overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
      <Particles count={20} color="rgba(212,175,55,0.25)" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-center font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            {subheading}
          </p>
          <h2 className="text-center font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-6xl tracking-[0.05em] text-glow-crimson">
            {heading}
          </h2>
        </ScrollReveal>

        <SectionDivider label="Join the Gang" />

        {/* Role selection cards */}
        {!cardGenerated && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {roles.map((role, i) => {
              const goldCard = role.cardColor === 'gold';
              return (
                <ScrollReveal key={role.roleName + i} delay={i * 0.1}>
                  <motion.button
                    whileHover={{ y: -8, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full h-full min-h-[200px] text-left katana-border rounded-sm p-5 bg-katana-coal/50 backdrop-blur-sm transition-all relative overflow-hidden flex flex-col ${
                      selectedRole?.roleName === role.roleName
                        ? goldCard ? 'border-katana-gold/60 bg-katana-gold/5' : 'border-katana-crimson/60 bg-katana-crimson/5'
                        : ''
                    }`}
                  >
                    {selectedRole?.roleName === role.roleName && (
                      <motion.div
                        layoutId="selected-glow"
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: goldCard
                            ? 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.12), transparent 70%)'
                            : 'radial-gradient(circle at 50% 0%, rgba(200,16,46,0.12), transparent 70%)',
                        }}
                      />
                    )}
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                      className={`w-12 h-12 rounded-sm flex items-center justify-center mb-3 ${
                        goldCard ? 'bg-katana-gold/10 border border-katana-gold/30' : 'bg-katana-crimson/10 border border-katana-crimson/30'
                      }`}
                    >
                      <DynamicIcon name={role.icon} className={`w-5 h-5 ${goldCard ? 'text-katana-gold' : 'text-katana-crimson'}`} />
                    </motion.div>
                    <p className="font-display font-600 text-katana-bone text-base mb-1">{role.roleName}</p>
                    <p className="font-body text-katana-silver/50 text-xs leading-relaxed flex-1">{role.description}</p>
                  </motion.button>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* Name input + generate */}
        {selectedRole && !cardGenerated && (
          <ScrollReveal delay={0.2}>
            <div className="mt-8 max-w-md mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-cinematic text-katana-silver/70 text-sm mb-4"
              >
                You chose <span className={isGold ? 'text-katana-gold' : 'text-katana-crimson'}>{selectedRole.roleName}</span>. Enter your name, miya:
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="Your name..."
                  maxLength={30}
                  className="flex-1 px-4 py-3 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none text-center"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={!userName.trim()}
                  className="px-6 py-3 bg-katana-crimson/20 border border-katana-crimson/40 text-katana-crimson rounded font-display uppercase tracking-wider text-sm hover:bg-katana-crimson/30 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Get Certificate
                </motion.button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Certificate */}
        <AnimatePresence mode="wait">
          {cardGenerated && selectedRole && (
            <motion.div
              key="cert-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 mx-auto"
              style={{ maxWidth: '800px', width: '100%', aspectRatio: '1200 / 850' }}
            >
              <div
                ref={certRef}
                className={`relative w-full h-full overflow-hidden rounded-sm ${isGold ? 'katana-border-glow' : 'katana-border'}`}
                style={{
                  background: `linear-gradient(135deg, rgba(10,5,8,0.92) 0%, rgba(15,10,13,0.95) 50%, rgba(10,5,8,0.92) 100%)`,
                }}
              >
                {/* Hero background image */}
                {heroBg && (
                  <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" />
                )}
                {/* Background pattern */}
                <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(circle at 50% 30%, ${isGold ? 'rgba(212,175,55,0.04)' : 'rgba(200,16,46,0.04)'} 0%, transparent 60%)`,
                }} />

                {/* Border frame */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={revealStep >= 1 ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-[1.5%] border-2 rounded-sm pointer-events-none"
                  style={{ borderColor: isGold ? 'rgba(212,175,55,0.4)' : 'rgba(200,16,46,0.4)' }}
                >
                  <div className="absolute inset-[1.5%] border rounded-sm" style={{ borderColor: isGold ? 'rgba(212,175,55,0.2)' : 'rgba(200,16,46,0.2)' }} />
                </motion.div>

                {/* Portrait stamp in corner */}
                <motion.div
                  initial={{ scale: 0, rotate: -30, opacity: 0 }}
                  animate={revealStep >= 2 ? { scale: 1, rotate: -8, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="absolute top-[4%] right-[4%] z-20"
                >
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 ${
                    isGold ? 'border-katana-gold/50' : 'border-katana-crimson/50'
                  } shadow-lg`}>
                    <img
                      src={portrait}
                      alt="Katana stamp"
                      className="w-full h-full object-cover grayscale opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-katana-black/40 to-transparent" />
                  </div>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-sm text-[7px] sm:text-[8px] font-display uppercase tracking-wider ${
                    isGold ? 'bg-katana-gold/20 text-katana-gold' : 'bg-katana-crimson/20 text-katana-crimson'
                  } whitespace-nowrap`}>
                    Official
                  </div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-[6%] py-[5%] text-center">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={revealStep >= 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-1"
                  >
                    <Swords className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isGold ? 'text-katana-gold' : 'text-katana-crimson'}`} />
                    <span className="font-display font-700 text-katana-bone text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.3em]">
                      KPHB Katana Gang
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={revealStep >= 1 ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className={`h-px w-20 sm:w-24 md:w-32 mb-2 sm:mb-3 ${isGold ? 'bg-katana-gold/30' : 'bg-katana-crimson/30'}`}
                  />

                  {/* Certificate title */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={revealStep >= 2 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="font-cinematic text-katana-silver/40 text-[7px] sm:text-[9px] md:text-xs uppercase tracking-wider mb-1">This is to certify that</p>
                    <p className="font-display font-700 text-katana-bone text-base sm:text-2xl md:text-4xl tracking-[0.05em]">
                      CERTIFICATE OF MEMBERSHIP
                    </p>
                  </motion.div>

                  {/* Member name */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={revealStep >= 3 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-2 sm:mt-3"
                  >
                    <p className="font-display font-700 text-katana-bone text-lg sm:text-3xl md:text-5xl break-words px-2">{userName}</p>
                    <div className={`h-px w-32 sm:w-48 md:w-64 mx-auto mt-2 ${isGold ? 'bg-katana-gold/30' : 'bg-katana-crimson/30'}`} />
                    <p className="font-cinematic text-katana-silver/40 text-[8px] sm:text-[10px] md:text-sm mt-1">is</p>
                  </motion.div>

                  {/* Official member of */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={revealStep >= 4 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-2 sm:mt-3"
                  >
                    <p className="font-body text-katana-silver/40 text-[7px] sm:text-[9px] md:text-xs uppercase tracking-wider mb-1">an official member of</p>
                    <p className={`font-display font-600 text-sm sm:text-xl md:text-2xl ${isGold ? 'text-katana-gold' : 'text-katana-crimson'}`}>
                      KPHB KATANA GANG
                    </p>
                    <p className="font-cinematic italic text-katana-silver/50 text-[8px] sm:text-[10px] md:text-sm mt-1">
                      aka Aditya urf Katana
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <DynamicIcon name={selectedRole.icon} className={`w-3 h-3 sm:w-4 sm:h-4 ${isGold ? 'text-katana-gold' : 'text-katana-crimson'}`} />
                      <span className="font-display text-katana-silver/60 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest">
                        {selectedRole.roleTitle}
                      </span>
                    </div>
                  </motion.div>

                  {/* Member code */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={revealStep >= 5 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="mt-3 sm:mt-4"
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <BadgeCheck className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isGold ? 'text-katana-gold/60' : 'text-katana-crimson/60'}`} />
                      <p className="font-body text-katana-silver/30 text-[6px] sm:text-[8px] md:text-[10px] uppercase tracking-wider">Member Code</p>
                    </div>
                    <motion.p
                      className="font-display text-katana-bone/80 text-[10px] sm:text-sm md:text-base tracking-wider tabular-nums break-all px-2"
                      animate={{ textShadow: isGold
                        ? ['0 0 6px rgba(212,175,55,0.2)', '0 0 12px rgba(212,175,55,0.4)', '0 0 6px rgba(212,175,55,0.2)']
                        : ['0 0 6px rgba(200,16,46,0.2)', '0 0 12px rgba(200,16,46,0.4)', '0 0 6px rgba(200,16,46,0.2)']
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      {memberCode}
                    </motion.p>
                  </motion.div>

                  {/* Small text at bottom */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={revealStep >= 5 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute bottom-[14%] left-0 right-0 font-cinematic italic text-katana-silver/30 text-[7px] sm:text-[9px] md:text-xs px-[8%]"
                  >
                    Mamalne evadra appedhi igaa, padhandi chusukundham
                  </motion.p>

                  {/* Footer: date + signature */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={revealStep >= 5 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="absolute bottom-[5%] left-[6%] right-[6%] flex justify-between items-end"
                  >
                    <div className="text-left">
                      <p className="font-body text-katana-silver/30 text-[6px] sm:text-[8px] md:text-[10px] uppercase tracking-wider">Date of Issue</p>
                      <div className={`h-px w-16 sm:w-28 md:w-36 mt-1 ${isGold ? 'bg-katana-gold/20' : 'bg-katana-crimson/20'}`} />
                      <p className="font-display text-katana-bone/70 text-[7px] sm:text-[10px] md:text-xs mt-1">{dateTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-katana-silver/30 text-[6px] sm:text-[8px] md:text-[10px] uppercase tracking-wider">Authorized by</p>
                      <div className={`h-px w-16 sm:w-28 md:w-36 mt-1 ${isGold ? 'bg-katana-gold/20' : 'bg-katana-crimson/20'}`} />
                      <p className="font-cinematic italic text-katana-bone/70 text-[7px] sm:text-[10px] md:text-xs mt-1">Aditya urf Katana</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={revealStep >= 5 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-3 mt-5"
              >
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 font-display uppercase tracking-wider text-sm text-katana-bone border border-katana-gold/30 bg-katana-gold/10 hover:bg-katana-gold/20 transition-all rounded-sm"
                >
                  <Download className="w-4 h-4" /> Download Certificate
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 font-display uppercase tracking-wider text-sm text-katana-bone border border-katana-silver/20 hover:border-katana-crimson/50 hover:text-katana-crimson transition-all rounded-sm"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Share2 className="w-4 h-4" /> Share</>}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
