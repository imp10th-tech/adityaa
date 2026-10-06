import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CinematicIntro } from '@/components/CinematicIntro';
import { CountdownLaunch } from '@/components/CountdownLaunch';
import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { MusicProvider } from '@/context/MusicContext';
import { AuthProvider } from '@/context/AuthContext';
import { Hero } from '@/components/sections/Hero';
import { fetchSiteSettings, getSetting } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

const CinematicEnding = lazy(() => import('@/components/sections/CinematicEnding').then(m => ({ default: m.CinematicEnding })));
const Legend = lazy(() => import('@/components/sections/Legend').then(m => ({ default: m.Legend })));
const OriginStory = lazy(() => import('@/components/sections/OriginStory').then(m => ({ default: m.OriginStory })));
const Anthem = lazy(() => import('@/components/sections/Anthem').then(m => ({ default: m.Anthem })));
const CharacterStats = lazy(() => import('@/components/sections/CharacterStats').then(m => ({ default: m.CharacterStats })));
const Dialogues = lazy(() => import('@/components/sections/Dialogues').then(m => ({ default: m.Dialogues })));
const Darbar = lazy(() => import('@/components/sections/Darbar').then(m => ({ default: m.Darbar })));
const Sidekick = lazy(() => import('@/components/sections/Sidekick').then(m => ({ default: m.Sidekick })));
const Hyderabad = lazy(() => import('@/components/sections/Hyderabad').then(m => ({ default: m.Hyderabad })));
const Gallery = lazy(() => import('@/components/sections/Gallery').then(m => ({ default: m.Gallery })));
const Footer = lazy(() => import('@/components/sections/Footer').then(m => ({ default: m.Footer })));
const AdminPage = lazy(() => import('@/components/admin/AdminPage').then(m => ({ default: m.AdminPage })));
const LyricsPage = lazy(() => import('@/components/sections/LyricsPage').then(m => ({ default: m.LyricsPage })));

function SectionFallback() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-katana-crimson/30 border-t-katana-crimson rounded-full animate-spin" />
    </div>
  );
}

type Phase = 'loading' | 'intro' | 'site';

function getRoute(): 'site' | 'admin' | 'lyrics' {
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  if (hash === '#admin' || path === '/admin' || hash === '#/admin') return 'admin';
  if (hash === '#lyrics') return 'lyrics';
  return 'site';
}

function SiteContent({ phase, setPhase }: { phase: Phase; setPhase: (p: Phase) => void }) {
  const [showEnding, setShowEnding] = useState(false);
  const endingTriggered = useRef(false);

  useEffect(() => {
    document.body.style.overflow = phase === 'site' ? '' : 'hidden';
  }, [phase]);

  useEffect(() => {
    if (phase !== 'site') return;

    const checkScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollPos >= docHeight - 200 && !endingTriggered.current) {
        endingTriggered.current = true;
        setShowEnding(true);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [phase]);

  return (
    <>
      {phase === 'loading' && <LoadingScreen onComplete={() => setPhase('intro')} />}
      {phase === 'intro' && <CinematicIntro onComplete={() => setPhase('site')} />}
      {phase === 'site' && (
        <>
          <CustomCursor />
          <Navbar />
          <main>
            <Suspense fallback={<SectionFallback />}>
              <Hero />
              <Legend />
              <CharacterStats />
              <OriginStory />
              <Anthem />
              <Dialogues />
              <Darbar />
              <Sidekick />
              <Hyderabad />
              <Gallery />
            </Suspense>
          </main>
          <Suspense fallback={<SectionFallback />}>
            <Footer />
          </Suspense>
          {showEnding && (
            <Suspense fallback={null}>
              <CinematicEnding onComplete={() => setShowEnding(false)} />
            </Suspense>
          )}
        </>
      )}
    </>
  );
}

function App() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [route, setRoute] = useState<'site' | 'admin' | 'lyrics'>(getRoute());
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route === 'site') {
      fetchSiteSettings().then(setSettings).catch(() => setSettings({}));
    }
  }, [route]);

  if (route === 'admin') {
    return (
      <AuthProvider>
        <Suspense fallback={<SectionFallback />}>
          <AdminPage />
        </Suspense>
      </AuthProvider>
    );
  }

  if (route === 'lyrics') {
    return (
      <Suspense fallback={<SectionFallback />}>
        <LyricsPage />
      </Suspense>
    );
  }

  const launchDateStr = settings ? getSetting(settings, 'launch_date', '') : '';
  const launchDate = launchDateStr ? new Date(launchDateStr).getTime() : 0;
  const showCountdown = launchDate > 0 && launchDate > Date.now();

  if (showCountdown) {
    return (
      <CountdownLaunch onLaunch={() => { window.location.reload(); }} />
    );
  }

  if (settings === null) {
    return (
      <div className="fixed inset-0 bg-katana-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-katana-crimson/30 border-t-katana-crimson rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <MusicProvider>
      <SiteContent phase={phase} setPhase={setPhase} />
    </MusicProvider>
  );
}


export default App;
